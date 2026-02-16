# Google Drive Integration Project Plan

**Date:** 2026-02-16
**Goal:** Add Google login and Google Drive sync functionality to the Set Game application

## Overview

This project will add client-side Google authentication and Google Drive storage to allow users to manually sync their game saves across devices. The implementation will use Google's OAuth 2.0 flow and the Google Drive API entirely from the frontend.

## User Experience

### Authentication Flow
- **Not logged in:** "Login with Google" button appears in top left
- **Logged in:** User profile picture bubble appears in top left
- **User menu:** Clicking the bubble opens a dropdown with three options:
  1. "Save to Google Drive" - Uploads all localStorage saves to Drive
  2. "Load from Google Drive" - Downloads all Drive saves to localStorage
  3. "Logout" - Signs out of Google account

### Storage Strategy
- Games continue to save to localStorage automatically (existing behavior)
- Users manually choose when to sync with Google Drive
- "Save to Google Drive" overwrites Drive with localStorage data
- "Load from Google Drive" overwrites localStorage with Drive data
- No automatic syncing - user has full control

## Phase 1: Google Cloud Setup

### 1. Select Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Select your existing project from the project dropdown

### 2. Enable Required APIs
Enable the following APIs for your project:

- **Google Drive API**
  - Direct link: [Enable Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com)
  - Or navigate to: APIs & Services → Library → Search "Google Drive API" → Enable

- **Google Identity Services API** (Google Sign-In)
  - This is typically enabled by default when you configure OAuth
  - If needed: [APIs & Services Library](https://console.cloud.google.com/apis/library)

### 3. Configure OAuth Consent Screen
- Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- Set up OAuth consent screen:
  - User Type: External (for public access)
  - App name: "Set Game" (or your preferred name)
  - User support email: Your email
  - Authorized domains: `cpoonolly.github.io`
  - Developer contact email: Your email
- Scopes: Click "Add or Remove Scopes" and add:
  - `https://www.googleapis.com/auth/drive.appdata` - See and manage its own configuration data in your Google Drive
- Test users (optional for development): Add your Google account email

### 4. Create OAuth 2.0 Credentials
- Go to [Credentials](https://console.cloud.google.com/apis/credentials)
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Application type: Web application
- Name: "Set Game Web Client" (or your preferred name)
- Authorized JavaScript origins:
  - `http://localhost:5173` (Vite default dev server)
  - `http://localhost:3000` (alternative dev port)
  - `https://cpoonolly.github.io` (production)
- Authorized redirect URIs:
  - `http://localhost:5173` (Vite default dev server)
  - `http://localhost:3000` (alternative dev port)
  - `https://cpoonolly.github.io/set-game` (production with base path)
- Click "Create"
- **Save the Client ID** (will be stored as environment variable)
  - The Client ID will look like: `123456789-abcdefg.apps.googleusercontent.com`
  - You can view it anytime at [Credentials page](https://console.cloud.google.com/apis/credentials)

## Phase 2: Frontend Implementation

### File Structure

```
src/
  contexts/
    AuthContext.tsx               # React context for auth state
  services/
    GoogleAuthService.ts          # Handle OAuth flow
    GoogleDriveService.ts         # Handle Drive API calls
  components/
    LoginButton.tsx               # Login button (top left when not authenticated)
    UserMenu.tsx                  # User bubble + dropdown (top left when authenticated)
  types/
    google.d.ts                   # TypeScript definitions for Google APIs
  SetGame.ts                      # Keep existing save/load (localStorage only)
  App.tsx                         # Update to include auth UI
```

### Key Components to Build

#### 1. AuthContext
**Purpose:** Manages auth state across app

**State managed:**
```typescript
{
  isAuthenticated: boolean,
  user: { name: string, email: string, picture: string } | null,
  accessToken: string | null,
  signIn: () => Promise<void>,
  signOut: () => Promise<void>,
  saveToGoogleDrive: () => Promise<void>,
  loadFromGoogleDrive: () => Promise<void>
}
```

**Behavior:**
- On mount, check if user was previously authenticated (store flag in localStorage)
- If yes, require re-login (token expired)
- `signIn()` calls GoogleAuthService, stores token in memory, updates state
- `signOut()` revokes token, clears state
- `saveToGoogleDrive()` calls GoogleDriveService.saveAllGamesToDrive()
- `loadFromGoogleDrive()` calls GoogleDriveService.loadAllGamesFromDrive()

#### 2. GoogleAuthService
**Purpose:** Manages authentication with Google

**Key methods:**
- `initialize(clientId: string)` - Set up Google Identity Services Token Client
- `signIn(): Promise<{ token: string, userInfo: UserInfo }>` - Trigger OAuth flow
- `signOut(token: string): Promise<void>` - Revoke token
- `getUserInfo(token: string): Promise<UserInfo>` - Fetch user profile

**Token Management:**
- Return token from signIn, let AuthContext store it in memory
- Tokens expire in ~1 hour
- No automatic refresh - user must re-login when expired
- Uses Google's Token Model (newer than implicit flow)

#### 3. GoogleDriveService
**Purpose:** Manages Drive storage operations

**Key methods:**
- `saveAllGamesToDrive(accessToken: string): Promise<void>`
  - Read all `setgame_*` keys from localStorage
  - Build a single JSON object with all game data: `{ "setgame_2024-01-01": {...}, "setgame_2024-01-02": {...}, ... }`
  - Check if file exists in Drive (search by name "setgame_data.json")
  - If exists, update; if not, create
  - Use appDataFolder space
- `loadAllGamesFromDrive(accessToken: string): Promise<void>`
  - Search for "setgame_data.json" in appDataFolder
  - Download file content
  - Parse JSON object
  - For each key-value pair in the object:
    - Write to localStorage with the key (e.g., `setgame_2024-01-01`)

**Internal helper methods:**
- `searchFiles(accessToken, query)` - Find file by name
- `createFile(accessToken, name, content)` - Create in appDataFolder
- `updateFile(accessToken, fileId, content)` - Update existing file
- `downloadFile(accessToken, fileId)` - Get file content

**File Storage Strategy:**
- Use appDataFolder space (hidden from user)
- Single file naming: `setgame_data.json`
- File content structure:
  ```json
  {
    "setgame_2024-01-01": {
      "startTime": "...",
      "endTime": "...",
      "events": [...],
      "foundSets": [...]
    },
    "setgame_2024-01-02": { ... }
  }
  ```
- No automatic sync - only manual via dropdown actions

#### 4. LoginButton Component
**Purpose:** Shows when not authenticated

**Features:**
- Simple button: "Login with Google"
- Positioned in top left of header
- Calls `signIn()` from AuthContext
- Shows loading state during auth flow

#### 5. UserMenu Component
**Purpose:** Shows when authenticated

**Features:**
- Profile picture in a circular bubble
- Click to toggle dropdown menu
- Dropdown positioned below/left of bubble
- Three menu items:
  1. "Save to Google Drive" → calls `saveToGoogleDrive()`, shows loading/success/error
  2. "Load from Google Drive" → calls `loadFromGoogleDrive()`, shows loading/success/error
  3. "Logout" → calls `signOut()`
- Close dropdown on outside click or item selection

#### 6. App.tsx Updates
**Changes:**
- Wrap return with `<AuthContextProvider>`
- Add to header section:
  ```tsx
  {isAuthenticated ? <UserMenu /> : <LoginButton />}
  ```
- No changes to game logic or SetGame usage

#### 7. SetGame.ts - No Changes Needed!
- Keep existing `save()` and `static load()` methods
- They continue to use localStorage only
- Drive sync happens separately via GoogleDriveService
- This keeps game logic clean and separate from cloud storage

## Phase 3: Detailed Implementation Steps

### Step 1: Add Google Client Library
Add to `index.html` in the `<head>`:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
<script src="https://apis.google.com/js/api.js" async defer></script>
```

### Step 2: Environment Configuration
Create environment variable for Google Client ID:
- Development: `.env.local`
- Production: GitHub Pages environment settings or build-time variable
- Access in code: `import.meta.env.VITE_GOOGLE_CLIENT_ID`

### Step 3: Install TypeScript Definitions
Install the official TypeScript definitions for Google APIs:

```bash
npm install --save-dev @types/google.accounts @types/gapi.client.drive-v3
```

**Packages:**
- `@types/google.accounts` - Type definitions for Google Identity Services (the new OAuth 2.0 library)
- `@types/gapi.client.drive-v3` - Type definitions for Google Drive API v3

These packages are maintained in the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) repository and provide complete type coverage for:
- Google Identity Services token client
- Google Drive API responses
- User info structure
- Token response structure

**Optional:** If you need additional custom types, create `src/types/google.d.ts` for app-specific type extensions.

### Step 4: Implement Services (Bottom-up)

**GoogleAuthService:**
1. Initialize Google Identity Services client
2. Implement token request flow
3. Implement user info fetching
4. Implement token revocation
5. Handle errors and edge cases

**GoogleDriveService:**
1. Implement file search
2. Implement file creation
3. Implement file update
4. Implement file download
5. Implement batch operations (saveAll/loadAll)
6. Handle errors and retries

### Step 5: Create React Context
1. Define context shape and initial state
2. Implement provider component
3. Wire up GoogleAuthService methods
4. Wire up GoogleDriveService methods
5. Add loading states for async operations
6. Add error handling

### Step 6: Build UI Components
1. Create LoginButton with loading state
2. Create UserMenu with dropdown
3. Add dropdown menu items with actions
4. Add loading/success/error indicators
5. Style with Tailwind CSS to match existing design

### Step 7: Integration
1. Wrap App with AuthContextProvider
2. Add LoginButton/UserMenu to header
3. Test authentication flow
4. Test save/load operations
5. Polish UI transitions

## Phase 4: Error Handling & Edge Cases

### Error Scenarios to Handle

#### 1. Network Failures During Drive Operations
- Show error toast/message to user
- Don't modify localStorage on failed loads
- Retry option for failed saves

#### 2. Auth Failures
- Show error message
- Keep user logged out
- Allow retry

#### 3. Token Expiration During Drive Operation
- Catch 401 errors
- Sign user out automatically
- Show message: "Session expired, please login again"

#### 4. Conflicting Saves
Different data in localStorage vs Drive for same seed:
- On "Load from Google Drive": Overwrite localStorage (Drive wins)
- On "Save to Google Drive": Overwrite Drive (localStorage wins)
- Consider showing warning: "This will overwrite X saves"

#### 5. Partial Sync Failures
- If saving 10 games and 2 fail, show error for those 2
- Successfully saved games stay saved
- User can retry to save failed ones

#### 6. Empty Drive / Empty localStorage
- "Save to Google Drive" when no games → show message "No games to save"
- "Load from Google Drive" when Drive empty → show message "No saved games found"

#### 7. Loading from Drive Triggers Re-render
- After loading from Drive, if current game was updated, need to reload the game
- Solution: After `loadFromGoogleDrive()`, check if current seed was updated
- If yes, reload page or trigger game reload

## Phase 5: User Experience Flows

### First-time User
1. Plays game → saves to localStorage automatically
2. Clicks "Login with Google" → OAuth flow → authenticated
3. User menu appears with profile picture
4. User clicks bubble → sees "Save to Google Drive" option
5. Clicks "Save to Google Drive" → uploads all localStorage games
6. Success message shows

### Returning User on New Device
1. Clicks "Login with Google" → authenticated
2. Clicks user menu → "Load from Google Drive"
3. Downloads all previously saved games to localStorage
4. Current game automatically loads if it exists
5. User can continue playing

### User Wants to Sync Devices
1. On device A: "Save to Google Drive" (uploads latest progress)
2. On device B: "Load from Google Drive" (downloads latest progress)
3. Manual sync ensures user controls when data moves

## Phase 6: Testing Strategy

### Test Scenarios

1. **First login**
   - No localStorage → Login → Save to Drive → Verify upload

2. **Load on new device**
   - Login → Load from Drive → Verify localStorage populated

3. **Overwrite behavior**
   - Have localStorage data → Load from Drive → Check if overwritten

4. **Multiple games**
   - 5 different seeds in localStorage → Save to Drive → Verify all 5 uploaded

5. **Empty states**
   - No games → Save to Drive → Should show helpful message

6. **Token expiration**
   - Wait 1 hour → Try Drive operation → Should fail gracefully

7. **Network offline**
   - Disconnect → Try Drive operation → Should show error

8. **Partial failure**
   - Mock API to fail on some files → Verify partial success reported

9. **Current game updated**
   - Playing seed "2024-01-01" → Load from Drive updates that seed → Verify game reflects new state

### Testing Tools
- Manual testing for OAuth flow (can't easily mock)
- Jest tests for GoogleDriveService logic (mock fetch)
- React Testing Library for UI components
- Integration tests for full save/load cycle

## Security Considerations

### 1. Client ID Storage
- Store in environment variable
- Exposed at build time (public value, safe to expose)
- Use `VITE_GOOGLE_CLIENT_ID` pattern

### 2. Access Token Handling
- Keep in memory only (AuthContext state)
- Never store in localStorage
- Clear on page reload

### 3. User Reconnects
- Don't persist token
- Require re-auth on page reload
- Can persist "was authenticated" flag for UX

### 4. Scope Minimization
- Only request `drive.appdata` scope
- Not full Drive access
- App data is hidden from user

### 5. HTTPS in Production
- Required for OAuth
- GitHub Pages provides this automatically

### 6. CSRF Protection
- Google handles with Token Model
- State parameter managed automatically

## Implementation Order

### Recommended Sequence

1. ✅ Google Cloud setup → Get Client ID
2. ✅ Add Google scripts to index.html
3. ✅ Create GoogleAuthService (with console.log testing)
4. ✅ Create AuthContext (wire up signIn/signOut only)
5. ✅ Create LoginButton component
6. ✅ Test login flow end-to-end
7. ✅ Create UserMenu component (Logout only)
8. ✅ Test login → logout flow
9. ✅ Create GoogleDriveService
10. ✅ Add saveToGoogleDrive/loadFromGoogleDrive to AuthContext
11. ✅ Wire up UserMenu dropdown actions
12. ✅ Test full save/load cycle
13. ✅ Add error handling and loading states
14. ✅ Polish UI and add success messages

## Technical References

### Documentation Links
- [Google Identity Services - Token Model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
- [Google Drive API - Application Data Folder](https://developers.google.com/drive/api/guides/appdata)
- [Google Drive API - Files Resource](https://developers.google.com/drive/api/v3/reference/files)
- [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes#drive)

### API Endpoints
- Auth: `https://accounts.google.com/gsi/client`
- Drive API: `https://www.googleapis.com/drive/v3/`
- App Data Space: Use `spaces=appDataFolder` parameter
- Token Revocation: `https://oauth2.googleapis.com/revoke`

### Key Scopes
- `https://www.googleapis.com/auth/drive.appdata` - Access to app-specific hidden folder

## Success Criteria

### Functional Requirements
- ✅ User can login with Google account
- ✅ User can logout
- ✅ User can save all localStorage games to Google Drive
- ✅ User can load all Drive games to localStorage
- ✅ Games persist across devices when synced
- ✅ Errors are handled gracefully
- ✅ Loading states provide feedback

### Non-Functional Requirements
- ✅ No changes to existing game logic
- ✅ Works on mobile and desktop
- ✅ Fast sync operations (< 5 seconds for typical use)
- ✅ Secure token handling
- ✅ User has full control over sync timing

## Future Enhancements (Out of Scope)

- Automatic sync on game completion
- Conflict resolution UI (show both versions, let user choose)
- Sync status indicator (last synced timestamp)
- Selective sync (choose which games to sync)
- Export/import functionality
- Sharing game saves with friends

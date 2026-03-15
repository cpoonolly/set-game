# Past Games History Page

**Date:** 2026-03-15
**Status:** Implementing

## Overview

Replace the Login/UserMenu button in the game header with a "Past Games" button that navigates to a history page. The history page shows a table of all previously played games with solve times and status. Auth UI (login, save/load Drive, logout) moves to the history page header.

## Changes

### Dependencies
- Add `react-router-dom@^7` for client-side routing

### Routing (`src/main.tsx`, `src/App.tsx`)
- Wrap app with `<BrowserRouter basename="/set-game/">` in `main.tsx`
- Define two routes in `App.tsx`:
  - `/` → `AppInner` (game page)
  - `/history` → `PastGamesPage`
- Replace `window.history.replaceState()` / `new URLSearchParams(window.location.search)` with React Router's `useSearchParams()` and `useNavigate()`

### Game Page Header (`src/App.tsx`)
- Remove `{isAuthenticated ? <UserMenu /> : <LoginButton />}`
- Add "Past Games" button with clock/history icon, navigates to `/history`

### New Page (`src/components/PastGamesPage.tsx`)
**Header:**
- Left: back chevron `<Link to="/">` + "Past Games" title
- Right: `isAuthenticated ? <UserMenu /> : <LoginButton />`

**Data loading (raw localStorage, no SetGame instantiation):**
- Read all keys matching `/^setgame_/`
- Parse JSON, extract: `seed` (from key), `startTime`, `endTime`, `foundSets.length`
- Sort descending by seed (YYYY-MM-DD lexicographic = chronological)

**Table columns:**
| Date | Solve Time | Sets Found | Status |
|------|------------|------------|--------|
| Mon, Jan 1, 2024 | 3:42 | 6/6 | Complete |
| Sun, Dec 31, 2023 | -- | 2/6 | In Progress |

- Clicking a row navigates to `/?seed=YYYY-MM-DD&load=1`
- `SET_COUNT` from `src/constants.ts` for `/6` denominator
- Solve time: `endTime - startTime` as `M:SS`, `--` if incomplete
- Complete: green badge; In Progress: gray badge

## Auth UI Restructure
- **Game page (`/`)**: No auth controls; only "Past Games" button
- **History page (`/history`)**: Login or UserMenu in top-right

## Verification
1. `npm run build` — clean build, no TypeScript errors
2. Game page header shows "Past Games" button (no login button)
3. Clicking "Past Games" navigates to `/history`, table shows saved games
4. Clicking a row loads `/?seed=YYYY-MM-DD&load=1`
5. Browser back returns to history
6. Login/UserMenu visible and functional on history page
7. Existing `?seed=` and `?load=` params still work correctly

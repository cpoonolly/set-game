This app is a recreation of the Set Daily Puzzle (may she rest in peace). It's still a work in progress!

## Getting Started

### Commands
- `npm install` to install dependencies
- `npm run dev` to run locally (runs on localhost:5173)
- `npm test` to run the test suite
- `npm run build` to build for production
- `npm run preview` to preview the production build

### Docker
- Create a `.env.docker` file
- Set a value for `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` to the appropriate hostname
- `docker compose up`

## Testing

The project uses Jest for testing. Test files are located at the root level (e.g., `SetGame.test.ts`) and test the core game logic including:
- Deterministic board generation from seeds
- Game state management (found sets, current selection, completion)
- Card selection and validation
- Save/load functionality to localStorage
- Edge cases and error handling

Run tests with:
```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
```

## Documentation & Specs

For larger changes and features, we document the design and implementation plan in the `docs/specs/` directory. Each spec document includes:
- Project overview and goals
- User experience flows
- Technical implementation details
- Testing strategy
- Security considerations

Example: See `docs/specs/2026-02-16-google-drive-integration.md` for the Google Drive sync feature specification.

## Code Generation

### generate_hardcoded_values.py

This Python script generates TypeScript constants used in `src/constants.ts`. It pre-computes all valid card combinations and sets to optimize runtime performance.

**What it generates:**
- `ALL_CARDS` - Array of all 81 possible card combinations (4 properties × 3 values each = 3^4 = 81 cards)
- `ALL_VALID_SETS` - Array of all 1,080 valid sets (combinations of 3 cards where each property is all same or all different)

**Card encoding:** Each card is a 4-character string where each character is 'a', 'b', or 'c':
- Position 0: Shape
- Position 1: Color
- Position 2: Fill
- Position 3: Count

Example: `"baaa"` = shape b, color a, fill a, count a

**To regenerate constants:**
```bash
python3 generate_hardcoded_values.py > src/constants.ts
```

This is only needed if the game rules or card properties change. The generated constants are checked into version control.

## Game Logic

### URL Parameters

The app uses URL parameters to control game state:

- `?seed=YYYY-MM-DD` - Specifies which puzzle to play (defaults to today's date in UTC)
- `?load=1` - Loads a saved game from localStorage for the given seed

**Examples:**
- `/?seed=2024-01-15` - Play the puzzle from January 15, 2024
- `/?seed=2024-01-15&load=1` - Load your saved progress for January 15, 2024

The URL is automatically updated as you play:
1. On page load, if no seed is provided, today's date is added to the URL
2. When you complete a puzzle, `&load=1` is added to the URL so refreshing will restore your completed state

### generateRandomBoard

Located in `src/SetGame.ts:28`, this function creates deterministic game boards using a seeded random number generator.

**Algorithm:**
1. Initialize an empty board
2. Iteratively add or remove random cards
3. Keep going until the board has exactly `BOARD_SIZE` cards (12) and `SET_COUNT` valid sets (6)

**Key features:**
- Uses `seedrandom` library for deterministic randomness - the same seed always produces the same board
- Intelligently adds cards that create new valid sets when needed
- Removes cards that create too many sets
- Has a safety limit of 100,000 iterations (throws error if exceeded)

**Why deterministic?** Every player gets the same daily puzzle, and you can share puzzle links with specific dates.

## Deployment

### GitHub Pages

This project is deployed to GitHub Pages at the URL specified in `package.json` (`homepage` field).

**Deployment process:**
1. Make your changes and commit to a feature branch
2. Open a Pull Request to `main`
3. Once PR is reviewed and merged to `main`, the GitHub Actions workflow automatically:
   - Installs dependencies
   - Runs the test suite
   - Builds the production bundle
   - Deploys to GitHub Pages

**GitHub Actions Workflow:**
- Located at `.github/workflows/deploy.yml`
- Triggers on pushes to `main` branch
- Two jobs: `build` (runs tests + builds) and `deploy` (publishes to GitHub Pages)
- Tests must pass for deployment to proceed
- Typical deployment takes 2-3 minutes

**Manual deployment:**
You can also deploy manually using:
```bash
npm run deploy
```
This runs the `gh-pages` package which builds and pushes to the `gh-pages` branch.

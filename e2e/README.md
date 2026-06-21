# End-to-End Tests (Playwright)

Browser-driven tests for the Evaluation App SPA. They exercise the real UI
against the running backend: registration, login (JWT persistence), profile,
the user list, search, and error handling.

## Prerequisites

The app and API must be running first:

```bash
# from the repo root
docker compose up -d
```

The SPA is served by the backend at <http://localhost:3000/app/>.

## Setup (once)

```bash
cd e2e
npm install
npx playwright install chromium
```

## Run

```bash
npm run test:e2e          # headless
npm run test:e2e:headed   # watch it drive a real browser
npm run report            # open the HTML report after a run
```

## Notes

- Tests use stable `data-testid` selectors (defined in
  `backend/public/index.html`) rather than CSS/text, so they don't break on
  styling or copy changes.
- Each test creates its own user with a unique email, so runs are independent
  and repeatable.
- `baseURL` is set in `playwright.config.ts`; tests navigate to `/app/`.

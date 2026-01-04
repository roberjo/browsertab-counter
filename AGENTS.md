# Repository Guidelines

## Project Structure & Module Organization

- Current layout is minimal: `README.md` at the root and an empty `docs/` directory.
- When adding source code, keep extension assets grouped by purpose (for example `src/` for scripts, `public/` for static assets, `docs/` for design notes).
- Prefer a clear separation of background logic, content scripts, and UI so it is easy to reason about tab-counting behavior and badge/message logic.

## Build, Test, and Development Commands

- There are no build or test scripts checked in yet.
- If you add tooling (for example `npm run build` or `npm test`), document the exact commands here and in `README.md`.
- For local development of a Chrome extension, include steps for loading the unpacked extension in Chrome and point to the folder to load.

## Coding Style & Naming Conventions

- Use consistent indentation (recommend 2 spaces for web/extension code) and keep line lengths readable.
- Name files by role and scope (for example `background.js`, `content-tabs.js`, `popup.html`).
- When introducing linting or formatting tools, document the rules and include the run command (for example `npm run lint`).

## Testing Guidelines

- No testing framework is configured yet.
- If tests are added, keep them close to the logic they verify (for example `tests/` or `__tests__/`).
- Document how to run tests and any required test data or mocks for Chrome APIs.

## Commit & Pull Request Guidelines

- Git history is not available in this repository, so there are no established commit message conventions.
- Use clear, imperative commit messages (for example "Add tab-counting background worker").
- Pull requests should explain the user-visible behavior change and include screenshots or screen recordings for UI changes.

## Configuration & Security Notes

- Avoid storing user data outside of Chrome extension storage APIs.
- If you add configuration files or secrets for development, document them and keep them out of version control.

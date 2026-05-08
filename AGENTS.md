# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
This repo contains a **Lost and Found Management System** built with Angular 21 (standalone components, Vitest for testing). The Angular project lives in `lost-and-found/`.

### Key commands (run from `lost-and-found/`)
| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npx ng serve --host 0.0.0.0 --port 4200` |
| Build | `npx ng build` |
| Tests | `npx ng test --watch=false` |

### Gotchas
- On first run, Angular CLI prompts for **autocompletion** and **analytics**. Both can be skipped by running `ng analytics disable --global` beforehand, or answering `N` interactively.
- Data is stored in **localStorage** — no backend or database is required.
- The app seeds sample data on first dashboard visit via `ItemService.seedSampleData()`.

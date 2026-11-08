# EUCON Events Management

An Angular 21 + DevExtreme take-home exercise: an events list/detail screen (participants sub-grid, status/location statistics) built as a reusable shell so future areas — Venues, Invoices — don't require rebuilding the same page structure from scratch.

## Setup

Requires Node `^20.19.0 || ^22.12.0 || >=24.0.0` and pnpm `>=11.22.0`.

```bash
pnpm install
pnpm start      # ng serve, http://localhost:4200
pnpm test       # unit tests (Vitest)
pnpm lint       # ESLint (Angular + TypeScript + import sorting)
pnpm build      # production build
```

A Husky pre-commit hook runs `lint-staged`, `pnpm run typecheck`, and the full test suite.

## Architecture overview

Standalone Angular 21 components, no NgModules, signal-based state (`signal`/`computed`/`resource`) instead of RxJS subjects for component state. DevExtreme supplies the grid, form, and input widgets.

```
src/app/
  features/events/    # the one real feature: models, services, ui, utils
  shared/
    ui/               # reusable presentational components
    models/           # cross-feature types
    directives/       # e.g. ListPageTab
  layout/             # app shell, nav config
```

The page shell is generic, not events-specific:

- **`ListPage` + `ActionBar`** — title/subtitle, tabs, and a config-driven `actions: ActionBarAction[]` instead of fixed Export/Add buttons. Tab content is supplied via an `appListPageTab` directive and rendered through `contentChildren` + `NgTemplateOutlet` — any number of tabs.
- **`FilterBar` / `FilterField`** — filter-row layout and DevExtreme's default styling overrides, shared instead of duplicated per feature.
- **`DataGrid<T, TKey>`** — a generic, typed grid wrapper (paging, sorting, export, state-storing, master-detail, error state). Used by both the Events grid and the Participants sub-grid.
- **`ErrorState`** — an unstyled retry UI with no container of its own, reused by the grid and the statistics panels.

Data access goes through `CustomStore` (grid) and `Promise`-returning services, consumed via `resource()` rather than RxJS subscriptions for anything a component just needs to read reactively.

## Decision log

**1. DevExtreme's `stateStoring` over manual query-param sync or `RouteReuseStrategy`.**
Both alternatives add real code for a single-page CRUD screen. `stateStoring` (localStorage-backed) persists columns, paging, and filters for free. Tradeoff: a stale `localStorage` might occurs from time to time.

**2. Unit tests over other test types, targeted at the riskiest logic.**
The scaffolded specs were shallow "should create" smoke tests. Added instead: search/filter/sort/paging logic, the grid's "error state only when empty" rule, multi-condition filter combination, a regression test for a search-box reset bug that actually occurred, and both branches of the async save flow. e2e would cost more to write and run here without isolating failures as precisely.

**3. Generalizing the page shell instead of leaving it events-specific.**
`ActionBar` originally had fixed `add`/`exportExcel` outputs; `ListPage` had exactly two hardcoded content slots. Both break the moment a second feature needs a different button set or tab count. Replaced with a config array (`ActionBarAction[]`) and an `appListPageTab` marker directive queried via `contentChildren` — no changes to `ListPage` itself when a feature's tab count differs.

## Assumptions made

- **Mock backend behavior stands in for a real API.** `simulateNetwork()` adds 100–300ms latency and a 5% random rejection rate to exercise loading/error states. "Retry" means re-fetch.
- **Date-range filter bounds are inclusive on both ends** (`date >= start` and `date <= end`) — not specified in the brief.
- **Grid defaults** (page sizes 20/50/100, single-row selection, `remoteOperations`) are reasonable defaults where the brief didn't prescribe them, left configurable per `DataGrid` usage.
- **Participant counts aren't rolled back up into the parent event record** — treated as acceptable for the exercise (see known limitations).

## How smooth performance with 5,000+ entries was achieved, and how it was verified

The grid never materializes all 5,000 rows. `DataGrid` runs with `remoteOperations: true`, so paging, sorting, filtering, and search go through the `CustomStore`'s `load(options)` contract, and only the current page (20/50/100 rows) is loaded into the DOM.

Verification was manual: exercising search, filtering, sorting, and pagination against the full dataset in the browser.

## Known limitations

- **Participants sub-grid changes don't reflect on the parent event.** `ParticipantsService` and `EventsService` are independent in-memory stores with no cross-reference; `EventRecord.participantCount` doesn't update.
- **In-memory data only** — both services are marked for an HTTP backend (`// TODO`); nothing persists across a reload.
- **No authentication or authorization.**
- **The 5% simulated error rate is by design** — `ErrorState`/retry and a failed "Add Event" insert can surface under normal use, not just when forced.
- **English-only UI.**
- **No end-to-end test coverage.**

## What I'd do differently or additionally with more time

- Add i18n support.
- A bookmarking system where users' filters can persist.
- A dashboard view surfacing upcoming events as a third tab or separate route.
- Sync `participantCount` between the participants sub-grid and the parent event.
- End-to-end scenarios covering add/filter/search/export flows.

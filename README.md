# TDtimeline

TDtimeline is a browser-based campaign operations playbook.

It provides three tools:

- **Timeline Health** (`index.html` + `decision-tool.js`): checkpoint Q&A that gives status, impact, and next action.
- **Timeline Planner** (`timeline-planner.html` + `timeline-planner.js`): locked baseline planning, actual-vs-ideal tracking, projections, feasibility checks, and exports.
- **Comms Plan** (`comms.html` + `comms.js`): escalation guidance and a structured email draft builder.

No backend is required. Data is saved in browser `localStorage`.

## How To Run

1. Clone/download the repo.
2. Open `/Users/harry/Desktop/codex/TDtimeline/index.html` in a browser.
3. Use nav links to switch between pages.

Optional: serve locally with any static file server for a cleaner URL workflow.

## Architecture

- **Frontend stack**: vanilla HTML/CSS/JavaScript.
- **State storage**: localStorage key `timeline_planner_campaign_v1` (planner module).
- **Shared styling**: `playbook.css`.
- **Page-specific styling**:
  - `decision-tool.css`
  - `timeline-planner.css`

## Page Behavior

### 1) Timeline Health

Core file: `/Users/harry/Desktop/codex/TDtimeline/decision-tool.js`

- Defines ordered checkpoints from Kick-off through 9-month.
- Each answer maps to:
  - status (`On Track`, `At Risk`, `Behind`, `Critical`, `On Hold`, etc.)
  - immediate action
  - follow-up action
  - impact lines
- Injects/normalizes response-gate options (waiting on client response/sign-off).
- Tracks response-gate request date and computes deadline in working days.
- Escalates response-gate status when overdue/unresolved.
- Supports KO date guidance and suggested checkpoint jump.
- Shows session summary by checkpoint.

### 2) Timeline Planner

Core file: `/Users/harry/Desktop/codex/TDtimeline/timeline-planner.js`

- Maintains campaign object with:
  - baseline
  - policy layer
  - ideal timeline
  - actuals
  - derived projections/feasibility
  - settings
  - revisions
- Baseline lock prevents accidental edits after planning starts.
- Computes ideal windows and milestone targets from KO + contract dates.
- Computes policy checkpoints (Day 30 publish / Day 90 report sharing) and sticky miss flag.
- Projects downstream milestone dates from actual slippage.
- Calculates promotion-window feasibility against 30-day minimum.
- Renders workflow table and timeline SVG chart (client/internal views).
- Exports campaign data as JSON/CSV.
- Includes browser-run acceptance tests section for quick integrity checks.

### 3) Comms Plan

Core file: `/Users/harry/Desktop/codex/TDtimeline/comms.js`

- Shows escalation ladder and communication principles.
- Provides guided blocks for drafting client status emails:
  - empathy
  - explicit status
  - neutral cause
  - impact
  - decision/deadline statement
- Includes template insert helpers and copy-to-clipboard output.

## Data Notes

- Planner persistence is local to browser profile/device.
- Clearing browser storage clears saved planner state.
- Revisions are stored inside the same local object.

## AI/Human Maintenance Notes

- Prefer editing source files directly; no build step exists.
- Keep status taxonomy consistent across modules.
- When changing milestones or policy rules, update both:
  - decision logic (status/actions)
  - planner projections and policy checks
- If adding fields to stored planner data, update migration logic in `migrateToV2` (or newer schema function) to preserve older saves.

## Current File Map

- `/Users/harry/Desktop/codex/TDtimeline/index.html`
- `/Users/harry/Desktop/codex/TDtimeline/decision-tool.js`
- `/Users/harry/Desktop/codex/TDtimeline/decision-tool.css`
- `/Users/harry/Desktop/codex/TDtimeline/timeline-planner.html`
- `/Users/harry/Desktop/codex/TDtimeline/timeline-planner.js`
- `/Users/harry/Desktop/codex/TDtimeline/timeline-planner.css`
- `/Users/harry/Desktop/codex/TDtimeline/comms.html`
- `/Users/harry/Desktop/codex/TDtimeline/comms.js`
- `/Users/harry/Desktop/codex/TDtimeline/playbook.css`
- `/Users/harry/Desktop/codex/TDtimeline/TodayDigital_Icon.png`
- `/Users/harry/Desktop/codex/TDtimeline/README.md`

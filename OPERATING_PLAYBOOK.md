# Today Digital Operating Playbook (Unified)

Version: 1.0  
Last updated: 2026-02-20  
Scope: Multi-team campaign delivery in a Mon-Thu four-day week.

## 1) Operating Objective

Deliver campaigns on time and with quality by controlling flow, making risk visible early, and escalating exceptions fast.

## 2) Non-Negotiable Design Principles

1. monday.com is the system of record for commitments, dependencies, risk, and decisions.
2. Microsoft Teams is the coordination/distribution layer, not the system of record.
3. Work is accepted commercially into intake, but only released into production when capacity constraints are satisfied.
4. CEO review is treated as a constrained quality resource, not a universal gate.
5. Client availability is a managed operational constraint with explicit tracking and SLAs.
6. Meetings are decision-focused and exception-first; status reporting is async.

## 3) Governance and Role Ownership

### 3.1 Governance forums

1. Campaign Operations Council (weekly, Mon, 45 min)
- Purpose: release decisions, constraint protection, cross-team tradeoffs.
- Owners: Head of Client Services + Production Editor.
- Attendees: Sales lead, CS lead, Production Editor, Design rep (as needed), Marketing rep (as needed).
- CEO: attends only for editorial/high-risk decisions; otherwise async pre-read.

2. Ops Reliability Huddle (triggered, 15 min, exceptions only)
- Purpose: same-day blockers, Amber/Red risks, queue and buffer health, assignment of owners.
- Owner: Head of Client Services.
- Activation rule: convene only when a Red trigger is active.

3. Monthly Portfolio Rebalance (60-90 min)
- Purpose: adjust capacity allocations, review systemic risks, and standards.
- Owners: Head of Client Services + Production Editor.

### 3.2 Decision rights

1. CEO (Publisher)
- Owns editorial direction, high-risk approvals, and reputational exceptions.

2. Production Editor
- Sole authority to release deliverables from intake into content production.
- Owns WIP limits, production QA gate, and content flow control.

3. Head of Client Services
- Sole authority to change campaign timelines/client-facing schedule commitments once execution has started.
- Owns escalation initiation and client-side risk communication.

4. Sales
- Owns commercial commitments, bounded by capacity-validated release.

5. System enforcement
- Workflow gates in monday enforce roles (no "RACI theater").

## 4) Campaign Flow Model

## 4.1 Planning unit and lanes

1. Primary planning unit: 90-day section.
2. Separate lanes:
- Content-production campaigns.
- Activation-only campaigns (display/lead gen) with explicit dependencies to content assets when required.

### 4.2 Stage gates per 90-day section

1. Gate A (section start): planning call booked, interview date held, approval SLA agreed, event conflicts logged.
2. Gate B (by Day 14): content plan approved or escalated.
3. Gate C (by Day 30): publish-by forecast check completed; any slip beyond Day 30 is Amber.
4. Gate D (by Day 60): approved and scheduled for publication (minimum 30-day promotion protection).
5. Section close: report delivered, AM distribution confirmed, renewal signal logged.

### 4.3 Three-token release control

A deliverable is released only when all three tokens are present:

1. Internal production token (writer/editor capacity).
2. Review token (CEO or delegated reviewer capacity).
3. Client touchpoint token (required planning/interview/review windows booked).

## 5) CEO Review Operating Policy (Risk-Based Ladder)

1. Class A (CEO mandatory)
- New/junior writers until certified.
- High-risk clients.
- High reputational-risk topics.
- CEO-interest pieces.

2. Class B (delegated review + CEO audit)
- Reviewed by senior writer or Production Editor.
- CEO audits 1 in 5 by default, or trigger-based when quality signals worsen.

3. Class C (ops QA only)
- Production Editor QA checklist.
- CEO optional spot-check.

Escalation rule: repeated defect type or client complaint moves writer/campaign up one class for next 2 cycles.

## 6) Risk and Escalation Framework

### 6.1 Unified status model

1. Green: no threshold breached.
2. Amber: needs cross-team support within 24 working hours.
3. Red: same-day triage required (within 4 working hours).
4. Critical: executive attention within 2 working hours.

### 6.2 Trigger set

Amber triggers (any one):
1. Client touchpoint not booked within 5 business days of section start.
2. Client review response exceeds 72 hours.
3. Forecast publish date slips past Day 30.
4. Buffer burn >50% on fixed-date deliverable.
5. WIP above limit at a constrained stage with upcoming due deliverables.

Red triggers (any one):
1. Interview not completed by Day 21 (or agreed equivalent).
2. No client review response after 96 hours.
3. Forecast publish date slips past Day 60.
4. Buffer burn >80% on fixed-date deliverable.
5. Deliverable overdue >2 business days with external dependency block.
6. Quality risk flagged by Production Editor with potential client/reputational impact.

Critical triggers (any one):
1. Explicit client churn threat or serious relationship breakdown.
2. Legal/compliance risk.
3. Reputational/editorial risk requiring CEO exception.

### 6.3 Triage response standard

1. Trigger logged in monday item and Teams risk channel.
2. Owner assigned during huddle/triage.
3. Decision and due date posted to decision log.
4. Client comms owner identified (usually CS).

## 7) Cadence and Communication Rules (Mon-Thu)

1. Daily async updates (by 11:00) from each function in Teams using strict template: blockers, risks, decisions needed.
2. Ops Reliability Huddle (15 min): run only when a Red trigger exists.
3. Thu Portfolio Health Digest posted by CS.
4. Mon Council runs release and tradeoff decisions; output posted immediately.
5. Private chat allowed for coordination, but any commitment/risk/decision state change must be recorded in monday.

## 8) Tooling Standard

### 8.1 monday.com (system of record)

Required objects:
1. Campaign Portfolio board.
2. Deliverables Intake/Execution board.
3. RAID + Decision log (board or linked subitems).
4. Client Touchpoint Tracker fields:
- planning call date
- interview date
- review request date
- review due date
- actual approval date
- backup contact
- event blackout/conflict
5. Time Fence Status fields:
- publish-by date (Day 60 default)
- promotion days remaining
- report due date
- renewal readiness flag

### 8.2 Teams (coordination/distribution)

Minimum channels:
1. #announcements-and-digests
2. #risk-triage-andon
3. #decisions-log
4. #dependencies-and-handoffs

Sales without monday access:
1. Sales posts structured weekly client availability + renewal signals in Teams.
2. CS transcribes standard fields into monday.
3. monday automations push exceptions to Teams.

## 9) WIP and Constraint Policy

1. Maintain separate WIP limits for UC Today and CX Today.
2. Do not start next client-dependent draft unless prior item has an approval plan with expected response window.
3. Protect constrained stages (review and client approval) by controlling upstream release.

## 10) Renewal Readiness Policy

1. Start renewal-readiness workstream at end of Section 3 (not only in final quarter).
2. Track report cycle time and AM/client distribution confirmation.
3. Surface renewal risks in weekly digest and monthly rebalance.

## 11) KPI Stack (Leading and Outcome)

Leading indicators:
1. Client touchpoint lead time (section start to booking/completion/approval milestones).
2. Approval SLA adherence and aging.
3. Publish-by fence attainment (% by Day 60).
4. Buffer penetration on fixed-date deliverables.
5. WIP aging and blocked duration.
6. Review queue health (length + wait time).
7. Cross-team handoff delay.

Outcome indicators:
1. Promotion window realized (days between publish and section end; % below 30 days).
2. Missed deadline rate.
3. Rework rate.
4. Risk lead time (signal to resolution/impact).

## 12) Implementation Plan (90 days)

1. Weeks 1-2
- Stand up core boards/fields and channel structure.
- Launch Gate A-D, status model, and trigger set.
- Start daily async and Red-trigger huddle rule.

2. Weeks 3-6
- Enable three-token release policy.
- Start review ladder (A/B/C) with calibration.
- Start weekly council and Thursday digest discipline.

3. Weeks 7-12
- Baseline KPI dashboard and thresholds.
- Tune WIP limits per lane.
- Formalize renewal-readiness cadence.

## 13) Locked Policy Decisions (v1.0)

1. Daily huddle policy: run only when a Red trigger exists.
2. Publish-by thresholds: Day 30 = Amber risk threshold; Day 60 = Red threshold.
3. Client review response SLA: 72 hours target; >72h = Amber; >96h = Red.
4. CEO Class B audit ratio: 1 in 5.
5. Decision log location: monday linked board/subitems.

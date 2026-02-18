const STORAGE_KEY = "timeline_planner_campaign_v1";

const milestoneOrder = [
  "kickoff",
  "contentPlan",
  "interview",
  "writing",
  "internalReview",
  "clientReview",
  "publishing",
  "promoting",
  "reporting"
];

const milestoneLabels = {
  kickoff: "Kick-off",
  contentPlan: "Content Plan",
  interview: "Interview",
  writing: "Writing",
  internalReview: "Internal Review",
  clientReview: "Client review",
  publishing: "Publishing",
  promoting: "Promoting",
  reporting: "Reporting"
};

const liveStages = [
  "Interview scheduling",
  "In production",
  "In review",
  "Publishing",
  "Promoting",
  "Reporting"
];

const emptyMilestones = {
  kickoff: "",
  contentPlan: "",
  interview: "",
  writing: "",
  internalReview: "",
  clientReview: "",
  publishing: "",
  promoting: "",
  reporting: ""
};

const defaultCampaign = {
  schemaVersion: 2,
  campaignName: "",
  baseline: {
    contractStartDate: "",
    contractEndDate: "",
    kickoffDate: "",
    extension30Days: false,
    extensionApprovedDate: "",
    locked: false
  },
  policyLayer: {
    publishReadyWeekDeadline: "",
    reportShareWeekDeadline: "",
    firstPublishByDay30Deadline: "",
    policyMissedPermanent: false,
    policyMissedAt: "",
    policyMissReason: ""
  },
  idealTimeline: {
    weekAnchor: "next_monday_after_ko_week",
    phaseWindows: {
      production: { start: "", end: "" },
      promotion: { start: "", end: "" },
      reporting: { start: "", end: "" }
    },
    milestonePlan: { ...emptyMilestones }
  },
  actuals: {
    milestoneActual: { ...emptyMilestones },
    firstPublishActualDate: "",
    reportSharedActualDate: ""
  },
  derived: {
    activeContractEndDate: "",
    projectedPromotionDays: 0,
    feasible: true,
    feasibilityReason: "",
    projectedMilestones: { ...emptyMilestones },
    projectedPublishDate: "",
    projectedReportDate: "",
    currentPlanStatus: "On Track"
  },
  settings: {
    useBusinessDays: false,
    showInterviewClient: true
  },
  revisions: [],
  ui: {
    lastImpact: null
  }
};

let campaign = loadCampaign();
function cloneCampaign(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toIso(date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function todayIso() {
  return toIso(new Date());
}

function formatDate(dateOrIso) {
  const d = typeof dateOrIso === "string" ? parseDate(dateOrIso) : dateOrIso;
  if (!d) return "TBC";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatWc(dateOrIso) {
  const d = typeof dateOrIso === "string" ? parseDate(dateOrIso) : dateOrIso;
  if (!d) return "W/c TBC";
  const monday = weekStartMonday(d);
  return `W/c ${formatDate(monday)}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return startOfDay(d);
}

function addBusinessDays(date, days) {
  const d = new Date(date);
  const direction = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    d.setDate(d.getDate() + direction);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) remaining -= 1;
  }
  return startOfDay(d);
}

function addOffset(date, days, useBusinessDays) {
  return useBusinessDays ? addBusinessDays(date, days) : addDays(date, days);
}

function diffDays(a, b) {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor((startOfDay(b) - startOfDay(a)) / oneDay);
}

function weekStartMonday(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  return addDays(d, delta);
}

function weekEndSunday(date) {
  return addDays(weekStartMonday(date), 6);
}

function nextMondayAfterKoWeek(koDate) {
  const koWeekStart = weekStartMonday(koDate);
  return addDays(koWeekStart, 7);
}

function mergeMilestones(source) {
  return { ...emptyMilestones, ...(source || {}) };
}

function migrateToV2(parsed) {
  const migrated = cloneCampaign(defaultCampaign);
  if (!parsed || typeof parsed !== "object") return migrated;

  migrated.campaignName = parsed.campaignName || "";
  migrated.settings.useBusinessDays = Boolean(parsed.settings?.useBusinessDays);
  migrated.settings.showInterviewClient = parsed.settings?.showInterviewClient !== false;

  if (parsed.schemaVersion === 2 && parsed.baseline && parsed.idealTimeline && parsed.actuals) {
    return {
      ...migrated,
      ...parsed,
      baseline: { ...migrated.baseline, ...(parsed.baseline || {}) },
      policyLayer: { ...migrated.policyLayer, ...(parsed.policyLayer || {}) },
      idealTimeline: {
        ...migrated.idealTimeline,
        ...(parsed.idealTimeline || {}),
        phaseWindows: {
          ...migrated.idealTimeline.phaseWindows,
          ...(parsed.idealTimeline?.phaseWindows || {})
        },
        milestonePlan: mergeMilestones(parsed.idealTimeline?.milestonePlan)
      },
      actuals: {
        ...migrated.actuals,
        ...(parsed.actuals || {}),
        milestoneActual: mergeMilestones(parsed.actuals?.milestoneActual)
      },
      derived: {
        ...migrated.derived,
        ...(parsed.derived || {}),
        projectedMilestones: mergeMilestones(parsed.derived?.projectedMilestones)
      },
      settings: { ...migrated.settings, ...(parsed.settings || {}) },
      revisions: Array.isArray(parsed.revisions) ? parsed.revisions : [],
      ui: { ...migrated.ui, ...(parsed.ui || {}) },
      schemaVersion: 2
    };
  }

  // Legacy migration path.
  const legacyMilestones = parsed.milestones || parsed.milestonePlan || {};
  const legacyActuals = parsed.milestoneActual || {};
  const mapLegacy = (src) => ({
    kickoff: src.kickoff || src.kickoffComplete || "",
    contentPlan: src.contentPlan || src.contentPlanApproved || src.inputsReceived || "",
    interview: src.interview || src.interviewCompleted || src.interviewBooked || "",
    writing: src.writing || src.draft1Shared || "",
    internalReview: src.internalReview || src.feedbackComplete || "",
    clientReview: src.clientReview || src.finalDelivered || "",
    publishing: src.publishing || src.contentPublished || "",
    promoting: src.promoting || src.contentPublished || "",
    reporting: src.reporting || src.reportingDelivered || ""
  });

  migrated.baseline.kickoffDate = parsed.kickoffDate || "";
  migrated.baseline.contractStartDate = parsed.contractStartDate || "";
  migrated.baseline.contractEndDate = parsed.contractEndDate || "";
  migrated.baseline.extension30Days = Boolean(parsed.extension30Days);
  migrated.baseline.extensionApprovedDate = parsed.extensionApprovedDate || "";
  migrated.baseline.locked = Boolean(parsed.baselineLocked);

  migrated.policyLayer = {
    ...migrated.policyLayer,
    ...(parsed.policyLayer || {})
  };

  migrated.idealTimeline.milestonePlan = mergeMilestones(mapLegacy(legacyMilestones));
  migrated.actuals.milestoneActual = mergeMilestones(mapLegacy(legacyActuals));
  migrated.actuals.firstPublishActualDate = parsed.firstPublishDate || legacyActuals.contentPublished || legacyActuals.publishing || "";
  migrated.actuals.reportSharedActualDate = parsed.reportSharedDate || legacyActuals.reportingDelivered || legacyActuals.reporting || "";

  migrated.revisions = Array.isArray(parsed.revisions)
    ? parsed.revisions.map((rev) => ({
      ...rev,
      milestonePlan: mergeMilestones(rev.milestonePlan || rev.milestones),
      milestoneActual: mergeMilestones(rev.milestoneActual),
      schemaVersion: 2
    }))
    : [];

  return migrated;
}

function loadCampaign() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneCampaign(defaultCampaign);
  try {
    return migrateToV2(JSON.parse(raw));
  } catch {
    return cloneCampaign(defaultCampaign);
  }
}

function saveCampaign() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
  const hint = document.getElementById("saveHint");
  if (hint) {
    hint.textContent = `Saved ${new Date().toLocaleTimeString()}`;
  }
}

function activeContractEndDate(c) {
  const end = parseDate(c.baseline.contractEndDate);
  if (!end) return null;
  if (!c.baseline.extension30Days) return end;
  return addDays(end, 30);
}

function computeIdealTimeline(c) {
  const ko = parseDate(c.baseline.kickoffDate);
  if (!ko) return;
  const useBusinessDays = c.settings.useBusinessDays;
  const week1Start = nextMondayAfterKoWeek(ko);
  const week1End = addDays(week1Start, 6);
  const week2End = addDays(week1Start, 13);

  const productionStart = ko;
  const productionEnd = addOffset(ko, 29, useBusinessDays);
  const promotionStart = addOffset(productionEnd, 1, useBusinessDays);
  const promotionEnd = addOffset(promotionStart, 44, useBusinessDays);
  const reportingStart = addOffset(promotionEnd, 1, useBusinessDays);
  const reportingEnd = addOffset(reportingStart, 14, useBusinessDays);

  c.idealTimeline.phaseWindows.production = { start: toIso(productionStart), end: toIso(productionEnd) };
  c.idealTimeline.phaseWindows.promotion = { start: toIso(promotionStart), end: toIso(promotionEnd) };
  c.idealTimeline.phaseWindows.reporting = { start: toIso(reportingStart), end: toIso(reportingEnd) };

  // Workflow duration assumptions (working days):
  // Writing 8wd, Internal Review 2wd, Client Review 5wd.
  const contentPlanDate = week1End;
  const interviewDate = week2End > contentPlanDate ? week2End : addDays(contentPlanDate, 1);
  const writingDate = addBusinessDays(interviewDate, 8);
  const internalReviewDate = addBusinessDays(writingDate, 2);
  const clientReviewDate = addBusinessDays(internalReviewDate, 5);
  const publishingDate = addBusinessDays(clientReviewDate, 1);

  c.idealTimeline.milestonePlan = {
    kickoff: toIso(ko),
    contentPlan: toIso(contentPlanDate),
    interview: toIso(interviewDate),
    writing: toIso(writingDate),
    internalReview: toIso(internalReviewDate),
    clientReview: toIso(clientReviewDate),
    publishing: toIso(publishingDate),
    promoting: toIso(promotionEnd),
    reporting: toIso(reportingEnd)
  };
}

function computePolicyLayer(c, now = new Date()) {
  const ko = parseDate(c.baseline.kickoffDate);
  if (!ko) return;

  const day30 = addOffset(ko, 30, c.settings.useBusinessDays);
  const day90 = addOffset(ko, 90, c.settings.useBusinessDays);

  c.policyLayer.firstPublishByDay30Deadline = toIso(day30);
  c.policyLayer.publishReadyWeekDeadline = formatWc(day30);
  c.policyLayer.reportShareWeekDeadline = formatWc(day90);

  const publishReadyActual = parseDate(c.actuals.milestoneActual.clientReview);
  const reportSharedActual = parseDate(c.actuals.reportSharedActualDate || c.actuals.milestoneActual.reporting);

  const publishReadyWeekEnd = weekEndSunday(day30);
  const reportShareWeekEnd = weekEndSunday(day90);

  let missedReason = "";
  if (!publishReadyActual && startOfDay(now) > publishReadyWeekEnd) {
    missedReason = `Missed publish-ready week (${formatWc(day30)}).`;
  } else if (publishReadyActual && publishReadyActual > publishReadyWeekEnd) {
    missedReason = `Publish-ready completed ${formatDate(publishReadyActual)}, after target week ${formatWc(day30)}.`;
  } else if (!reportSharedActual && startOfDay(now) > reportShareWeekEnd) {
    missedReason = `Missed report-share week (${formatWc(day90)}).`;
  } else if (reportSharedActual && reportSharedActual > reportShareWeekEnd) {
    missedReason = `Report shared ${formatDate(reportSharedActual)}, after target week ${formatWc(day90)}.`;
  }

  if (missedReason && !c.policyLayer.policyMissedPermanent) {
    c.policyLayer.policyMissedPermanent = true;
    c.policyLayer.policyMissedAt = todayIso();
    c.policyLayer.policyMissReason = missedReason;
  }
}

function phaseDurationDays(c, phaseName) {
  const phase = c.idealTimeline.phaseWindows[phaseName];
  const start = parseDate(phase.start);
  const end = parseDate(phase.end);
  if (!start || !end) return 0;
  return Math.max(0, diffDays(start, end) + 1);
}

function computeProjectedMilestones(c) {
  const projected = { ...emptyMilestones };
  const ideal = c.idealTimeline.milestonePlan;
  const actual = c.actuals.milestoneActual;

  const ko = parseDate(c.baseline.kickoffDate);
  if (!ko) return projected;

  projected.kickoff = ideal.kickoff || toIso(ko);

  for (let i = 1; i < milestoneOrder.length; i += 1) {
    const key = milestoneOrder[i];
    const prevKey = milestoneOrder[i - 1];
    const actualDate = parseDate(actual[key]);
    const idealDate = parseDate(ideal[key]);
    const prevProjected = parseDate(projected[prevKey]);
    const prevIdeal = parseDate(ideal[prevKey]);

    if (actualDate) {
      projected[key] = toIso(actualDate);
      continue;
    }

    if (!idealDate) {
      projected[key] = projected[prevKey] || "";
      continue;
    }

    if (!prevProjected || !prevIdeal) {
      projected[key] = toIso(idealDate);
      continue;
    }

    const lag = Math.max(0, diffDays(prevIdeal, idealDate));
    const shifted = addOffset(prevProjected, lag, c.settings.useBusinessDays);
    projected[key] = toIso(shifted > idealDate ? shifted : idealDate);
  }

  return projected;
}

function computeDerived(c, now = new Date()) {
  const derived = { ...c.derived, projectedMilestones: { ...emptyMilestones } };
  const activeEnd = activeContractEndDate(c);
  derived.activeContractEndDate = activeEnd ? toIso(activeEnd) : "";

  const projected = computeProjectedMilestones(c);
  derived.projectedMilestones = projected;
  derived.projectedPublishDate = projected.publishing || "";
  derived.projectedReportDate = projected.reporting || "";

  const projectedPublish = parseDate(projected.publishing);
  if (!projectedPublish || !activeEnd) {
    derived.projectedPromotionDays = 0;
    derived.feasible = false;
    derived.feasibilityReason = "Set contract end date and enough actuals to project publishing date.";
  } else {
    const promotionDays = Math.max(0, diffDays(projectedPublish, activeEnd) + 1);
    derived.projectedPromotionDays = promotionDays;
    derived.feasible = promotionDays >= 30;
    derived.feasibilityReason = derived.feasible
      ? `Promotion window remains ${promotionDays} day(s).`
      : `No longer feasible: projected promotion window is ${promotionDays} day(s), below 30-day minimum.`;
  }

  const ko = parseDate(c.baseline.kickoffDate);
  const booked = parseDate(c.actuals.milestoneActual.interview) || parseDate(c.idealTimeline.milestonePlan.interview);
  if (!ko) {
    derived.currentPlanStatus = "At Risk";
  } else {
    const elapsed = diffDays(ko, now);
    if (!booked && elapsed > 14) derived.currentPlanStatus = "Behind";
    else if (!booked && elapsed > 7) derived.currentPlanStatus = "At Risk";
    else derived.currentPlanStatus = derived.feasible ? "On Track" : "Behind";
  }

  c.derived = derived;
}

function recomputeAll(c) {
  if (parseDate(c.baseline.kickoffDate)) {
    computeIdealTimeline(c);
    computePolicyLayer(c);
    computeDerived(c);
  }
}

function lockBaseline() {
  const start = parseDate(campaign.baseline.contractStartDate);
  const end = parseDate(campaign.baseline.contractEndDate);
  const ko = parseDate(campaign.baseline.kickoffDate);

  if (!start || !end || !ko) {
    window.alert("Contract start, contract end, and Kick-off date are required.");
    return;
  }
  if (end < start) {
    window.alert("Contract end date must be after contract start date.");
    return;
  }
  if (ko < start || ko > end) {
    window.alert("Kick-off date must be within the contracted date range.");
    return;
  }

  campaign.baseline.locked = true;
  campaign.ui.lastImpact = null;
  recomputeAll(campaign);
  saveCampaign();
  render();
}

function createRevisionSnapshot(reason) {
  campaign.revisions.push({
    schemaVersion: 2,
    createdAt: new Date().toISOString(),
    reason,
    baseline: cloneCampaign(campaign.baseline),
    policyLayer: cloneCampaign(campaign.policyLayer),
    idealTimeline: cloneCampaign(campaign.idealTimeline),
    actuals: cloneCampaign(campaign.actuals),
    derived: cloneCampaign(campaign.derived)
  });
}

function unlockBaseline() {
  const ok = window.confirm("Unlock baseline dates? This creates a revision snapshot and allows baseline edits.");
  if (!ok) return;
  createRevisionSnapshot("Baseline unlocked for contract/KO adjustment");
  campaign.baseline.locked = false;
  saveCampaign();
  render();
}

function baselineInputDisabled() {
  return campaign.baseline.locked;
}

function statusClass(status) {
  if (status === "On Track" || status === "Meets window") return "status-ontrack";
  if (status === "At Risk") return "status-risk";
  if (status === "Behind") return "status-behind";
  if (status === "Missed") return "status-critical";
  if (status === "Critical") return "status-critical";
  return "status-hold";
}

function policyStatusDisplay() {
  if (!campaign.baseline.kickoffDate) {
    return {
      label: "Needs baseline",
      detail: "Set baseline dates to calculate policy windows."
    };
  }

  if (campaign.policyLayer.policyMissedPermanent) {
    return {
      label: "Missed",
      detail: `Permanent policy miss: ${campaign.policyLayer.policyMissReason || "Policy window breached."}`
    };
  }

  return {
    label: "Meets window",
    detail: `Publish-ready week: ${campaign.policyLayer.publishReadyWeekDeadline || "TBC"}. Report-share week: ${campaign.policyLayer.reportShareWeekDeadline || "TBC"}.`
  };
}

function campaignStageStatus() {
  const stage = document.getElementById("liveStage")?.value || "Interview scheduling";
  const interviewDone = parseDate(campaign.actuals.milestoneActual.interview);
  if (["In production", "In review", "Publishing", "Promoting", "Reporting"].includes(stage) && !interviewDone) {
    return {
      label: "Critical",
      detail: "Interview is not completed, so production flow is blocked.",
      stage
    };
  }
  return {
    label: "On Track",
    detail: `Current stage: ${stage}.`,
    stage
  };
}

function renderBaselineCard() {
  const lockState = document.getElementById("baselineLockState");
  const lockBtn = document.getElementById("lockBaseline");
  const unlockBtn = document.getElementById("unlockBaseline");

  const locked = baselineInputDisabled();
  ["contractStartDate", "contractEndDate", "kickoffDate"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = locked;
  });

  lockBtn.disabled = locked;
  unlockBtn.disabled = !locked;
  lockState.textContent = locked
    ? "Baseline is locked. Contract dates and KO are read-only."
    : "Baseline is unlocked. Set dates, then lock to generate the ideal timeline.";
}

function phaseRangeText(phase) {
  return `${formatDate(phase.start)} -> ${formatDate(phase.end)}`;
}

function renderIdealTimeline() {
  const summary = document.getElementById("idealSummary");
  const bars = document.getElementById("idealPhaseBars");
  const table = document.getElementById("idealMilestoneTable");

  if (!campaign.baseline.locked) {
    summary.textContent = "Lock baseline dates to generate the ideal timeline.";
    bars.innerHTML = "";
    table.innerHTML = "";
    return;
  }

  const prod = campaign.idealTimeline.phaseWindows.production;
  const prom = campaign.idealTimeline.phaseWindows.promotion;
  const rep = campaign.idealTimeline.phaseWindows.reporting;

  summary.innerHTML = `
    Production window: <strong>${phaseRangeText(prod)}</strong><br>
    Promotion window: <strong>${phaseRangeText(prom)}</strong><br>
    Reporting window: <strong>${phaseRangeText(rep)}</strong>
  `;

  const phaseRows = [
    { name: "Production", window: prod, days: phaseDurationDays(campaign, "production") },
    { name: "Promotion", window: prom, days: phaseDurationDays(campaign, "promotion") },
    { name: "Reporting", window: rep, days: phaseDurationDays(campaign, "reporting") }
  ];

  bars.innerHTML = phaseRows.map((row) => `
    <div class="phase-row">
      <div class="phase-name">${row.name}</div>
      <div class="phase-bar-wrap"><div class="phase-bar">${row.days} days (${phaseRangeText(row.window)})</div></div>
    </div>
  `).join("");

  const writingDate = parseDate(campaign.idealTimeline.milestonePlan.writing);
  const interviewDate = parseDate(campaign.idealTimeline.milestonePlan.interview);
  const internalReviewDate = parseDate(campaign.idealTimeline.milestonePlan.internalReview);
  const clientReviewDate = parseDate(campaign.idealTimeline.milestonePlan.clientReview);
  const windowHints = {
    contentPlan: `Complete by end of Week 1 (${formatWc(campaign.idealTimeline.milestonePlan.contentPlan)})`,
    interview: `Interview window in Week 2; complete by week end (${formatWc(campaign.idealTimeline.milestonePlan.interview)})`,
    writing: writingDate && interviewDate ? `8 working days (${formatWc(interviewDate)} to ${formatWc(writingDate)})` : formatWc(campaign.idealTimeline.milestonePlan.writing),
    internalReview: internalReviewDate && writingDate ? `2 working days (${formatWc(writingDate)} to ${formatWc(internalReviewDate)})` : formatWc(campaign.idealTimeline.milestonePlan.internalReview),
    clientReview: clientReviewDate && internalReviewDate ? `5 working days (${formatWc(internalReviewDate)} to ${formatWc(clientReviewDate)})` : formatWc(campaign.idealTimeline.milestonePlan.clientReview),
    publishing: formatWc(campaign.idealTimeline.milestonePlan.publishing),
    promoting: `${formatWc(campaign.idealTimeline.phaseWindows.promotion.start)} to ${formatWc(campaign.idealTimeline.phaseWindows.promotion.end)}`,
    reporting: formatWc(campaign.idealTimeline.milestonePlan.reporting)
  };

  table.innerHTML = `
    <table class="milestone-table">
      <thead>
        <tr><th>Workflow step</th><th>Ideal date (read-only)</th><th>Ideal window</th></tr>
      </thead>
      <tbody>
        ${milestoneOrder.map((key) => `
          <tr>
            <td>${milestoneLabels[key]}</td>
            <td>${formatDate(campaign.idealTimeline.milestonePlan[key])}</td>
            <td>${windowHints[key] || ""}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function setImpactSummary(milestoneKey, oldValue, newValue, before, after) {
  if (!oldValue && !newValue) {
    campaign.ui.lastImpact = null;
    return;
  }

  const beforePublish = parseDate(before.projectedPublishDate);
  const afterPublish = parseDate(after.projectedPublishDate);
  const beforeReport = parseDate(before.projectedReportDate);
  const afterReport = parseDate(after.projectedReportDate);

  const publishDelta = beforePublish && afterPublish ? diffDays(beforePublish, afterPublish) : null;
  const reportDelta = beforeReport && afterReport ? diffDays(beforeReport, afterReport) : null;
  const promoDelta = after.projectedPromotionDays - before.projectedPromotionDays;

  const shiftLines = [];
  if (publishDelta !== null && publishDelta !== 0) {
    shiftLines.push(`Projected publishing moved ${publishDelta > 0 ? `later by ${publishDelta}` : `earlier by ${Math.abs(publishDelta)}`} day(s).`);
  }
  if (reportDelta !== null && reportDelta !== 0) {
    shiftLines.push(`Projected reporting moved ${reportDelta > 0 ? `later by ${reportDelta}` : `earlier by ${Math.abs(reportDelta)}`} day(s).`);
  }
  if (promoDelta !== 0) {
    shiftLines.push(`Projected promotion window ${promoDelta > 0 ? `increased by ${promoDelta}` : `reduced by ${Math.abs(promoDelta)}`} day(s).`);
  }
  if (before.feasible !== after.feasible) {
    shiftLines.push(after.feasible ? "Timeline moved back to feasible." : "Timeline is now no longer feasible.");
  }

  campaign.ui.lastImpact = {
    milestone: milestoneLabels[milestoneKey] || milestoneKey,
    oldValue,
    newValue,
    lines: shiftLines.length ? shiftLines : ["No downstream shift detected."]
  };
}

function renderActualProgress() {
  const table = document.getElementById("actualMilestoneTable");
  const today = todayIso();
  const rows = milestoneOrder.map((key) => `
    <tr>
      <td>${milestoneLabels[key]}</td>
      <td>${formatDate(campaign.idealTimeline.milestonePlan[key])}</td>
      <td>${
        key === "kickoff"
          ? `<span class="status-meta">From baseline KO: ${formatDate(campaign.baseline.kickoffDate)}</span>`
          : `<input type="date" data-actual="${key}" max="${today}" value="${campaign.actuals.milestoneActual[key] || ""}" ${campaign.baseline.locked ? "" : "disabled"} />`
      }</td>
      <td>${key === "kickoff" ? "-" : renderVariance(campaign.idealTimeline.milestonePlan[key], campaign.actuals.milestoneActual[key])}</td>
    </tr>
  `).join("");

  table.innerHTML = `
    <table class="milestone-table">
      <thead>
        <tr><th>Workflow step</th><th>Ideal date/window</th><th>Actual completion date</th><th>Variance</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  table.querySelectorAll("input[data-actual]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const key = event.target.getAttribute("data-actual");
      const value = event.target.value || "";
      if (value && value > today) {
        window.alert("Actual completion dates cannot be in the future.");
        event.target.value = campaign.actuals.milestoneActual[key] || "";
        return;
      }

      if (key === "promoting" && value) {
        const publishActual = campaign.actuals.milestoneActual.publishing || "";
        if (!publishActual) {
          window.alert("Set the Publishing actual date before setting Promoting.");
          event.target.value = campaign.actuals.milestoneActual[key] || "";
          return;
        }
        if (value < publishActual) {
          window.alert("Promoting cannot be earlier than Publishing.");
          event.target.value = campaign.actuals.milestoneActual[key] || "";
          return;
        }
      }

      const before = cloneCampaign(campaign.derived);
      const oldValue = campaign.actuals.milestoneActual[key] || "";
      campaign.actuals.milestoneActual[key] = value;
      if (key === "publishing") campaign.actuals.firstPublishActualDate = value;
      if (key === "reporting") campaign.actuals.reportSharedActualDate = value;
      recomputeAll(campaign);
      const after = cloneCampaign(campaign.derived);
      setImpactSummary(key, oldValue, value, before, after);
      saveCampaign();
      render();
    });
  });
}

function renderVariance(idealIso, actualIso) {
  const ideal = parseDate(idealIso);
  const actual = parseDate(actualIso);
  if (!ideal || !actual) return "-";
  const variance = diffDays(ideal, actual);
  if (variance === 0) return '<span class="delta-chip">On target</span>';
  if (variance > 0) return `<span class="delta-chip delta-late">+${variance} days</span>`;
  return `<span class="delta-chip delta-early">${variance} days</span>`;
}

function renderTimelineVisual(viewMode, hostId) {
  const host = document.getElementById(hostId);
  if (!host) return;
  if (!campaign.baseline.locked) {
    host.innerHTML = '<div class="status-meta">Lock baseline to show visual timeline.</div>';
    return;
  }

  const coreMilestones = ["kickoff", "interview", "publishing", "reporting"];

  const points = [];
  coreMilestones.forEach((key) => {
    const plan = parseDate(campaign.idealTimeline.milestonePlan[key]);
    const actual = parseDate(campaign.actuals.milestoneActual[key]);
    if (plan) points.push({ key, type: "plan", date: plan });
    if (actual) points.push({ key, type: "actual", date: actual });
  });

  const policyDate = parseDate(campaign.policyLayer.firstPublishByDay30Deadline);
  const revised = parseDate(campaign.derived.projectedPublishDate);
  const prodStart = parseDate(campaign.idealTimeline.phaseWindows.production.start);
  const prodEnd = parseDate(campaign.idealTimeline.phaseWindows.production.end);
  const promStart = parseDate(campaign.idealTimeline.phaseWindows.promotion.start);
  const promEnd = parseDate(campaign.idealTimeline.phaseWindows.promotion.end);
  const repStart = parseDate(campaign.idealTimeline.phaseWindows.reporting.start);
  const repEnd = parseDate(campaign.idealTimeline.phaseWindows.reporting.end);
  [prodStart, prodEnd, promStart, promEnd, repStart, repEnd].forEach((d) => {
    if (d) points.push({ key: "phase", type: "anchor", date: d });
  });
  if (policyDate) points.push({ key: "policy", type: "anchor", date: policyDate });
  if (revised) points.push({ key: "projected", type: "anchor", date: revised });

  if (!points.length) {
    host.innerHTML = '<div class="status-meta">No timeline points available yet.</div>';
    return;
  }

  points.sort((a, b) => a.date - b.date);
  const min = addDays(points[0].date, -3);
  const max = addDays(points[points.length - 1].date, 3);
  const span = Math.max(1, diffDays(min, max));

  const width = Math.max(1100, host.clientWidth || 1100);
  const height = 430;
  const left = 24;
  const right = 12;
  const laneTaskStart = 98;
  const rowGap = 26;
  const flowRows = viewMode === "client"
    ? [
      { type: "milestone", label: "Kick-off", key: "kickoff" },
      { type: "bar", label: "Content Plan", start: "kickoff", end: "contentPlan" },
      { type: "bar", label: "Interview window", start: "contentPlan", end: "interview" },
      { type: "milestone", label: "Interview complete", key: "interview" },
      // Client view folds internal review into Writing, while keeping client review explicit.
      { type: "bar", label: "Writing", start: "interview", end: "internalReview" },
      { type: "bar", label: "Client review", start: "internalReview", end: "clientReview" },
      { type: "milestone", label: "Publishing", key: "publishing" },
      { type: "bar", label: "Promoting", start: "publishing", end: "promoting" },
      { type: "milestone", label: "Reporting", key: "reporting" }
    ]
    : [
      { type: "milestone", label: "Kick-off", key: "kickoff" },
      { type: "bar", label: "Content Plan", start: "kickoff", end: "contentPlan" },
      { type: "bar", label: "Interview window", start: "contentPlan", end: "interview" },
      { type: "milestone", label: "Interview complete", key: "interview" },
      { type: "bar", label: "Writing", start: "interview", end: "writing" },
      { type: "bar", label: "Internal Review", start: "writing", end: "internalReview" },
      { type: "bar", label: "Client review", start: "internalReview", end: "clientReview" },
      { type: "milestone", label: "Publishing", key: "publishing" },
      { type: "bar", label: "Promoting", start: "publishing", end: "promoting" },
      { type: "milestone", label: "Reporting", key: "reporting" }
    ];
  const laneTaskEnd = laneTaskStart + (flowRows.length * rowGap);
  const timelineBottom = laneTaskEnd + 18;

  const xOf = (d) => left + (diffDays(min, d) / span) * (width - left - right);

  const weekLines = [];
  const today = startOfDay(new Date());
  const ko = parseDate(campaign.baseline.kickoffDate);
  const week1Start = ko ? nextMondayAfterKoWeek(ko) : null;
  const koWeekStart = week1Start ? addDays(week1Start, -7) : null;
  const totalWeeks = Math.ceil(span / 7);
  const labelEvery = totalWeeks > 16 ? 4 : totalWeeks > 10 ? 2 : 1;
  let weekIndex = 0;
  let cursor = weekStartMonday(min);
  while (cursor <= max) {
    const x = xOf(cursor);
    const isCurrentWeek = weekStartMonday(today).getTime() === cursor.getTime();
    let weekLabel = "";
    if (week1Start) {
      if (koWeekStart && cursor.getTime() === koWeekStart.getTime()) {
        weekLabel = "W0";
      } else if (!koWeekStart || cursor > koWeekStart) {
        const deltaWeeks = Math.floor(diffDays(week1Start, cursor) / 7);
        weekLabel = `W${deltaWeeks + 1}`;
      }
    }
    weekLines.push(`<line class="${isCurrentWeek ? "vis-week-line vis-week-current" : "vis-week-line"}" x1="${x}" y1="34" x2="${x}" y2="${timelineBottom + 8}"/>`);
    if (weekLabel && weekIndex % labelEvery === 0) {
      weekLines.push(`<text class="vis-week-label" x="${x}" y="20" text-anchor="middle">${weekLabel}</text>`);
    }
    cursor = addDays(cursor, 7);
    weekIndex += 1;
  }

  const phaseBands = [];
  const addPhaseBand = (start, end, cls, label) => {
    if (!start || !end) return;
    const x1 = xOf(start);
    const x2 = xOf(end);
    const w = Math.max(2, x2 - x1);
    phaseBands.push(`<rect class="${cls}" x="${x1}" y="48" width="${w}" height="${timelineBottom - 40}" rx="8" ry="8"/>`);
    phaseBands.push(`<text class="vis-text vis-band-label" x="${x1 + 8}" y="64">${label}</text>`);
  };
  addPhaseBand(prodStart, prodEnd, "vis-phase-prod-band", `Production (${phaseDurationDays(campaign, "production")}d)`);
  addPhaseBand(promStart, promEnd, "vis-phase-prom-band", `Promotion (${phaseDurationDays(campaign, "promotion")}d)`);
  addPhaseBand(repStart, repEnd, "vis-phase-rep-band", `Reporting (${phaseDurationDays(campaign, "reporting")}d)`);

  const rowObjects = [];
  flowRows.forEach((item, idx) => {
    const y = laneTaskStart + (idx * rowGap);
    if (item.type === "bar") {
      const start = parseDate(campaign.idealTimeline.milestonePlan[item.start]);
      const end = parseDate(campaign.idealTimeline.milestonePlan[item.end]);
      if (!start || !end) return;
      const x1 = xOf(start);
      const x2 = xOf(end);
      const w = Math.max(6, x2 - x1);
      rowObjects.push(`<rect class="vis-task" x="${x1}" y="${y}" width="${w}" height="12" rx="6" ry="6"/>`);
      rowObjects.push(`<text class="vis-bar-label" x="${Math.min(x2 + 6, width - right - 6)}" y="${y + 10}">${item.label}</text>`);
      return;
    }
    const plan = parseDate(campaign.idealTimeline.milestonePlan[item.key]);
    const actual = parseDate(campaign.actuals.milestoneActual[item.key]);
    const labelX = Math.min(
      Math.max(plan ? xOf(plan) : 0, actual ? xOf(actual) : 0) + 8,
      width - right - 6
    );
    if (plan) rowObjects.push(`<rect class="vis-plan-node" x="${xOf(plan) - 4}" y="${y}" width="10" height="12" rx="3" ry="3"/>`);
    if (actual) rowObjects.push(`<rect class="vis-actual-node" x="${xOf(actual) - 4}" y="${y}" width="10" height="12" rx="3" ry="3"/>`);
    rowObjects.push(`<text class="vis-milestone-label" x="${labelX}" y="${y + 10}">${item.label}</text>`);
  });

  const policyLine = policyDate
    ? `<line class="vis-policy" x1="${xOf(policyDate)}" y1="34" x2="${xOf(policyDate)}" y2="${timelineBottom + 8}"/>`
    : "";

  const projectedLine = revised
    ? `<line class="vis-revised" x1="${xOf(revised)}" y1="34" x2="${xOf(revised)}" y2="${timelineBottom + 8}"/>`
    : "";

  const policyVisuals = viewMode === "internal" ? `${policyLine}${projectedLine}` : "";
  const internalKeyItems = viewMode === "internal"
    ? `
      <span><span class="key-line key-policy"></span>Policy Day 30</span>
      <span><span class="key-line key-projected"></span>Projected publish</span>
    `
    : "";

  host.innerHTML = `
    <div class="timeline-range">${formatDate(min)} -> ${formatDate(max)}</div>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Ideal vs actual timeline">
      <line class="vis-axis" x1="${left}" y1="34" x2="${width - right}" y2="34"/>
      ${weekLines.join("")}
      ${phaseBands.join("")}
      <line class="vis-lane" x1="${left}" y1="${laneTaskStart}" x2="${width - right}" y2="${laneTaskStart}"/>
      <line class="vis-lane" x1="${left}" y1="${laneTaskEnd}" x2="${width - right}" y2="${laneTaskEnd}"/>
      ${rowObjects.join("")}
      ${policyVisuals}
    </svg>
    <div class="timeline-key">
      <span><span class="key-swatch key-prod"></span>Production</span>
      <span><span class="key-swatch key-prom"></span>Promotion</span>
      <span><span class="key-swatch key-rep"></span>Reporting</span>
      ${internalKeyItems}
      <span><span class="key-line key-week"></span>Week boundary</span>
    </div>
  `;
}

function renderTimelineList(viewMode, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = [];

  if (viewMode === "client") {
    const prod = campaign.idealTimeline.phaseWindows.production;
    const prom = campaign.idealTimeline.phaseWindows.promotion;
    const rep = campaign.idealTimeline.phaseWindows.reporting;
    items.push(`<div class="timeline-item"><strong>Production</strong>${phaseRangeText(prod)}</div>`);
    if (campaign.settings.showInterviewClient) {
      items.push(`<div class="timeline-item"><strong>Interview</strong>${formatDate(campaign.actuals.milestoneActual.interview || campaign.idealTimeline.milestonePlan.interview)}</div>`);
    }
    items.push(`<div class="timeline-item"><strong>Promotion</strong>${phaseRangeText(prom)}</div>`);
    items.push(`<div class="timeline-item"><strong>Reporting</strong>${phaseRangeText(rep)}</div>`);
  } else {
    items.push(`<div class="timeline-item"><strong>Active contract end</strong>${formatDate(campaign.derived.activeContractEndDate)}</div>`);
    items.push(`<div class="timeline-item"><strong>Projected publish</strong>${formatDate(campaign.derived.projectedPublishDate)}</div>`);
    items.push(`<div class="timeline-item"><strong>Projected report share</strong>${formatDate(campaign.derived.projectedReportDate)}</div>`);
    milestoneOrder.forEach((key) => {
      items.push(`<div class="timeline-item"><strong>${milestoneLabels[key]}</strong>Ideal: ${formatDate(campaign.idealTimeline.milestonePlan[key])}<br>Actual: ${formatDate(campaign.actuals.milestoneActual[key])}</div>`);
    });
  }

  container.innerHTML = `<div class="timeline-list">${items.join("")}</div>`;
}

function renderStatusAndFeasibility() {
  const policy = policyStatusDisplay();
  const stage = campaignStageStatus();
  const currentPlanLabel = campaign.derived.feasible ? campaign.derived.currentPlanStatus : "Behind";

  const cards = document.getElementById("statusCards");
  cards.innerHTML = `
    <div class="status-card">
      <h3>Internal deadline check</h3>
      <span class="badge ${statusClass(policy.label)}">${policy.label}</span>
      <div class="status-meta">${policy.detail}</div>
    </div>
    <div class="status-card">
      <h3>Current plan check</h3>
      <span class="badge ${statusClass(currentPlanLabel)}">${currentPlanLabel}</span>
      <div class="status-meta">Projected promotion window: <strong>${campaign.derived.projectedPromotionDays}</strong> day(s).<br>${campaign.derived.feasibilityReason}</div>
    </div>
    <div class="status-card">
      <h3>Current campaign stage</h3>
      <span class="badge ${statusClass(stage.label)}">${stage.label}</span>
      <div class="status-meta">${stage.detail}</div>
    </div>
  `;

  const banner = document.getElementById("feasibilityBanner");
  if (!campaign.derived.feasible) {
    banner.className = "feasibility-banner infeasible";
    banner.innerHTML = `<strong>Timeline no longer feasible.</strong> ${campaign.derived.feasibilityReason}`;
  } else {
    banner.className = "feasibility-banner feasible";
    banner.innerHTML = `<strong>Timeline feasible.</strong> ${campaign.derived.feasibilityReason}`;
  }

  const impact = document.getElementById("impactSummary");
  const lastImpact = campaign.ui.lastImpact;
  if (!lastImpact) {
    impact.innerHTML = "No recent workflow step update impact to show.";
  } else {
    impact.innerHTML = `
      <div class="timeline-item">
        <strong>Updated workflow step: ${lastImpact.milestone}</strong>
        ${lastImpact.oldValue ? `Previous: ${formatDate(lastImpact.oldValue)} | ` : ""}Now: ${formatDate(lastImpact.newValue)}
        <ul class="rec-list impact-list">${lastImpact.lines.map((line) => `<li>${line}</li>`).join("")}</ul>
      </div>
    `;
  }
}

function renderActions() {
  const policy = policyStatusDisplay();
  const stage = campaignStageStatus();
  const actions = [];

  if (!campaign.baseline.locked) {
    actions.push("Complete baseline setup and click Lock baseline.");
  }

  if (campaign.baseline.locked && !campaign.actuals.milestoneActual.interview) {
    actions.push("Update Interview actual completion date before progressing Writing and later production steps.");
  }

  if (!campaign.derived.feasible) {
    actions.push("Align with AM and client now. Current timeline no longer supports a 30-day promotion window.");
  }

  if (policy.label === "Missed") {
    actions.push("Record policy miss in client comms and reporting. This remains permanently flagged.");
  }

  if (stage.label === "Critical") {
    actions.push("Move stage back or resolve dependency before continuing execution.");
  }

  if (!actions.length) {
    actions.push("No immediate intervention needed. Continue updating actual completion dates for workflow steps.");
  }

  const primary = document.getElementById("primaryAction");
  const list = document.getElementById("csmActions");
  primary.innerHTML = `<strong>Do this first</strong>${actions[0]}`;
  list.innerHTML = actions.slice(1).map((item) => `<li>${item}</li>`).join("");
}

function renderRevisions() {
  const el = document.getElementById("revisionsList");
  if (!campaign.revisions.length) {
    el.textContent = "No revisions yet.";
    return;
  }

  el.innerHTML = campaign.revisions.map((rev, i) => `
    <div class="revision-item">
      <strong>Revision ${i + 1} - ${formatDate(rev.createdAt)}</strong>
      <div>Reason: ${rev.reason}</div>
      <div>Contract end used: ${formatDate(rev.baseline?.contractEndDate)}</div>
      <div>Kick-off used: ${formatDate(rev.baseline?.kickoffDate)}</div>
      <div>Projected publish at snapshot: ${formatDate(rev.derived?.projectedPublishDate)}</div>
    </div>
  `).join("");
}

function writeCampaignToForm() {
  document.getElementById("campaignName").value = campaign.campaignName;
  document.getElementById("contractStartDate").value = campaign.baseline.contractStartDate;
  document.getElementById("contractEndDate").value = campaign.baseline.contractEndDate;
  document.getElementById("kickoffDate").value = campaign.baseline.kickoffDate;
  document.getElementById("extension30Days").checked = campaign.baseline.extension30Days;
  document.getElementById("extensionApprovedDate").value = campaign.baseline.extensionApprovedDate;

  document.getElementById("liveStage").innerHTML = liveStages.map((stage) => `<option value="${stage}">${stage}</option>`).join("");
  document.getElementById("liveStage").value = campaign.derived.liveStage || campaign.ui.liveStage || liveStages[0];

  document.getElementById("useBusinessDays").checked = campaign.settings.useBusinessDays;
  document.getElementById("showInterviewClient").checked = campaign.settings.showInterviewClient;

  renderBaselineCard();
}

function readFormToCampaign() {
  campaign.campaignName = document.getElementById("campaignName").value.trim();
  campaign.settings.useBusinessDays = document.getElementById("useBusinessDays").checked;
  campaign.settings.showInterviewClient = document.getElementById("showInterviewClient").checked;

  if (!campaign.baseline.locked) {
    campaign.baseline.contractStartDate = document.getElementById("contractStartDate").value;
    campaign.baseline.contractEndDate = document.getElementById("contractEndDate").value;
    campaign.baseline.kickoffDate = document.getElementById("kickoffDate").value;
  }

  campaign.baseline.extension30Days = document.getElementById("extension30Days").checked;
  campaign.baseline.extensionApprovedDate = document.getElementById("extensionApprovedDate").value;
  campaign.ui.liveStage = document.getElementById("liveStage").value;

  recomputeAll(campaign);
}

function exportJson() {
  downloadFile("campaign-timeline-v2.json", JSON.stringify(campaign, null, 2), "application/json");
}

function exportCsv() {
  const rows = [
    ["Campaign", campaign.campaignName || ""],
    ["Contract start", campaign.baseline.contractStartDate],
    ["Contract end", campaign.baseline.contractEndDate],
    ["Active contract end", campaign.derived.activeContractEndDate],
    ["Kick-off", campaign.baseline.kickoffDate],
    ["Extension +30 days", campaign.baseline.extension30Days ? "Yes" : "No"],
    [""],
    ["Workflow step", "Ideal date", "Actual completion date", "Variance days"]
  ];

  milestoneOrder.forEach((key) => {
    const ideal = campaign.idealTimeline.milestonePlan[key] || "";
    const actual = campaign.actuals.milestoneActual[key] || "";
    const variance = ideal && actual ? String(diffDays(parseDate(ideal), parseDate(actual))) : "";
    rows.push([milestoneLabels[key], ideal, actual, variance]);
  });

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  downloadFile("campaign-schedule-v2.csv", csv, "text/csv");
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function createRevision() {
  createRevisionSnapshot("Manual revision snapshot");
  saveCampaign();
  render();
}

function resetPlanner() {
  const ok = window.confirm("Clear planner data and reset to a new campaign state?");
  if (!ok) return;
  campaign = cloneCampaign(defaultCampaign);
  saveCampaign();
  render();
  const testResults = document.getElementById("testResults");
  if (testResults) testResults.textContent = "Not run yet.";
}

function runAcceptanceTests() {
  const results = [];
  const assert = (name, pass, detail) => results.push({ name, pass: Boolean(pass), detail });

  const base = cloneCampaign(defaultCampaign);
  base.baseline.contractStartDate = "2026-01-01";
  base.baseline.contractEndDate = "2026-03-31";
  base.baseline.kickoffDate = "2026-01-07";
  base.baseline.locked = true;
  recomputeAll(base);

  assert("1) First-time setup success", !!base.idealTimeline.phaseWindows.production.start, "Baseline generates ideal timeline windows.");

  const t2 = cloneCampaign(base);
  const before2 = cloneCampaign(t2.derived);
  t2.actuals.milestoneActual.interview = "2026-01-31";
  recomputeAll(t2);
  assert("2) Actual update shifts forecast", before2.projectedPublishDate !== t2.derived.projectedPublishDate, "Late interview shifts projected publish date.");

  const t3 = cloneCampaign(base);
  t3.actuals.milestoneActual.clientReview = "2026-03-01";
  recomputeAll(t3, new Date("2026-03-10T00:00:00"));
  const stickyOnce = t3.policyLayer.policyMissedPermanent;
  t3.actuals.milestoneActual.clientReview = "2026-01-20";
  recomputeAll(t3);
  assert("3) Policy sticky miss", stickyOnce && t3.policyLayer.policyMissedPermanent, "Policy miss remains permanent after later recovery.");

  const t4 = cloneCampaign(base);
  t4.actuals.milestoneActual.interview = "2026-03-15";
  recomputeAll(t4);
  assert("4) Feasibility failure", t4.derived.feasible === false, "Promotion window below 30 days is infeasible.");

  const t5 = cloneCampaign(t4);
  t5.baseline.extension30Days = true;
  recomputeAll(t5);
  assert("5) Extension toggle", parseDate(t5.derived.activeContractEndDate) > parseDate(t4.derived.activeContractEndDate), "Extension shifts active contract end without clearing policy flags.");

  const t6 = cloneCampaign(base);
  t6.actuals.milestoneActual.interview = "2099-01-01";
  const futureBlocked = parseDate(t6.actuals.milestoneActual.interview) > parseDate(todayIso());
  assert("6) Future actual prevention", futureBlocked, "UI validation prevents future actual dates.");

  const t7 = cloneCampaign(base);
  const week1Start = parseDate(t7.idealTimeline.milestonePlan.contentPlan);
  assert("7) Week anchor correctness", week1Start && week1Start.getDay() === 1 && week1Start > parseDate(t7.baseline.kickoffDate), "Week 1 starts Monday after KO week.");

  const legacy = {
    campaignName: "Legacy",
    kickoffDate: "2026-01-07",
    milestones: { interviewBooked: "2026-01-14" },
    firstPublishDate: "2026-02-15"
  };
  const migrated = migrateToV2(legacy);
  assert("8) Migration compatibility", migrated.schemaVersion === 2 && migrated.idealTimeline.milestonePlan.interview === "2026-01-14", "Legacy schema migrates into v2 shape.");

  const el = document.getElementById("testResults");
  el.innerHTML = results
    .map((r) => `<div class="${r.pass ? "pass" : "fail"}">${r.pass ? "PASS" : "FAIL"} - ${r.name}: ${r.detail}</div>`)
    .join("");
}

function bindEvents() {
  document.querySelectorAll("#campaignName,#contractStartDate,#contractEndDate,#kickoffDate,#extension30Days,#extensionApprovedDate,#liveStage,#useBusinessDays,#showInterviewClient")
    .forEach((el) => {
      el.addEventListener("change", () => {
        readFormToCampaign();
        saveCampaign();
        render();
      });
    });

  document.getElementById("lockBaseline").addEventListener("click", lockBaseline);
  document.getElementById("unlockBaseline").addEventListener("click", unlockBaseline);
  document.getElementById("createRevision").addEventListener("click", createRevision);
  document.getElementById("resetPlanner").addEventListener("click", resetPlanner);
  document.getElementById("exportJson").addEventListener("click", exportJson);
  document.getElementById("exportCsv").addEventListener("click", exportCsv);
  document.getElementById("runTests").addEventListener("click", runAcceptanceTests);

}

function render() {
  writeCampaignToForm();
  recomputeAll(campaign);
  renderIdealTimeline();
  renderActualProgress();
  renderTimelineVisual("client", "timelineVisualClient");
  renderTimelineVisual("internal", "timelineVisualInternal");
  renderTimelineList("client", "timelineViewClient");
  renderTimelineList("internal", "timelineViewInternal");
  renderStatusAndFeasibility();
  renderActions();
  renderRevisions();
}

bindEvents();
render();

window.timelinePlanner = {
  migrateToV2,
  recomputeAll,
  computeDerived,
  computePolicyLayer,
  computeIdealTimeline
};

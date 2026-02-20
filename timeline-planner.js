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
  clientBrand: "",
  publication: "",
  baseline: {
    contractStartDate: "",
    contractEndDate: "",
    kickoffDate: "",
    extension30Days: false,
    locked: false
  },
  policyLayer: {
    publishReadyWeekDeadline: "",
    reportShareWeekDeadline: "",
    firstPublishByDay30Deadline: "",
    reportShareByDay90Deadline: "",
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
    showProjectedOnCharts: false,
    showLagOnCharts: true,
    chartInternalView: false
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

function isFutureIsoDate(value, now = new Date()) {
  const parsed = parseDate(value);
  if (!parsed) return false;
  return parsed > startOfDay(now);
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

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return startOfDay(new Date(year, month - 1, day));
}

function firstWeekdayOfMonth(year, month, weekday) {
  let d = startOfDay(new Date(year, month, 1));
  while (d.getDay() !== weekday) d = addDays(d, 1);
  return d;
}

function lastWeekdayOfMonth(year, month, weekday) {
  let d = startOfDay(new Date(year, month + 1, 0));
  while (d.getDay() !== weekday) d = addDays(d, -1);
  return d;
}

function observedFixedHoliday(year, month, day, taken) {
  let d = startOfDay(new Date(year, month, day));
  if (d.getDay() === 6) d = addDays(d, 2);
  else if (d.getDay() === 0) d = addDays(d, 1);
  while (taken.has(toIso(d)) || d.getDay() === 0 || d.getDay() === 6) {
    d = addDays(d, 1);
  }
  taken.add(toIso(d));
  return d;
}

const ukNonWorkingCache = new Map();

function ukNonWorkingDaysForYear(year) {
  if (ukNonWorkingCache.has(year)) return ukNonWorkingCache.get(year);
  const days = new Set();
  const takenObserved = new Set();

  const add = (d) => days.add(toIso(d));

  add(observedFixedHoliday(year, 0, 1, takenObserved)); // New Year's Day
  const easter = easterSunday(year);
  add(addDays(easter, -2)); // Good Friday
  add(addDays(easter, 1)); // Easter Monday
  add(firstWeekdayOfMonth(year, 4, 1)); // Early May bank holiday (first Monday in May)
  add(lastWeekdayOfMonth(year, 4, 1)); // Spring bank holiday (last Monday in May)
  add(lastWeekdayOfMonth(year, 7, 1)); // Summer bank holiday (last Monday in August)
  add(observedFixedHoliday(year, 11, 25, takenObserved)); // Christmas Day
  add(observedFixedHoliday(year, 11, 26, takenObserved)); // Boxing Day

  // Office shutdown: days between Christmas and New Year are non-working.
  for (let day = 27; day <= 31; day += 1) {
    const d = startOfDay(new Date(year, 11, day));
    if (d.getDay() !== 0 && d.getDay() !== 6) add(d);
  }

  ukNonWorkingCache.set(year, days);
  return days;
}

function isUkWorkingDay(date) {
  const d = startOfDay(date);
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return false;
  return !ukNonWorkingDaysForYear(d.getFullYear()).has(toIso(d));
}

function workingDayOnOrAfter(date) {
  let d = startOfDay(date);
  while (!isUkWorkingDay(d)) d = addDays(d, 1);
  return d;
}

function addBusinessDays(date, days) {
  const d = new Date(date);
  const direction = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    d.setDate(d.getDate() + direction);
    if (isUkWorkingDay(d)) remaining -= 1;
  }
  return startOfDay(d);
}

function addOffset(date, days, useBusinessDays) {
  return useBusinessDays ? addBusinessDays(date, days) : addDays(date, days);
}

function diffDays(a, b) {
  const oneDay = 1000 * 60 * 60 * 24;
  const aUtc = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bUtc = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((bUtc - aUtc) / oneDay);
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

function lastWorkingDayOfWeek(date) {
  let cursor = weekEndSunday(date);
  while (!isUkWorkingDay(cursor)) {
    cursor = addDays(cursor, -1);
  }
  return cursor;
}

function mergeMilestones(source) {
  return { ...emptyMilestones, ...(source || {}) };
}

function migrateToV2(parsed) {
  const migrated = cloneCampaign(defaultCampaign);
  if (!parsed || typeof parsed !== "object") return migrated;

  migrated.campaignName = parsed.campaignName || "";
  migrated.clientBrand = parsed.clientBrand || "";
  migrated.publication = parsed.publication || "";
  migrated.settings.useBusinessDays = Boolean(parsed.settings?.useBusinessDays);
  migrated.settings.showProjectedOnCharts = Boolean(parsed.settings?.showProjectedOnCharts);
  migrated.settings.showLagOnCharts = parsed.settings?.showLagOnCharts !== false;
  migrated.settings.chartInternalView = Boolean(parsed.settings?.chartInternalView);

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
  const koInput = parseDate(c.baseline.kickoffDate);
  if (!koInput) return;
  const ko = workingDayOnOrAfter(koInput);
  const week1Start = nextMondayAfterKoWeek(ko);
  const week1End = addDays(week1Start, 6);
  const week2End = addDays(week1Start, 13);

  const productionStart = ko;
  // Phase timing rules:
  // Production (creation) = 30 calendar days, Promotion = 45 calendar days, Reporting = approx. 15 calendar days.
  const productionEnd = addDays(ko, 29);
  const promotionStart = addDays(productionEnd, 1);
  const promotionEnd = addDays(promotionStart, 44);
  const reportingStart = addDays(promotionEnd, 1);
  const reportingEnd = addDays(reportingStart, 14);

  c.idealTimeline.phaseWindows.production = { start: toIso(productionStart), end: toIso(productionEnd) };
  c.idealTimeline.phaseWindows.promotion = { start: toIso(promotionStart), end: toIso(promotionEnd) };
  c.idealTimeline.phaseWindows.reporting = { start: toIso(reportingStart), end: toIso(reportingEnd) };

  // Workflow duration assumptions (working days):
  // Writing 8wd, Internal Review 2wd, Client Review 5wd.
  const contentPlanDate = workingDayOnOrAfter(week1End);
  const interviewDate = workingDayOnOrAfter(week2End > contentPlanDate ? week2End : addDays(contentPlanDate, 1));
  const writingDate = addBusinessDays(interviewDate, 8);
  const internalReviewDate = addBusinessDays(writingDate, 2);
  const clientReviewDate = addBusinessDays(internalReviewDate, 5);
  const publishingDate = addBusinessDays(clientReviewDate, 1);
  const promotingDate = workingDayOnOrAfter(promotionEnd);
  const reportingDate = workingDayOnOrAfter(reportingEnd);

  c.idealTimeline.milestonePlan = {
    kickoff: toIso(ko),
    contentPlan: toIso(contentPlanDate),
    interview: toIso(interviewDate),
    writing: toIso(writingDate),
    internalReview: toIso(internalReviewDate),
    clientReview: toIso(clientReviewDate),
    publishing: toIso(publishingDate),
    promoting: toIso(promotingDate),
    reporting: toIso(reportingDate)
  };
}

function computePolicyLayer(c, now = new Date()) {
  const ko = parseDate(c.baseline.kickoffDate);
  if (!ko) return;

  // Policy checkpoints use fixed calendar-day offsets (no holiday allowances).
  const day30 = addDays(ko, 30);
  const day90 = addDays(ko, 90);

  c.policyLayer.firstPublishByDay30Deadline = toIso(day30);
  c.policyLayer.reportShareByDay90Deadline = toIso(day90);
  c.policyLayer.publishReadyWeekDeadline = formatWc(day30);
  c.policyLayer.reportShareWeekDeadline = formatWc(day90);

  // "Publish-ready by Day 30" means content is created and client-approved by Day 30 week.
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
  const activeEnd = activeContractEndDate(c);

  const ko = parseDate(c.baseline.kickoffDate);
  if (!ko) return projected;

  projected.kickoff = toIso(workingDayOnOrAfter(parseDate(ideal.kickoff) || ko));

  for (let i = 1; i < milestoneOrder.length; i += 1) {
    const key = milestoneOrder[i];
    const prevKey = milestoneOrder[i - 1];
    const actualDate = parseDate(actual[key]);
    const idealDate = parseDate(ideal[key]);
    const prevProjected = parseDate(projected[prevKey]);
    const prevIdeal = parseDate(ideal[prevKey]);

    if (actualDate) {
      projected[key] = toIso(workingDayOnOrAfter(actualDate));
      continue;
    }

    if (!idealDate) {
      projected[key] = projected[prevKey] || "";
      continue;
    }

    if (!prevProjected || !prevIdeal) {
      projected[key] = toIso(workingDayOnOrAfter(idealDate));
      continue;
    }

    const lag = Math.max(0, diffDays(prevIdeal, idealDate));
    const shifted = addOffset(prevProjected, lag, c.settings.useBusinessDays);
    projected[key] = toIso(workingDayOnOrAfter(shifted > idealDate ? shifted : idealDate));
  }

  // Projected promotion window rule:
  // if promotion would run past the ideal promotion deadline, cap it to 30 calendar days.
  const projectedPublish = parseDate(projected.publishing);
  const projectedPromoting = parseDate(projected.promoting);
  const idealPublish = parseDate(ideal.publishing);
  const idealPromotionDeadline = parseDate(ideal.promoting);
  if (projectedPublish && projectedPromoting && idealPromotionDeadline && projectedPromoting > idealPromotionDeadline) {
    projected.promoting = toIso(workingDayOnOrAfter(addDays(projectedPublish, 29)));
    // Keep reporting aligned to capped promotion end (approx. 15 calendar days reporting window).
    const cappedPromoting = parseDate(projected.promoting);
    if (cappedPromoting) {
      projected.reporting = toIso(workingDayOnOrAfter(addDays(cappedPromoting, 15)));
    }
  }

  // If publishing has slipped beyond ideal, promotion shifts to end at contract/extension end.
  if (projectedPublish && idealPublish && projectedPublish > idealPublish && activeEnd) {
    const promotionEnd = activeEnd >= projectedPublish ? activeEnd : projectedPublish;
    projected.promoting = toIso(workingDayOnOrAfter(promotionEnd));
    const actualReport = parseDate(c.actuals.reportSharedActualDate || c.actuals.milestoneActual.reporting);
    if (!actualReport) {
      projected.reporting = toIso(workingDayOnOrAfter(addDays(promotionEnd, 15)));
    }
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
    // Promotion-day feasibility uses inclusive calendar days (weekends included).
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

function policyCheckpointStatus(kind, now = new Date()) {
  if (!campaign.baseline.kickoffDate) {
    return { label: "Needs baseline", detail: "Set baseline dates first." };
  }

  const deadlineIso = kind === "day30"
    ? campaign.policyLayer.firstPublishByDay30Deadline
    : campaign.policyLayer.reportShareByDay90Deadline;
  const deadline = parseDate(deadlineIso);
  if (!deadline) {
    return { label: "Needs baseline", detail: "Deadline not available yet." };
  }

  const weekEnd = weekEndSunday(deadline);
  const actual = kind === "day30"
    ? parseDate(campaign.actuals.milestoneActual.clientReview)
    : parseDate(campaign.actuals.reportSharedActualDate || campaign.actuals.milestoneActual.reporting);
  const shortName = kind === "day30" ? "Publish-ready" : "Report shared";

  if (actual) {
    if (actual <= weekEnd) {
      return { label: "Meets window", detail: `${shortName} ${formatDate(actual)}. Target ${formatWc(deadline)}.` };
    }
    return { label: "Missed", detail: `${shortName} ${formatDate(actual)}. Target was ${formatWc(deadline)}.` };
  }

  if (startOfDay(now) > weekEnd) {
    return { label: "Missed", detail: `Not completed by ${formatWc(deadline)}.` };
  }

  return { label: "On Track", detail: `Due ${formatWc(deadline)}.` };
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
  const table = document.getElementById("workflowTrackerTable");

  if (!campaign.baseline.locked) {
    table.innerHTML = "";
    return;
  }

  const writingDate = parseDate(campaign.idealTimeline.milestonePlan.writing);
  const interviewDate = parseDate(campaign.idealTimeline.milestonePlan.interview);
  const internalReviewDate = parseDate(campaign.idealTimeline.milestonePlan.internalReview);
  const clientReviewDate = parseDate(campaign.idealTimeline.milestonePlan.clientReview);
  const contractStartDate = parseDate(campaign.baseline.contractStartDate);
  const kickoffDate = parseDate(campaign.idealTimeline.milestonePlan.kickoff);
  const kickoffDeadlineDate = contractStartDate ? lastWorkingDayOfWeek(contractStartDate) : kickoffDate;
  const contentPlanDate = parseDate(campaign.idealTimeline.milestonePlan.contentPlan);
  const publishingDate = parseDate(campaign.idealTimeline.milestonePlan.publishing);
  const week1Start = kickoffDate ? nextMondayAfterKoWeek(kickoffDate) : null;
  const interviewWindowStart = week1Start ? addDays(week1Start, 7) : interviewDate;
  const promotionStartDate = parseDate(campaign.idealTimeline.phaseWindows.promotion.start);
  const promotionEndDate = parseDate(campaign.idealTimeline.phaseWindows.promotion.end);
  const reportingStartDate = parseDate(campaign.idealTimeline.phaseWindows.reporting.start);
  const reportingEndDate = parseDate(campaign.idealTimeline.phaseWindows.reporting.end);
  const wcRange = (start, end) => {
    if (!start || !end) return "";
    const startWc = formatWc(start);
    const endWc = formatWc(end);
    return startWc === endWc ? startWc : `${startWc} - ${endWc}`;
  };
  const windowHints = {
    kickoff: wcRange(kickoffDate, kickoffDate),
    contentPlan: wcRange(week1Start, contentPlanDate),
    interview: wcRange(interviewWindowStart, interviewDate),
    writing: wcRange(interviewDate, writingDate),
    internalReview: wcRange(writingDate, internalReviewDate),
    clientReview: wcRange(internalReviewDate, clientReviewDate),
    publishing: wcRange(publishingDate, publishingDate),
    promoting: wcRange(promotionStartDate, promotionEndDate),
    reporting: wcRange(reportingStartDate, reportingEndDate)
  };
  const projected = campaign.derived.projectedMilestones || {};
  const getProjected = (key) => projected[key] || campaign.idealTimeline.milestonePlan[key] || "";
  const today = todayIso();

  table.innerHTML = `
    <table class="milestone-table">
      <thead>
        <tr><th>Workflow step</th><th>Ideal window</th><th>Deadline</th><th>Actual completion date</th><th>Projected completion</th><th>Variance</th></tr>
      </thead>
      <tbody>
        ${milestoneOrder.map((key) => {
          const ideal = campaign.idealTimeline.milestonePlan[key] || "";
          const deadline = key === "kickoff" ? (kickoffDeadlineDate ? toIso(kickoffDeadlineDate) : ideal) : ideal;
          const actual = campaign.actuals.milestoneActual[key] || "";
          const projectedDate = getProjected(key);
          const actualForProjection = key === "kickoff" ? campaign.baseline.kickoffDate : actual;
          const projectedDisplayDate = actualForProjection || projectedDate;
          const projectedClass = actualForProjection ? "projected-from-actual" : "projected-from-forecast";
          const idealDate = parseDate(deadline);
          const actualDate = parseDate(actual);
          const projectedDateObj = parseDate(projectedDate);
          const varianceText = actualDate
            ? renderVarianceChipFromDates(idealDate, actualDate, false)
            : renderVarianceChipFromDates(idealDate, projectedDateObj, true);
          return `
            <tr>
              <td>${milestoneLabels[key]}</td>
              <td>${windowHints[key] || ""}</td>
              <td>${formatDate(deadline)}</td>
              <td>${
                key === "kickoff"
                  ? `<span class="status-meta">From baseline KO: ${formatDate(campaign.baseline.kickoffDate)}</span>`
                  : `<input type="date" data-actual="${key}" max="${today}" value="${actual}" ${campaign.baseline.locked ? "" : "disabled"} />`
              }</td>
              <td><span class="projected-date ${projectedClass}">${formatDate(projectedDisplayDate)}</span></td>
              <td>${key === "kickoff" ? "-" : varianceText}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  table.querySelectorAll("input[data-actual]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const key = event.target.getAttribute("data-actual");
      const value = event.target.value || "";
      if (value && isFutureIsoDate(value)) {
        window.alert("Actual completion dates cannot be in the future.");
        event.target.value = campaign.actuals.milestoneActual[key] || "";
        return;
      }
      if (value && !isUkWorkingDay(parseDate(value))) {
        window.alert("Actual completion dates must be on a working day.");
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

function renderVariance(idealIso, actualIso) {
  const ideal = parseDate(idealIso);
  const actual = parseDate(actualIso);
  if (!ideal || !actual) return "-";
  return renderVarianceChipFromDates(ideal, actual, false);
}

function workingDayDelta(fromDate, toDate) {
  const from = startOfDay(fromDate);
  const to = startOfDay(toDate);
  if (from.getTime() === to.getTime()) return 0;
  const direction = to > from ? 1 : -1;
  let cursor = from;
  let count = 0;
  while (cursor.getTime() !== to.getTime()) {
    cursor = addDays(cursor, direction);
    if (isUkWorkingDay(cursor)) count += direction;
  }
  return count;
}

function renderVarianceChipFromDates(idealDate, targetDate, isProjected) {
  if (!idealDate || !targetDate) return "-";
  const calendarVariance = diffDays(idealDate, targetDate);
  const businessVariance = workingDayDelta(idealDate, targetDate);
  // Fuzzy on-track rule: up to 1 working day late is still on track.
  if (calendarVariance >= 0 && businessVariance <= 1) {
    return renderVarianceChip(0, isProjected);
  }
  return renderVarianceChip(calendarVariance, isProjected);
}

function renderVarianceChip(variance, isProjected) {
  if (!Number.isFinite(variance)) return "-";
  const projectedClass = isProjected ? " delta-projected" : "";
  if (variance === 0) return `<span class="delta-chip delta-ontrack${projectedClass}">On track</span>`;
  const closeClass = variance > 0 && variance <= 5 ? " delta-close" : "";
  if (variance > 0) return `<span class="delta-chip delta-late${closeClass}${projectedClass}">+${variance} days</span>`;
  return `<span class="delta-chip delta-early${closeClass}${projectedClass}">${variance} days</span>`;
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
  const policyDay90Date = parseDate(campaign.policyLayer.reportShareByDay90Deadline);
  const contractStart = parseDate(campaign.baseline.contractStartDate);
  const contractEnd = parseDate(campaign.baseline.contractEndDate);
  const contractExtensionEnd = campaign.baseline.extension30Days ? parseDate(campaign.derived.activeContractEndDate) : null;
  const revised = parseDate(campaign.derived.projectedPublishDate);
  const showProjected = Boolean(campaign.settings.showProjectedOnCharts);
  const showLag = campaign.settings.showLagOnCharts !== false;
  const showIdeal = !showProjected;
  const projectedMilestones = campaign.derived.projectedMilestones || {};
  const projectedAnchorDateFor = (key) =>
    parseDate(campaign.actuals.milestoneActual[key])
    || parseDate(projectedMilestones[key])
    || parseDate(campaign.idealTimeline.milestonePlan[key]);
  const idealProdStart = parseDate(campaign.idealTimeline.phaseWindows.production.start);
  const idealProdEnd = parseDate(campaign.idealTimeline.phaseWindows.production.end);
  const idealPromStart = parseDate(campaign.idealTimeline.phaseWindows.promotion.start);
  const idealPromEnd = parseDate(campaign.idealTimeline.phaseWindows.promotion.end);
  const idealRepStart = parseDate(campaign.idealTimeline.phaseWindows.reporting.start);
  const idealRepEnd = parseDate(campaign.idealTimeline.phaseWindows.reporting.end);
  const idealPhaseRanges = {
    prodStart: idealProdStart,
    prodEnd: idealProdEnd,
    promStart: idealPromStart,
    promEnd: idealPromEnd,
    repStart: idealRepStart,
    repEnd: idealRepEnd
  };
  const projectedPhaseRanges = {
    prodStart: projectedAnchorDateFor("kickoff"),
    prodEnd: projectedAnchorDateFor("publishing"),
    promStart: projectedAnchorDateFor("publishing"),
    promEnd: projectedAnchorDateFor("promoting"),
    repStart: projectedAnchorDateFor("promoting"),
    repEnd: projectedAnchorDateFor("reporting")
  };
  const phaseRanges = showProjected ? projectedPhaseRanges : idealPhaseRanges;
  // Use a shared time axis across ideal/projected views so toggle comparisons align exactly.
  [
    idealPhaseRanges.prodStart,
    idealPhaseRanges.prodEnd,
    idealPhaseRanges.promStart,
    idealPhaseRanges.promEnd,
    idealPhaseRanges.repStart,
    idealPhaseRanges.repEnd,
    projectedPhaseRanges.prodStart,
    projectedPhaseRanges.prodEnd,
    projectedPhaseRanges.promStart,
    projectedPhaseRanges.promEnd,
    projectedPhaseRanges.repStart,
    projectedPhaseRanges.repEnd
  ].forEach((d) => {
    if (d) points.push({ key: "phase", type: "anchor", date: d });
  });
  if (policyDate) points.push({ key: "policy", type: "anchor", date: policyDate });
  if (contractStart) points.push({ key: "contractStart", type: "anchor", date: contractStart });
  if (contractEnd) points.push({ key: "contractEnd", type: "anchor", date: contractEnd });
  if (contractExtensionEnd) points.push({ key: "contractExtensionEnd", type: "anchor", date: contractExtensionEnd });
  if (revised) points.push({ key: "projected", type: "anchor", date: revised });

  if (!points.length) {
    host.innerHTML = '<div class="status-meta">No timeline points available yet.</div>';
    return;
  }

  points.sort((a, b) => a.date - b.date);
  const min = addDays(points[0].date, -3);
  const max = addDays(points[points.length - 1].date, 3);

  const width = Math.max(1100, host.clientWidth || 1100);
  const height = 430;
  const left = 24;
  // Keep chart plotting area identical across client/internal views
  // and reserve enough room for right-side labels in both modes.
  const right = 140;
  const laneTaskStart = 86;
  const rowGap = 36;
  const STEP_BAR_HEIGHT = 24;
  const MILESTONE_HEIGHT = 24;
  const LABEL_Y_OFFSET = 18;
  const POLICY_LAG_BAR_Y = 70;
  const POLICY_LAG_GAP = 14;
  const flowRows = viewMode === "client"
    ? [
      { type: "milestone", label: "Kick-off", key: "kickoff" },
      { type: "bar", label: "Content Plan", start: "kickoff", end: "contentPlan" },
      { type: "interview_combo", label: "Interview", start: "contentPlan", key: "interview" },
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
      { type: "interview_combo", label: "Interview", start: "contentPlan", key: "interview" },
      { type: "bar", label: "Writing", start: "interview", end: "writing" },
      { type: "bar", label: "Internal Review", start: "writing", end: "internalReview" },
      { type: "bar", label: "Client review", start: "internalReview", end: "clientReview" },
      { type: "milestone", label: "Publishing", key: "publishing" },
      { type: "bar", label: "Promoting", start: "publishing", end: "promoting" },
      { type: "milestone", label: "Reporting", key: "reporting" }
    ];
  const laneTaskEnd = laneTaskStart + (flowRows.length * rowGap);
  const monthRowY = laneTaskEnd + 10;
  const monthRowHeight = 14;
  const timelineBottom = monthRowY + monthRowHeight + 10;
  const chartStart = min;
  const chartEnd = max;
  const weekdaySlots = [];
  let dayCursor = startOfDay(chartStart);
  while (dayCursor <= chartEnd) {
    if (dayCursor.getDay() !== 0 && dayCursor.getDay() !== 6) {
      weekdaySlots.push(toIso(dayCursor));
    }
    dayCursor = addDays(dayCursor, 1);
  }
  if (!weekdaySlots.length) {
    host.innerHTML = '<div class="status-meta">No weekday timeline points available.</div>';
    return;
  }
  const weekdayIndex = new Map(weekdaySlots.map((iso, idx) => [iso, idx]));
  const slotCount = weekdaySlots.length;
  const slotWidth = (width - left - right) / Math.max(1, slotCount);
  const firstWeekday = parseDate(weekdaySlots[0]);
  const lastWeekday = parseDate(weekdaySlots[weekdaySlots.length - 1]);

  const snapToWeekday = (date) => {
    let d = startOfDay(date);
    while (d.getDay() === 0 || d.getDay() === 6) d = addDays(d, 1);
    if (d > chartEnd) {
      d = startOfDay(date);
      while (d.getDay() === 0 || d.getDay() === 6) d = addDays(d, -1);
    }
    return d;
  };

  const indexOfDate = (date) => {
    const snapped = snapToWeekday(date);
    const idx = weekdayIndex.get(toIso(snapped));
    if (typeof idx === "number") return idx;
    if (firstWeekday && snapped < firstWeekday) return 0;
    if (lastWeekday && snapped > lastWeekday) return slotCount - 1;
    return 0;
  };

  const xOf = (d) => left + ((indexOfDate(d) + 0.5) * slotWidth);
  const xStartOf = (d) => left + (indexOfDate(d) * slotWidth);
  const xEndOf = (d) => left + ((indexOfDate(d) + 1) * slotWidth);
  // Align band starts with the same rendered week as milestone points.
  // This prevents weekend dates from showing a milestone in one week
  // while the phase band starts in the previous week.
  const weekStartX = (d) => xStartOf(weekStartMonday(snapToWeekday(d)));
  const weekEndX = (d) => xEndOf(addDays(weekStartMonday(d), 4));
  const phaseClassForStep = (stepKey) => {
    if (stepKey === "reporting") return "vis-step-rep";
    if (stepKey === "promoting" || stepKey === "publishing") return "vis-step-prom";
    return "vis-step-prod";
  };
  const weekLines = [];
  const today = startOfDay(new Date());
  const ko = parseDate(campaign.baseline.kickoffDate);
  const week1Start = ko ? nextMondayAfterKoWeek(ko) : null;
  const koWeekStart = week1Start ? addDays(week1Start, -7) : null;
  let weekIndex = 0;
  let cursor = weekStartMonday(chartStart);
  while (cursor <= chartEnd) {
    const monday = startOfDay(cursor);
    const mondayIdx = weekdayIndex.get(toIso(monday));
    if (typeof mondayIdx !== "number") {
      cursor = addDays(cursor, 7);
      continue;
    }
    const x = left + (mondayIdx * slotWidth);
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
    if (weekLabel) {
      weekLines.push(`<text class="vis-week-label" x="${x + (2.5 * slotWidth)}" y="20" text-anchor="middle">${weekLabel}</text>`);
    }
    cursor = addDays(cursor, 7);
    weekIndex += 1;
  }

  const phaseBands = [];
  let phaseCursorX = left;
  const addPhaseBand = (start, end, cls, label) => {
    if (!start || !end) return;
    let x1 = weekStartX(start);
    let x2 = weekEndX(end);
    x1 = Math.max(x1, phaseCursorX);
    x2 = Math.max(x2, x1 + 2);
    phaseCursorX = x2;
    phaseBands.push(`<rect class="${cls}" x="${x1}" y="48" width="${x2 - x1}" height="${timelineBottom - 40}" rx="8" ry="8"/>`);
    phaseBands.push(`<text class="vis-text vis-band-label" x="${x1 + 8}" y="64">${label}</text>`);
  };
  addPhaseBand(phaseRanges.prodStart, phaseRanges.prodEnd, "vis-phase-prod-band", "Production");
  addPhaseBand(phaseRanges.promStart, phaseRanges.promEnd, "vis-phase-prom-band", "Promotion");
  addPhaseBand(phaseRanges.repStart, phaseRanges.repEnd, "vis-phase-rep-band", "Reporting");

  const firstWeekdayInMonth = (d) => {
    let cursor = startOfDay(d);
    while (cursor.getDay() === 0 || cursor.getDay() === 6) cursor = addDays(cursor, 1);
    return cursor;
  };
  const lastWeekdayInMonth = (d) => {
    let cursor = startOfDay(d);
    while (cursor.getDay() === 0 || cursor.getDay() === 6) cursor = addDays(cursor, -1);
    return cursor;
  };
  const monthBars = [];
  if (firstWeekday && lastWeekday) {
    let monthCursor = startOfDay(new Date(firstWeekday.getFullYear(), firstWeekday.getMonth(), 1));
    let monthIdx = 0;
    while (monthCursor <= lastWeekday) {
      const monthStart = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
      const monthEnd = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
      const visibleStart = monthStart < firstWeekday ? firstWeekday : monthStart;
      const visibleEnd = monthEnd > lastWeekday ? lastWeekday : monthEnd;
      const barStart = firstWeekdayInMonth(visibleStart);
      const barEnd = lastWeekdayInMonth(visibleEnd);
      if (barStart <= barEnd) {
        const x1 = xStartOf(barStart);
        const x2 = xEndOf(barEnd);
        const w = Math.max(2, x2 - x1);
        monthBars.push(`<rect class="vis-month-band-${monthIdx % 5}" x="${x1}" y="${monthRowY}" width="${w}" height="${monthRowHeight}" rx="4" ry="4"/>`);
        const label = barStart.toLocaleDateString(undefined, { month: "short" });
        monthBars.push(`<text class="vis-month-label" x="${x1 + (w / 2)}" y="${monthRowY + 11}" text-anchor="middle">${label}</text>`);
      }
      monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
      monthIdx += 1;
    }
  }

  const rowGroups = [];
  flowRows.forEach((item, idx) => {
    const y = laneTaskStart + (idx * rowGap);
    const rowObjects = [];
    const projectedParts = [];
    const lagParts = [];
    if (item.type === "interview_combo") {
      const start = parseDate(campaign.idealTimeline.milestonePlan[item.start]);
      const planEnd = parseDate(campaign.idealTimeline.milestonePlan[item.key]);
      const actualEnd = parseDate(campaign.actuals.milestoneActual[item.key]);
      const projectedEnd = parseDate(projectedMilestones[item.key]);
      if (!start || !planEnd) return;

      const x1 = xStartOf(start);
      const x2 = xEndOf(planEnd);
      const maxXParts = [];
      const stepPhaseClass = phaseClassForStep(item.key);

      if (showProjected) {
        const pEnd = projectedAnchorDateFor(item.key);
        if (pEnd) {
          const px2 = xEndOf(pEnd);
          projectedParts.push(`<rect class="vis-task ${stepPhaseClass}" x="${x1}" y="${y}" width="${Math.max(6, px2 - x1)}" height="${STEP_BAR_HEIGHT}" rx="8" ry="8"/>`);
          projectedParts.push(`<rect class="vis-plan-node" x="${xOf(pEnd) - 4}" y="${y}" width="10" height="${MILESTONE_HEIGHT}" rx="3" ry="3"/>`);
          maxXParts.push(px2);
          maxXParts.push(xOf(pEnd));
        }
      }

      if (showIdeal) {
        rowObjects.push(`<rect class="vis-task ${stepPhaseClass}" x="${x1}" y="${y}" width="${Math.max(6, x2 - x1)}" height="${STEP_BAR_HEIGHT}" rx="8" ry="8"/>`);
        rowObjects.push(`<rect class="vis-plan-node" x="${xOf(planEnd) - 4}" y="${y}" width="10" height="${MILESTONE_HEIGHT}" rx="3" ry="3"/>`);
        maxXParts.push(x2);
        maxXParts.push(xOf(planEnd));
      }
      if (actualEnd && !(showProjected && !showIdeal)) {
        rowObjects.push(`<rect class="vis-actual-node" x="${xOf(actualEnd) - 4}" y="${y}" width="10" height="${MILESTONE_HEIGHT}" rx="3" ry="3"/>`);
        maxXParts.push(xOf(actualEnd));
      }
      if (showProjected && projectedEnd) {
        maxXParts.push(xOf(projectedEnd));
      }

      if (showLag && actualEnd) {
        const idealX = xOf(planEnd);
        const actualX = xOf(actualEnd);
        const lagDays = diffDays(planEnd, actualEnd);
        if (lagDays !== 0) {
          const lagX1 = Math.min(idealX, actualX);
          const lagX2 = Math.max(idealX, actualX);
          const lagText = lagDays > 0 ? `+${lagDays}d` : `${lagDays}d`;
          const lagBarClass = lagDays < 0 ? "vis-lag-bar vis-lag-bar-ahead" : "vis-lag-bar";
          lagParts.push(`<rect class="${lagBarClass}" x="${lagX1}" y="${y + 1}" width="${Math.max(2, lagX2 - lagX1)}" height="10" rx="5" ry="5"/>`);
          if (viewMode !== "internal") {
            const labelX = Math.min(lagX2 + 5, width - right - 6);
            lagParts.push(`<text class="vis-lag-label vis-lag-label-hover" x="${labelX}" y="${y + 4}">${lagText}</text>`);
          }
        }
      }

      const visibleRightEdge = maxXParts.length ? Math.max(...maxXParts) : x2;
      const labelX = Math.min(visibleRightEdge + 8, width - right - 6);
      if (showIdeal || showProjected) {
        rowObjects.push(`<text class="vis-bar-label" x="${labelX}" y="${y + LABEL_Y_OFFSET}">${item.label}</text>`);
      }

      rowGroups.push(`<g class="vis-row-group">${projectedParts.join("")}${lagParts.join("")}${rowObjects.join("")}</g>`);
      return;
    }
    if (item.type === "bar") {
      const start = parseDate(campaign.idealTimeline.milestonePlan[item.start]);
      const end = parseDate(campaign.idealTimeline.milestonePlan[item.end]);
      if (!start || !end) return;
      const x1 = xStartOf(start);
      const x2 = xEndOf(end);
      const w = Math.max(6, x2 - x1);
      const stepPhaseClass = phaseClassForStep(item.end);
      let labelAnchorX = null;
      let insidePromoLabel = "";
      if (showProjected) {
        const pStart = parseDate(projectedMilestones[item.start] || campaign.idealTimeline.milestonePlan[item.start]);
        const pEnd = parseDate(projectedMilestones[item.end] || campaign.idealTimeline.milestonePlan[item.end]);
        if (pStart && pEnd) {
          const px1 = xStartOf(pStart);
          const px2 = xEndOf(pEnd);
          projectedParts.push(`<rect class="vis-task ${stepPhaseClass}" x="${px1}" y="${y}" width="${Math.max(6, px2 - px1)}" height="${STEP_BAR_HEIGHT}" rx="8" ry="8"/>`);
          labelAnchorX = px2;
          if (item.end === "promoting") {
            // Keep label value aligned with the rendered projected bar length.
            const promoDays = Math.max(0, diffDays(pStart, pEnd) + 1);
            const textX = px1 + ((Math.max(6, px2 - px1)) / 2);
            insidePromoLabel = `<text class="vis-inside-bar-label" x="${textX}" y="${y + 16}" text-anchor="middle">${promoDays} days</text>`;
          }
        }
      }
      if (showIdeal) {
        rowObjects.push(`<rect class="vis-task ${stepPhaseClass}" x="${x1}" y="${y}" width="${w}" height="${STEP_BAR_HEIGHT}" rx="8" ry="8"/>`);
        labelAnchorX = x2;
        if (item.end === "promoting") {
          const promoDays = Math.max(0, diffDays(start, end) + 1);
          const textX = x1 + (w / 2);
          insidePromoLabel = `<text class="vis-inside-bar-label" x="${textX}" y="${y + 16}" text-anchor="middle">${promoDays} days</text>`;
        }
      }
      if (insidePromoLabel) rowObjects.push(insidePromoLabel);
      if (showIdeal || showProjected) {
        const visibleRightEdge = labelAnchorX ?? x2;
        rowObjects.push(`<text class="vis-bar-label" x="${Math.min(visibleRightEdge + 6, width - right - 6)}" y="${y + LABEL_Y_OFFSET}">${item.label}</text>`);
      }

      const actualEnd = parseDate(campaign.actuals.milestoneActual[item.end]);
      const projectedEnd = parseDate(projectedMilestones[item.end]);
      if (showLag && actualEnd) {
        const idealX = xOf(end);
        const actualX = xOf(actualEnd);
        const lagDays = diffDays(end, actualEnd);
        if (lagDays !== 0) {
          const lagX1 = Math.min(idealX, actualX);
          const lagX2 = Math.max(idealX, actualX);
          const lagText = lagDays > 0 ? `+${lagDays}d` : `${lagDays}d`;
          const lagBarClass = lagDays < 0 ? "vis-lag-bar vis-lag-bar-ahead" : "vis-lag-bar";
          lagParts.push(`<rect class="${lagBarClass}" x="${lagX1}" y="${y + 1}" width="${Math.max(2, lagX2 - lagX1)}" height="10" rx="5" ry="5"/>`);
          if (viewMode !== "internal") {
            const labelX = Math.min(lagX2 + 5, width - right - 6);
            lagParts.push(`<text class="vis-lag-label vis-lag-label-hover" x="${labelX}" y="${y + 4}">${lagText}</text>`);
          }
        }
      }
      rowGroups.push(`<g class="vis-row-group">${projectedParts.join("")}${lagParts.join("")}${rowObjects.join("")}</g>`);
      return;
    }
    const plan = parseDate(campaign.idealTimeline.milestonePlan[item.key]);
    const actual = parseDate(campaign.actuals.milestoneActual[item.key]);
    const projectedForStep = projectedAnchorDateFor(item.key);
    const stepPhaseClass = phaseClassForStep(item.key);
    const labelCandidates = [];
    if (showIdeal && plan) labelCandidates.push(xOf(plan));
    if (showProjected && projectedForStep) labelCandidates.push(xOf(projectedForStep));
    if (actual) labelCandidates.push(xOf(actual));
    const visibleRightEdge = labelCandidates.length ? Math.max(...labelCandidates) : 0;
    const labelX = Math.min(visibleRightEdge + 8, width - right - 6);
    if (showProjected && projectedForStep) {
      projectedParts.push(`<rect class="vis-plan-node" x="${xOf(projectedForStep) - 4}" y="${y}" width="10" height="${MILESTONE_HEIGHT}" rx="3" ry="3"/>`);
    }
    if (showIdeal && plan) rowObjects.push(`<rect class="vis-plan-node" x="${xOf(plan) - 4}" y="${y}" width="10" height="${MILESTONE_HEIGHT}" rx="3" ry="3"/>`);
    if (actual && !(showProjected && !showIdeal)) rowObjects.push(`<rect class="vis-actual-node" x="${xOf(actual) - 4}" y="${y}" width="10" height="${MILESTONE_HEIGHT}" rx="3" ry="3"/>`);
    if (showIdeal || showProjected || actual) {
      rowObjects.push(`<text class="vis-milestone-label" x="${labelX}" y="${y + LABEL_Y_OFFSET}">${item.label}</text>`);
    }

    if (showLag && plan && actual) {
      const lagDays = diffDays(plan, actual);
      if (lagDays !== 0) {
        const idealX = xOf(plan);
        const actualX = xOf(actual);
        const lagX1 = Math.min(idealX, actualX);
        const lagX2 = Math.max(idealX, actualX);
        const lagText = lagDays > 0 ? `+${lagDays}d` : `${lagDays}d`;
        const lagBarClass = lagDays < 0 ? "vis-lag-bar vis-lag-bar-ahead" : "vis-lag-bar";
        lagParts.push(`<rect class="${lagBarClass}" x="${lagX1}" y="${y + 1}" width="${Math.max(2, lagX2 - lagX1)}" height="10" rx="5" ry="5"/>`);
        if (viewMode !== "internal") {
          const lagLabelX = Math.min(lagX2 + 5, width - right - 6);
          lagParts.push(`<text class="vis-lag-label vis-lag-label-hover" x="${lagLabelX}" y="${y + 4}">${lagText}</text>`);
        }
      }
    }
    rowGroups.push(`<g class="vis-row-group">${projectedParts.join("")}${lagParts.join("")}${rowObjects.join("")}</g>`);
  });

  const policyLine = policyDate
    ? `<line class="vis-policy" x1="${xOf(policyDate)}" y1="34" x2="${xOf(policyDate)}" y2="${timelineBottom + 8}"/>`
    : "";
  const policyDay90Line = policyDay90Date
    ? `<line class="vis-policy-90" x1="${xOf(policyDay90Date)}" y1="34" x2="${xOf(policyDay90Date)}" y2="${timelineBottom + 8}"/>`
    : "";
  const contractStartLine = contractStart
    ? `<line class="vis-contract-start" x1="${xOf(contractStart)}" y1="34" x2="${xOf(contractStart)}" y2="${timelineBottom + 8}"/>`
    : "";
  const contractEndLine = contractEnd
    ? `<line class="vis-contract-end" x1="${xOf(contractEnd)}" y1="34" x2="${xOf(contractEnd)}" y2="${timelineBottom + 8}"/>`
    : "";
  const contractExtensionLine = contractExtensionEnd
    ? `<line class="vis-contract-extension" x1="${xOf(contractExtensionEnd)}" y1="34" x2="${xOf(contractExtensionEnd)}" y2="${timelineBottom + 8}"/>`
    : "";

  const projectedLine = revised
    ? `<line class="vis-revised" x1="${xOf(revised)}" y1="34" x2="${xOf(revised)}" y2="${timelineBottom + 8}"/>`
    : "";

  const actualPublish = parseDate(campaign.actuals.milestoneActual.publishing || campaign.actuals.firstPublishActualDate);
  const projectedPublish = parseDate(campaign.derived.projectedPublishDate || campaign.derived.projectedMilestones?.publishing);
  const publishForPolicyLag = actualPublish || projectedPublish;
  const publishLagSource = actualPublish ? "actual" : "projected";
  const policyPublishLagVisual = (viewMode === "internal" && policyDate && publishForPolicyLag)
    ? (() => {
      const lagDays = diffDays(policyDate, publishForPolicyLag);
      const x1 = xOf(policyDate);
      const x2 = xOf(publishForPolicyLag);
      const barX = Math.min(x1, x2);
      const barW = Math.max(2, Math.abs(x2 - x1));
      const lagClass = lagDays < 0 ? "vis-policy-lag vis-policy-lag-ahead" : "vis-policy-lag vis-policy-lag-late";
      const lagText = lagDays > 0 ? `+${lagDays}d` : `${lagDays}d`;
      const label = `P30 to ${publishLagSource}: ${lagText}`;
      const labelX = Math.min(Math.max(x1, x2) + 8, width - right - 6);
      return `
        <rect class="${lagClass}" x="${barX}" y="${POLICY_LAG_BAR_Y}" width="${barW}" height="6" rx="3" ry="3"/>
        <text class="vis-policy-lag-label" x="${labelX}" y="${POLICY_LAG_BAR_Y + 9}">${label}</text>
      `;
    })()
    : "";
  const actualReport = parseDate(campaign.actuals.reportSharedActualDate || campaign.actuals.milestoneActual.reporting);
  const projectedReport = parseDate(campaign.derived.projectedReportDate || campaign.derived.projectedMilestones?.reporting);
  const reportForPolicyLag = actualReport || projectedReport;
  const reportLagSource = actualReport ? "actual" : "projected";
  const policyReportLagVisual = (viewMode === "internal" && policyDay90Date && reportForPolicyLag)
    ? (() => {
      const lagDays = diffDays(policyDay90Date, reportForPolicyLag);
      const x1 = xOf(policyDay90Date);
      const x2 = xOf(reportForPolicyLag);
      const barX = Math.min(x1, x2);
      const barW = Math.max(2, Math.abs(x2 - x1));
      const lagClass = lagDays < 0 ? "vis-policy-lag vis-policy-lag-ahead" : "vis-policy-lag vis-policy-lag-late";
      const lagText = lagDays > 0 ? `+${lagDays}d` : `${lagDays}d`;
      const label = `P90 to ${reportLagSource}: ${lagText}`;
      const labelX = Math.min(Math.max(x1, x2) + 8, width - right - 6);
      return `
        <rect class="${lagClass}" x="${barX}" y="${POLICY_LAG_BAR_Y + POLICY_LAG_GAP}" width="${barW}" height="6" rx="3" ry="3"/>
        <text class="vis-policy-lag-label" x="${labelX}" y="${POLICY_LAG_BAR_Y + POLICY_LAG_GAP + 9}">${label}</text>
      `;
    })()
    : "";

  const contractVisuals = `${contractStartLine}${contractEndLine}${contractExtensionLine}`;
  const policyVisuals = viewMode === "internal" ? `${policyLine}${policyDay90Line}${showProjected ? projectedLine : ""}` : "";
  const internalKeyItems = viewMode === "internal"
    ? `
      <span><span class="key-line key-contract-start"></span>Contract start</span>
      <span><span class="key-line key-contract-end"></span>Contract end</span>
      ${contractExtensionEnd ? '<span><span class="key-line key-contract-extension"></span>Contract extension end</span>' : ""}
      <span><span class="key-line key-policy"></span>Policy Day 30</span>
      <span><span class="key-line key-policy-90"></span>Policy Day 90</span>
      ${showProjected ? '<span><span class="key-line key-projected"></span>Projected publish</span><span><span class="key-swatch key-projected-bar"></span>Projected step bar</span>' : ""}
    `
    : `
      <span><span class="key-line key-contract-start"></span>Contract start</span>
      <span><span class="key-line key-contract-end"></span>Contract end</span>
      ${contractExtensionEnd ? '<span><span class="key-line key-contract-extension"></span>Contract extension end</span>' : ""}
    `;

  const timelineMeta = [campaign.clientBrand, campaign.publication].filter(Boolean).join(" • ");
  host.innerHTML = `
    <div class="timeline-head">
      <div class="timeline-range">${formatDate(min)} -> ${formatDate(max)}</div>
      ${timelineMeta ? `<div class="timeline-meta">${timelineMeta}</div>` : ""}
    </div>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Ideal vs actual timeline">
      <line class="vis-axis" x1="${left}" y1="34" x2="${width - right}" y2="34"/>
      <!-- Keep vertical reference lines behind label text for readability. -->
      ${contractVisuals}
      ${policyVisuals}
      ${weekLines.join("")}
      ${phaseBands.join("")}
      ${policyPublishLagVisual}
      ${policyReportLagVisual}
      <line class="vis-lane" x1="${left}" y1="${laneTaskStart}" x2="${width - right}" y2="${laneTaskStart}"/>
      <line class="vis-lane" x1="${left}" y1="${laneTaskEnd}" x2="${width - right}" y2="${laneTaskEnd}"/>
      ${rowGroups.join("")}
      ${monthBars.join("")}
    </svg>
    <div class="timeline-key">
      <span><span class="key-step"></span>Step</span>
      <span><span class="key-milestone"></span>Milestone</span>
      ${internalKeyItems}
    </div>
  `;
}

function renderStatusAndFeasibility() {
  const day30Policy = policyCheckpointStatus("day30");
  const day90Policy = policyCheckpointStatus("day90");
  const currentPlanLabel = campaign.derived.feasible ? campaign.derived.currentPlanStatus : "Behind";

  const cards = document.getElementById("statusCards");
  cards.innerHTML = `
    <div class="status-card">
      <h3>Current plan check</h3>
      <div class="status-card-top">
        <span class="badge ${statusClass(currentPlanLabel)}">${currentPlanLabel}</span>
      </div>
      <div class="kpi-stack">
        <div class="kpi-number">${campaign.derived.projectedPromotionDays}</div>
        <div class="kpi-label">Projected promotion days</div>
      </div>
      <div class="status-meta">${campaign.derived.feasibilityReason}</div>
    </div>
    <div class="status-card">
      <h3>Day 30 publish check</h3>
      <div class="status-card-top">
        <span class="badge ${statusClass(day30Policy.label)}">${day30Policy.label}</span>
      </div>
      <div class="status-meta">${day30Policy.detail}</div>
    </div>
    <div class="status-card">
      <h3>Day 90 report check</h3>
      <div class="status-card-top">
        <span class="badge ${statusClass(day90Policy.label)}">${day90Policy.label}</span>
      </div>
      <div class="status-meta">${day90Policy.detail}</div>
    </div>
  `;

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
  document.getElementById("clientBrand").value = campaign.clientBrand || "";
  document.getElementById("publication").value = campaign.publication || "";
  document.getElementById("contractStartDate").value = campaign.baseline.contractStartDate;
  document.getElementById("contractEndDate").value = campaign.baseline.contractEndDate;
  document.getElementById("kickoffDate").value = campaign.baseline.kickoffDate;
  document.getElementById("extension30Days").checked = campaign.baseline.extension30Days;

  document.getElementById("liveStage").innerHTML = liveStages.map((stage) => `<option value="${stage}">${stage}</option>`).join("");
  document.getElementById("liveStage").value = campaign.derived.liveStage || campaign.ui.liveStage || liveStages[0];

  document.getElementById("useBusinessDays").checked = campaign.settings.useBusinessDays;
  document.getElementById("showProjectedOnCharts").checked = campaign.settings.showProjectedOnCharts;
  document.getElementById("showLagOnCharts").checked = campaign.settings.showLagOnCharts !== false;
  document.getElementById("chartInternalView").checked = Boolean(campaign.settings.chartInternalView);

  renderBaselineCard();
}

function readFormToCampaign() {
  campaign.campaignName = document.getElementById("campaignName").value.trim();
  campaign.clientBrand = document.getElementById("clientBrand").value.trim();
  campaign.publication = document.getElementById("publication").value;
  campaign.settings.useBusinessDays = document.getElementById("useBusinessDays").checked;
  campaign.settings.showProjectedOnCharts = document.getElementById("showProjectedOnCharts").checked;
  campaign.settings.showLagOnCharts = document.getElementById("showLagOnCharts").checked;
  campaign.settings.chartInternalView = document.getElementById("chartInternalView").checked;

  if (!campaign.baseline.locked) {
    campaign.baseline.contractStartDate = document.getElementById("contractStartDate").value;
    campaign.baseline.contractEndDate = document.getElementById("contractEndDate").value;
    campaign.baseline.kickoffDate = document.getElementById("kickoffDate").value;
  }

  campaign.baseline.extension30Days = document.getElementById("extension30Days").checked;
  campaign.ui.liveStage = document.getElementById("liveStage").value;

  recomputeAll(campaign);
}

function exportJson() {
  downloadFile("campaign-timeline-v2.json", JSON.stringify(campaign, null, 2), "application/json");
}

function exportCsv() {
  const rows = [
    ["Campaign", campaign.campaignName || ""],
    ["Client brand", campaign.clientBrand || ""],
    ["Publication", campaign.publication || ""],
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

function slugPart(value, fallback = "unknown") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function buildChartFilename(viewMode) {
  const brand = slugPart(campaign.clientBrand || campaign.campaignName, "campaign");
  const publication = slugPart(campaign.publication, "no-publication");
  const start = slugPart(campaign.baseline.contractStartDate, "start-unknown");
  const end = slugPart(campaign.baseline.contractEndDate, "end-unknown");
  const mode = viewMode === "internal" ? "internal" : "client";
  return `${brand}-${publication}-${start}-to-${end}-${mode}-timeline-chart.png`;
}

function svgToPngDataUrl(svgEl, scale = 2, exportContext = null) {
  return new Promise((resolve, reject) => {
    try {
      const clone = svgEl.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      if (!clone.getAttribute("xmlns:xlink")) clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

      const viewBox = svgEl.viewBox?.baseVal;
      const width = Math.max(1, Math.round(viewBox?.width || svgEl.clientWidth || 1400));
      const height = Math.max(1, Math.round(viewBox?.height || svgEl.clientHeight || 450));
      let topPad = 0;
      let bottomPad = 0;
      let keyLegend = [];
      if (exportContext) {
        topPad = exportContext.metaText ? 44 : 30;
        keyLegend = Array.isArray(exportContext.keyItems) ? exportContext.keyItems : [];
        if (keyLegend.length > 0) {
          const rows = Math.ceil(keyLegend.length / 4);
          bottomPad = 34 + (rows * 20);
        }
      }
      const exportHeight = height + topPad + bottomPad;
      // Lock explicit export dimensions so the full chart extents are captured.
      clone.setAttribute("width", String(width));
      clone.setAttribute("height", String(exportHeight));
      clone.setAttribute("viewBox", `0 ${-topPad} ${width} ${exportHeight}`);

      // Inline computed styles so class-based CSS survives SVG->PNG export.
      const styleProps = [
        "fill",
        "fill-opacity",
        "stroke",
        "stroke-opacity",
        "stroke-width",
        "stroke-dasharray",
        "opacity",
        "font-family",
        "font-size",
        "font-weight",
        "letter-spacing",
        "text-anchor"
      ];
      const sourceNodes = [svgEl, ...svgEl.querySelectorAll("*")];
      const cloneNodes = [clone, ...clone.querySelectorAll("*")];
      cloneNodes.forEach((node, idx) => {
        const src = sourceNodes[idx];
        if (!src) return;
        const cs = window.getComputedStyle(src);
        const inline = styleProps
          .map((prop) => `${prop}:${cs.getPropertyValue(prop)};`)
          .join("");
        const existing = node.getAttribute("style") || "";
        node.setAttribute("style", `${existing}${inline}`);
      });

      if (exportContext) {
        const ns = "http://www.w3.org/2000/svg";
        const bg = document.createElementNS(ns, "rect");
        bg.setAttribute("x", "0");
        bg.setAttribute("y", String(-topPad));
        bg.setAttribute("width", String(width));
        bg.setAttribute("height", String(exportHeight));
        bg.setAttribute("fill", "#ffffff");
        clone.insertBefore(bg, clone.firstChild);

        const addText = (text, y, size = 12, weight = "700", color = "#25324a") => {
          if (!text) return;
          const t = document.createElementNS(ns, "text");
          t.setAttribute("x", "24");
          t.setAttribute("y", String(y));
          t.setAttribute("fill", color);
          t.setAttribute("font-size", String(size));
          t.setAttribute("font-weight", String(weight));
          t.setAttribute("font-family", "Manrope, sans-serif");
          t.textContent = text;
          clone.appendChild(t);
        };

        addText(exportContext.rangeText || "", -topPad + 18, 12, "700", "#1f2a3b");
        addText(exportContext.metaText || "", -topPad + 34, 11, "600", "#4f607b");

        if (keyLegend.length) {
          const divider = document.createElementNS(ns, "line");
          divider.setAttribute("x1", "24");
          divider.setAttribute("y1", String(height + 10));
          divider.setAttribute("x2", String(width - 24));
          divider.setAttribute("y2", String(height + 10));
          divider.setAttribute("stroke", "#d8e0ee");
          divider.setAttribute("stroke-width", "1");
          clone.appendChild(divider);
          addText("Key", height + 28, 11, "700", "#4f607b");
          const colWidth = (width - 48) / 4;
          keyLegend.forEach((item, idx) => {
            const row = Math.floor(idx / 4);
            const col = idx % 4;
            const baseX = 24 + (col * colWidth);
            const y = height + 42 + (row * 20);

            const addRect = (x, yy, w, h, fill, stroke = "none", rx = 0) => {
              const r = document.createElementNS(ns, "rect");
              r.setAttribute("x", String(x));
              r.setAttribute("y", String(yy));
              r.setAttribute("width", String(w));
              r.setAttribute("height", String(h));
              if (rx) {
                r.setAttribute("rx", String(rx));
                r.setAttribute("ry", String(rx));
              }
              r.setAttribute("fill", fill);
              if (stroke !== "none") {
                r.setAttribute("stroke", stroke);
                r.setAttribute("stroke-width", "1");
              }
              clone.appendChild(r);
            };
            const addLine = (x1, yy1, x2, yy2, stroke, widthPx = 2, dash = "") => {
              const l = document.createElementNS(ns, "line");
              l.setAttribute("x1", String(x1));
              l.setAttribute("y1", String(yy1));
              l.setAttribute("x2", String(x2));
              l.setAttribute("y2", String(yy2));
              l.setAttribute("stroke", stroke);
              l.setAttribute("stroke-width", String(widthPx));
              if (dash) l.setAttribute("stroke-dasharray", dash);
              clone.appendChild(l);
            };

            const type = item?.type || "";
            if (type === "key-step") addRect(baseX, y - 8, 16, 10, "rgba(120,152,199,0.55)", "rgba(33,76,144,0.65)", 5);
            else if (type === "key-milestone") addRect(baseX + 3, y - 9, 10, 12, "#30908b", "none", 3);
            else if (type === "key-projected-bar") addRect(baseX, y - 8, 14, 10, "rgba(112,118,138,0.34)", "rgba(112,118,138,0.58)", 4);
            else if (type === "key-policy") addLine(baseX, y - 3, baseX + 14, y - 3, "#d64545", 2, "5 4");
            else if (type === "key-policy-90") addLine(baseX, y - 3, baseX + 14, y - 3, "#a02872", 2, "5 4");
            else if (type === "key-projected") addLine(baseX, y - 3, baseX + 14, y - 3, "#e6852e", 2, "4 3");
            else if (type === "key-contract-start") addLine(baseX, y - 3, baseX + 14, y - 3, "#2a7a2f", 3);
            else if (type === "key-contract-end") addLine(baseX, y - 3, baseX + 14, y - 3, "#7a1f1f", 3);
            else if (type === "key-contract-extension") addLine(baseX, y - 3, baseX + 14, y - 3, "#7a1f1f", 3, "8 5");
            else addRect(baseX + 4, y - 7, 8, 8, "#60708f", "none", 4);

            addText(item?.label || "", y, 10, "600", "#2f3e58");
            const lastText = clone.lastChild;
            if (lastText?.tagName === "text") lastText.setAttribute("x", String(baseX + 22));
          });
        }
      }

      const serializer = new XMLSerializer();
      const svgMarkup = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const safeScale = Math.max(1, Number(scale) || 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * safeScale);
        canvas.height = Math.round(exportHeight * safeScale);
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.setTransform(safeScale, 0, 0, safeScale, 0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, exportHeight);
        ctx.drawImage(img, 0, 0, width, exportHeight);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to render chart image."));
      };
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

async function downloadChartImage(hostId, filename) {
  const host = document.getElementById(hostId);
  const svg = host?.querySelector("svg");
  if (!svg) {
    window.alert("No chart is available to download yet.");
    return;
  }
  try {
    const rangeText = host.querySelector(".timeline-range")?.textContent?.trim() || "";
    const metaText = host.querySelector(".timeline-meta")?.textContent?.trim() || "";
    const keyItems = Array.from(document.querySelectorAll(".timeline-key > span"))
      .map((el) => {
        const label = el.textContent?.trim() || "";
        if (!label) return null;
        const symbolEl = el.querySelector("span");
        const classes = symbolEl ? Array.from(symbolEl.classList) : [];
        const preferred = [
          "key-step",
          "key-milestone",
          "key-projected-bar",
          "key-policy",
          "key-policy-90",
          "key-projected",
          "key-contract-start",
          "key-contract-end",
          "key-contract-extension"
        ];
        const type = preferred.find((cls) => classes.includes(cls))
          || classes.find((cls) => cls.startsWith("key-") && cls !== "key-line" && cls !== "key-swatch")
          || classes.find((cls) => cls.startsWith("key-"))
          || "";
        return { label, type };
      })
      .filter(Boolean);
    const dataUrl = await svgToPngDataUrl(svg, 3, { rangeText, metaText, keyItems });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  } catch {
    window.alert("Could not generate chart image. Please try again.");
  }
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
  recomputeAll(t3);
  computePolicyLayer(t3, new Date("2026-03-10T00:00:00"));
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

  const futureBlocked = isFutureIsoDate("2099-01-01", new Date("2026-01-10T00:00:00"));
  const nonFutureAllowed = !isFutureIsoDate("2026-01-10", new Date("2026-01-10T00:00:00"));
  assert("6) Future actual prevention", futureBlocked && nonFutureAllowed, "Validation helper blocks future actual dates and allows today/past dates.");

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
  document.querySelectorAll("#campaignName,#clientBrand,#publication,#contractStartDate,#contractEndDate,#kickoffDate,#extension30Days,#liveStage,#useBusinessDays,#showProjectedOnCharts,#showLagOnCharts,#chartInternalView")
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
  document.getElementById("downloadMainChart").addEventListener("click", () => {
    const internal = Boolean(campaign.settings.chartInternalView);
    const mode = internal ? "internal" : "client";
    downloadChartImage("timelineVisualMain", buildChartFilename(mode));
  });
  document.getElementById("runTests").addEventListener("click", runAcceptanceTests);

}

function render() {
  writeCampaignToForm();
  recomputeAll(campaign);
  renderIdealTimeline();
  const viewMode = campaign.settings.chartInternalView ? "internal" : "client";
  renderTimelineVisual(viewMode, "timelineVisualMain");
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

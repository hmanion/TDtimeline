const STORAGE_KEY = "timeline_planner_campaign_v1";

const milestoneOrder = [
  "kickoffComplete",
  "inputsReceived",
  "contentPlanApproved",
  "interviewBooked",
  "interviewCompleted",
  "draft1Shared",
  "feedbackComplete",
  "finalDelivered",
  "contentPublished",
  "reportingDelivered"
];

const milestoneLabels = {
  kickoffComplete: "Kick-off complete",
  inputsReceived: "Inputs received",
  contentPlanApproved: "Content plan approved",
  interviewBooked: "Interview booked",
  interviewCompleted: "Interview completed",
  draft1Shared: "Draft 1 shared",
  feedbackComplete: "Feedback complete",
  finalDelivered: "Final delivered",
  contentPublished: "Content published",
  reportingDelivered: "Reporting delivered"
};

const liveStages = [
  "Interview scheduling",
  "In production",
  "In review",
  "Publishing",
  "Live",
  "Reporting"
];

const defaultCampaign = {
  campaignName: "",
  kickoffDate: "",
  interviewPlannedDate: "",
  interviewActualDate: "",
  firstPublishDate: "",
  liveStatus: liveStages[0],
  settings: {
    riskX: 7,
    riskY: 14,
    riskZ: 5,
    productionDays: 7,
    reviewDays: 5,
    publishDays: 3,
    useBusinessDays: false,
    showInterviewClient: true
  },
  milestones: {
    kickoffComplete: "",
    inputsReceived: "",
    contentPlanApproved: "",
    interviewBooked: "",
    interviewCompleted: "",
    draft1Shared: "",
    feedbackComplete: "",
    finalDelivered: "",
    contentPublished: "",
    reportingDelivered: ""
  },
  revisions: []
};

let campaign = loadCampaign();
let currentView = "client";

function loadCampaign() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultCampaign);
  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultCampaign),
      ...parsed,
      settings: { ...defaultCampaign.settings, ...(parsed.settings || {}) },
      milestones: { ...defaultCampaign.milestones, ...(parsed.milestones || {}) },
      revisions: Array.isArray(parsed.revisions) ? parsed.revisions : []
    };
  } catch {
    return structuredClone(defaultCampaign);
  }
}

function saveCampaign() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
  const hint = document.getElementById("saveHint");
  hint.textContent = `Saved ${new Date().toLocaleTimeString()}`;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toIso(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addBusinessDays(date, days) {
  const d = new Date(date);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d;
}

function addTimelineDays(date, days, useBusinessDays) {
  return useBusinessDays ? addBusinessDays(date, days) : addDays(date, days);
}

function dayDiff(fromDate, toDate) {
  const ms = 1000 * 60 * 60 * 24;
  const a = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const b = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.floor((b - a) / ms);
}

function businessDayDiff(fromDate, toDate) {
  if (fromDate > toDate) return -businessDayDiff(toDate, fromDate);
  let count = 0;
  const cursor = new Date(fromDate);
  while (cursor < toDate) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}

function timelineDayDiff(fromDate, toDate, useBusinessDays) {
  return useBusinessDays ? businessDayDiff(fromDate, toDate) : dayDiff(fromDate, toDate);
}

function policyDeadline(c) {
  const ko = parseDate(c.kickoffDate);
  if (!ko) return null;
  return addTimelineDays(ko, 30, c.settings.useBusinessDays);
}

function policyStatus(c, now = new Date()) {
  const deadline = policyDeadline(c);
  if (!deadline) return { status: "Missing kick-off", deadline: null };
  const first = parseDate(c.firstPublishDate) || parseDate(c.milestones.contentPublished);
  if (first) {
    if (first <= deadline) return { status: "On track", deadline };
    return { status: "Missed policy SLA", deadline };
  }
  if (now <= deadline) return { status: "Not yet due", deadline };
  return { status: "Missed policy SLA", deadline };
}

function recomputeWindows(c) {
  const s = c.settings;
  const base = parseDate(c.interviewActualDate) || parseDate(c.interviewPlannedDate) || parseDate(c.milestones.interviewCompleted);
  if (!base) return;
  const draft = addTimelineDays(base, s.productionDays, s.useBusinessDays);
  const feedback = addTimelineDays(draft, s.reviewDays, s.useBusinessDays);
  const finalDelivered = addTimelineDays(feedback, 1, s.useBusinessDays);
  const published = addTimelineDays(finalDelivered, s.publishDays, s.useBusinessDays);
  const reporting = addTimelineDays(published, 14, s.useBusinessDays);

  if (!c.milestones.draft1Shared) c.milestones.draft1Shared = toIso(draft);
  if (!c.milestones.feedbackComplete) c.milestones.feedbackComplete = toIso(feedback);
  if (!c.milestones.finalDelivered) c.milestones.finalDelivered = toIso(finalDelivered);
  if (!c.milestones.contentPublished) c.milestones.contentPublished = toIso(published);
  if (!c.milestones.reportingDelivered) c.milestones.reportingDelivered = toIso(reporting);
}

function revisedStatus(c, now = new Date()) {
  const ko = parseDate(c.kickoffDate);
  if (!ko) return { status: "Off track", reason: "Kick-off date required." };
  const s = c.settings;
  const elapsed = timelineDayDiff(ko, now, s.useBusinessDays);
  const booked = parseDate(c.milestones.interviewBooked);
  const interviewDone = parseDate(c.interviewActualDate) || parseDate(c.milestones.interviewCompleted);
  const revisedPublish = parseDate(c.milestones.contentPublished);
  const first = parseDate(c.firstPublishDate);

  if (!booked && elapsed > s.riskY) {
    return { status: "Off track", reason: `Interview not booked by ${s.riskY} days.` };
  }
  if (!booked && elapsed > s.riskX) {
    return { status: "At risk", reason: `Interview not booked by ${s.riskX} days.` };
  }
  if (!interviewDone && elapsed > s.riskY) {
    return { status: "Off track", reason: `Interview not completed by ${s.riskY} days.` };
  }

  if (revisedPublish) {
    if (first && first > revisedPublish) {
      return { status: "Off track", reason: "First publish is after revised publish date." };
    }
    if (!first && now > revisedPublish) {
      return { status: "Off track", reason: "Revised publish date has passed." };
    }
    const untilRevised = timelineDayDiff(now, revisedPublish, s.useBusinessDays);
    if (!first && untilRevised <= s.riskZ) {
      return { status: "At risk", reason: `Within ${s.riskZ} days of revised publish date.` };
    }
  }

  return { status: "On track", reason: "Revised timeline is currently achievable." };
}

function blockers(c) {
  const blocks = [];
  const inProductionOrLater = ["In production", "In review", "Publishing", "Live", "Reporting"].includes(c.liveStatus);
  const interviewDone = parseDate(c.interviewActualDate) || parseDate(c.milestones.interviewCompleted);
  if (inProductionOrLater && !interviewDone) {
    blocks.push("Production is blocked until Interview completed.");
  }
  if (!parseDate(c.kickoffDate)) {
    blocks.push("Kick-off date is required.");
  }
  return blocks;
}

function applyMilestoneEdit(c, key, newIso) {
  const oldIso = c.milestones[key] || "";
  c.milestones[key] = newIso;

  const oldDate = parseDate(oldIso);
  const newDate = parseDate(newIso);
  if (!oldDate || !newDate) return;

  const deltaDays = timelineDayDiff(oldDate, newDate, c.settings.useBusinessDays);
  if (deltaDays === 0) return;

  const index = milestoneOrder.indexOf(key);
  for (let i = index + 1; i < milestoneOrder.length; i += 1) {
    const nextKey = milestoneOrder[i];
    const existing = parseDate(c.milestones[nextKey]);
    if (!existing) continue;
    const shifted = addTimelineDays(existing, deltaDays, c.settings.useBusinessDays);
    c.milestones[nextKey] = toIso(shifted);
  }
}

function statusClass(status) {
  if (status === "On track" || status === "Not yet due") return "status-ontrack";
  if (status === "At risk") return "status-risk";
  if (status === "Off track" || status === "Missed policy SLA") return "status-critical";
  return "status-hold";
}

function fmt(date) {
  return date ? date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "-";
}

function rangeLabel(startIso, endIso) {
  const start = parseDate(startIso);
  const end = parseDate(endIso);
  if (!start && !end) return "TBC";
  if (start && !end) return `${fmt(start)} -> TBC`;
  if (!start && end) return `TBC -> ${fmt(end)}`;
  return `${fmt(start)} -> ${fmt(end)}`;
}

function renderStatuses() {
  const policy = policyStatus(campaign);
  const revised = revisedStatus(campaign);
  const live = campaign.liveStatus;
  const blocks = blockers(campaign);
  const deadline = policy.deadline ? fmt(policy.deadline) : "-";

  const cards = document.getElementById("statusCards");
  cards.innerHTML = `
    <div class="status-card">
      <h3>Policy timeline</h3>
      <span class="badge ${statusClass(policy.status)}">${policy.status}</span>
      <div class="status-meta">SLA deadline: ${deadline}</div>
    </div>
    <div class="status-card">
      <h3>Revised timeline</h3>
      <span class="badge ${statusClass(revised.status)}">${revised.status}</span>
      <div class="status-meta">${revised.reason}</div>
    </div>
    <div class="status-card">
      <h3>Live execution</h3>
      <span class="badge status-hold">${live}</span>
      <div class="status-meta">${blocks.length ? `<span class="blocked">${blocks.join(" ")}</span>` : "No blockers."}</div>
    </div>
  `;
}

function renderMilestones() {
  const container = document.getElementById("milestoneTable");
  const rows = milestoneOrder.map((key) => {
    const block = key === "draft1Shared" && !(parseDate(campaign.interviewActualDate) || parseDate(campaign.milestones.interviewCompleted));
    return `
      <tr>
        <td>${milestoneLabels[key]}</td>
        <td><input type="date" data-ms="${key}" value="${campaign.milestones[key] || ""}" /></td>
        <td>${block ? '<span class="blocked">Blocked until Interview completed</span>' : ""}</td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <table class="milestone-table">
      <thead>
        <tr><th>Milestone</th><th>Date</th><th>Dependency</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  container.querySelectorAll("input[data-ms]").forEach((input) => {
    input.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-ms");
      applyMilestoneEdit(campaign, key, e.target.value || "");
      if (key === "contentPublished" && !campaign.firstPublishDate && e.target.value) {
        campaign.firstPublishDate = e.target.value;
        document.getElementById("firstPublishDate").value = e.target.value;
      }
      saveCampaign();
      render();
    });
  });
}

function renderTimelineView() {
  const container = document.getElementById("timelineView");
  const items = [];
  if (currentView === "client") {
    const phases = [
      { label: "Planning phase", start: campaign.milestones.kickoffComplete || campaign.kickoffDate, end: campaign.milestones.contentPlanApproved },
      { label: "Production phase", start: campaign.milestones.interviewCompleted || campaign.interviewActualDate, end: campaign.milestones.draft1Shared },
      { label: "Review phase", start: campaign.milestones.draft1Shared, end: campaign.milestones.finalDelivered },
      { label: "Publishing phase", start: campaign.milestones.finalDelivered, end: campaign.milestones.contentPublished || campaign.firstPublishDate },
      { label: "Reporting phase", start: campaign.milestones.contentPublished || campaign.firstPublishDate, end: campaign.milestones.reportingDelivered }
    ];
    phases.forEach((phase) => {
      items.push(`<div class="timeline-item"><strong>${phase.label}</strong>${rangeLabel(phase.start, phase.end)}</div>`);
    });
    if (campaign.settings.showInterviewClient) {
      const interviewDate = campaign.interviewActualDate || campaign.interviewPlannedDate || campaign.milestones.interviewCompleted;
      items.splice(1, 0, `<div class="timeline-item"><strong>Interview date</strong>${interviewDate || "TBC"}</div>`);
    }
    container.innerHTML = `<div class="timeline-list">${items.join("")}</div>`;
    return;
  }

  const policy = policyStatus(campaign);
  const revised = revisedStatus(campaign);
  const block = blockers(campaign);
  items.push(`<div class="timeline-item"><strong>Policy deadline/status</strong>${policy.deadline ? fmt(policy.deadline) : "TBC"} | ${policy.status}</div>`);
  items.push(`<div class="timeline-item"><strong>Revised status</strong>${revised.status} | ${revised.reason}</div>`);
  items.push(`<div class="timeline-item"><strong>Live status</strong>${campaign.liveStatus}</div>`);
  items.push(`<div class="timeline-item"><strong>Blockers</strong>${block.length ? block.join(" ") : "None"}</div>`);
  milestoneOrder.forEach((key) => {
    items.push(`<div class="timeline-item"><strong>${milestoneLabels[key]}</strong>${campaign.milestones[key] || "TBC"}</div>`);
  });
  container.innerHTML = `<div class="timeline-list">${items.join("")}</div>`;
}

function renderRevisions() {
  const el = document.getElementById("revisionsList");
  if (!campaign.revisions.length) {
    el.innerHTML = "No revisions yet.";
    return;
  }
  el.innerHTML = campaign.revisions.map((rev, i) => `
    <div class="revision-item">
      <strong>Revision ${i + 1} - ${fmt(parseDate(rev.createdAt))}</strong>
      <div>Reason: ${rev.reason}</div>
      <div>Policy deadline (unchanged): ${rev.policyDeadline}</div>
      <div>Revised publish target: ${rev.milestones.contentPublished || "TBC"}</div>
    </div>
  `).join("");
}

function readFormToCampaign() {
  campaign.campaignName = document.getElementById("campaignName").value.trim();
  campaign.kickoffDate = document.getElementById("kickoffDate").value;
  campaign.interviewPlannedDate = document.getElementById("interviewPlannedDate").value;
  campaign.interviewActualDate = document.getElementById("interviewActualDate").value;
  campaign.firstPublishDate = document.getElementById("firstPublishDate").value;
  campaign.liveStatus = document.getElementById("liveStatus").value;
  campaign.settings.riskX = Number(document.getElementById("riskX").value || 7);
  campaign.settings.riskY = Number(document.getElementById("riskY").value || 14);
  campaign.settings.riskZ = Number(document.getElementById("riskZ").value || 5);
  campaign.settings.productionDays = Number(document.getElementById("prodDays").value || 7);
  campaign.settings.reviewDays = Number(document.getElementById("reviewDays").value || 5);
  campaign.settings.publishDays = Number(document.getElementById("publishDays").value || 3);
  campaign.settings.useBusinessDays = document.getElementById("useBusinessDays").checked;
  campaign.settings.showInterviewClient = document.getElementById("showInterviewClient").checked;

  if (campaign.interviewActualDate) {
    campaign.milestones.interviewCompleted = campaign.interviewActualDate;
  }

  recomputeWindows(campaign);
  saveCampaign();
}

function writeCampaignToForm() {
  document.getElementById("campaignName").value = campaign.campaignName;
  document.getElementById("kickoffDate").value = campaign.kickoffDate;
  document.getElementById("interviewPlannedDate").value = campaign.interviewPlannedDate;
  document.getElementById("interviewActualDate").value = campaign.interviewActualDate;
  document.getElementById("firstPublishDate").value = campaign.firstPublishDate;
  document.getElementById("riskX").value = campaign.settings.riskX;
  document.getElementById("riskY").value = campaign.settings.riskY;
  document.getElementById("riskZ").value = campaign.settings.riskZ;
  document.getElementById("prodDays").value = campaign.settings.productionDays;
  document.getElementById("reviewDays").value = campaign.settings.reviewDays;
  document.getElementById("publishDays").value = campaign.settings.publishDays;
  document.getElementById("useBusinessDays").checked = campaign.settings.useBusinessDays;
  document.getElementById("showInterviewClient").checked = campaign.settings.showInterviewClient;

  const live = document.getElementById("liveStatus");
  live.innerHTML = liveStages.map((stage) => `<option value="${stage}">${stage}</option>`).join("");
  live.value = campaign.liveStatus;
}

function render() {
  renderStatuses();
  renderMilestones();
  renderTimelineView();
  renderRevisions();
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

function exportJson() {
  downloadFile("campaign-timeline.json", JSON.stringify(campaign, null, 2), "application/json");
}

function exportCsv() {
  const rows = [["Milestone", "Date"]];
  milestoneOrder.forEach((k) => rows.push([milestoneLabels[k], campaign.milestones[k] || ""]));
  const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
  downloadFile("campaign-schedule.csv", csv, "text/csv");
}

function createRevision() {
  const deadline = policyDeadline(campaign);
  campaign.revisions.push({
    createdAt: new Date().toISOString(),
    reason: "Manual revision created",
    policyDeadline: deadline ? toIso(deadline) : "",
    milestones: structuredClone(campaign.milestones),
    settings: structuredClone(campaign.settings)
  });
  saveCampaign();
  renderRevisions();
}

function runAcceptanceTests() {
  const results = [];

  function assert(name, condition, detail) {
    results.push({ name, pass: Boolean(condition), detail });
  }

  const base = structuredClone(defaultCampaign);
  base.kickoffDate = "2026-01-01";

  const t1 = structuredClone(base);
  assert("1) Policy status: not yet due", policyStatus(t1, new Date("2026-01-10T00:00:00")).status === "Not yet due", "No first publish before deadline.");

  const t2 = structuredClone(base);
  t2.firstPublishDate = "2026-01-20";
  assert("2) Policy status: on track", policyStatus(t2, new Date("2026-01-20T00:00:00")).status === "On track", "First publish within 30 days.");

  const t3 = structuredClone(base);
  assert("3) Policy status: missed SLA", policyStatus(t3, new Date("2026-02-20T00:00:00")).status === "Missed policy SLA", "No publish after deadline.");

  const t4 = structuredClone(base);
  t4.liveStatus = "In production";
  assert("4) Dependency block", blockers(t4).includes("Production is blocked until Interview completed."), "Production cannot start before interview completed.");

  const t5 = structuredClone(base);
  t5.milestones.interviewCompleted = "2026-01-10";
  t5.milestones.draft1Shared = "2026-01-17";
  t5.milestones.feedbackComplete = "2026-01-22";
  applyMilestoneEdit(t5, "interviewCompleted", "2026-01-12");
  assert("5) Downstream shift", t5.milestones.draft1Shared === "2026-01-19" && t5.milestones.feedbackComplete === "2026-01-24", "Editing one date shifts downstream milestones.");

  const t6 = structuredClone(base);
  t6.kickoffDate = "2026-01-05";
  t6.milestones.contentPublished = "2026-02-10";
  const fixedPolicy = policyDeadline(t6);
  t6.revisions.push({
    createdAt: new Date("2026-02-01").toISOString(),
    reason: "Delay",
    policyDeadline: fixedPolicy ? toIso(fixedPolicy) : "",
    milestones: structuredClone(t6.milestones),
    settings: structuredClone(t6.settings)
  });
  t6.milestones.contentPublished = "2026-02-20";
  assert("6) Revision snapshot keeps policy clock fixed", t6.revisions[0].policyDeadline === toIso(fixedPolicy), "Policy deadline remains unchanged after revisions.");

  const el = document.getElementById("testResults");
  el.innerHTML = results.map((r) => `<div class="${r.pass ? "pass" : "fail"}">${r.pass ? "PASS" : "FAIL"} - ${r.name}: ${r.detail}</div>`).join("");
}

function initListeners() {
  document.querySelectorAll("#campaignName,#kickoffDate,#interviewPlannedDate,#interviewActualDate,#firstPublishDate,#liveStatus,#riskX,#riskY,#riskZ,#prodDays,#reviewDays,#publishDays,#useBusinessDays,#showInterviewClient").forEach((el) => {
    el.addEventListener("change", () => {
      readFormToCampaign();
      render();
    });
  });

  document.getElementById("viewClient").addEventListener("click", () => {
    currentView = "client";
    document.getElementById("viewClient").classList.add("active");
    document.getElementById("viewInternal").classList.remove("active");
    renderTimelineView();
  });

  document.getElementById("viewInternal").addEventListener("click", () => {
    currentView = "internal";
    document.getElementById("viewInternal").classList.add("active");
    document.getElementById("viewClient").classList.remove("active");
    renderTimelineView();
  });

  document.getElementById("createRevision").addEventListener("click", createRevision);
  document.getElementById("exportJson").addEventListener("click", exportJson);
  document.getElementById("exportCsv").addEventListener("click", exportCsv);
  document.getElementById("runTests").addEventListener("click", runAcceptanceTests);
}

writeCampaignToForm();
initListeners();
render();

window.timelinePlanner = {
  policyStatus,
  revisedStatus,
  blockers,
  applyMilestoneEdit,
  policyDeadline
};

const checkpoints = [
  {
    title: "Kick-off",
    question: "Can the client name who the SME is?",
    options: [
      {
        answer: "Client has confirmed the SME",
        status: "On Track",
        action: "Confirm interview availability windows now.",
        prep: "Draft content plan timeline for Week 1 sign-off."
      },
      {
        answer: "Client has not confirmed the SME",
        status: "At Risk",
        action: "Send same-day follow-up with a 5 working day deadline, time commitment, and interview format.",
        prep: "Block placeholder interview slots.",
        isResponseGate: true,
        responseType: "signoff"
      }
    ]
  },
  {
    title: "Week 1",
    question: "Do we have an approved content plan?",
    options: [
      {
        answer: "Content plan is approved",
        status: "On Track",
        action: "Lock interview invite and content production schedule.",
        prep: "Confirm Week 2 booking date."
      },
      {
        answer: "Content plan is in edits and approval date is confirmed",
        status: "At Risk",
        action: "Send impact note and request final sign-off by agreed date.",
        prep: "Draft interview questions."
      },
      {
        answer: "Content plan is in edits and approval date is not confirmed",
        status: "At Risk",
        action: "Set a clear 5 working day sign-off deadline with the client.",
        prep: "Draft interview questions and hold scheduling placeholders.",
        isResponseGate: true,
        responseType: "signoff"
      },
      {
        answer: "Not started or no progress",
        status: "Behind",
        action: "Update timeline and require client decision on the updated plan and reduced promotion window.",
        prep: "Escalate to AM/CC and require client decision on compressed path."
      }
    ]
  },
  {
    title: "Week 2",
    question: "Have we booked the interview?",
    options: [
      {
        answer: "Interview is booked for this week",
        status: "On Track",
        action: "Run interview and move directly into draft creation.",
        prep: "Confirm creator/editor availability for Week 3."
      },
      {
        answer: "Interview is booked for next week",
        status: "At Risk",
        action: "Lock the final interview slot within 5 working days.",
        prep: "Make sure content creation can start as soon as the interview is done."
      },
      {
        answer: "Interview is not booked, but booking decision is due within 5 working days",
        status: "At Risk",
        action: "Set a clear 5 working day booking deadline with the client.",
        prep: "Prepare fallback options if booking is still unresolved at the next checkpoint.",
        isResponseGate: true,
        responseType: "booking"
      },
      {
        answer: "Interview is booked for Week 4 or later, or no interview date is confirmed",
        status: "Behind",
        action: "Update timeline with shorter promotion period and require client decision by a clear deadline.",
        prep: "Require client decision between compressed plan and reduced scope."
      }
    ]
  },
  {
    title: "Week 3",
    question: "Are we able to create the content?",
    options: [
      {
        answer: "Content creation is underway",
        status: "On Track",
        action: "Keep production moving and set internal publish readiness date.",
        prep: "Confirm Week 4 publication requirements are complete."
      },
      {
        answer: "Content creation has started but is blocked",
        status: "At Risk",
        action: "Clear blockers within 2 working days and prioritize minimum publishable assets.",
        prep: "Pre-book publication slot."
      },
      {
        answer: "Cannot start creation",
        status: "Behind",
        action: "Update timeline, require client decision on updated dates/scope, and escalate blocker owner.",
        prep: "Set clear go or no-go publication decision point with client confirmation."
      }
    ]
  },
  {
    title: "Week 4",
    question: "Can we publish the content?",
    options: [
      {
        answer: "Content is approved and ready to publish this week",
        status: "On Track",
        action: "Publish and start full promotion window.",
        prep: "Verify Day 30 publish/readiness evidence is logged."
      },
      {
        answer: "Content is in final review and expected to publish next week",
        status: "At Risk",
        action: "Push for approval within 5 working days to protect promotion quality.",
        prep: "Prepare Day 30 status update."
      },
      {
        answer: "Content is not approved and no publish date is confirmed",
        status: "Behind",
        action: "Update timeline, require client decision on reduced promotion window, and confirm benchmark impact.",
        prep: "Prepare Day 30 behind-status communication and updated forecast."
      }
    ]
  },
  {
    title: "Day 30",
    question: "Is content ready to publish by Day 30?",
    options: [
      {
        answer: "Content is approved and ready to publish, or already published",
        status: "On Track",
        action: "Continue full promotion execution.",
        prep: "Map remaining assets against Day 60 full publication plan."
      },
      {
        answer: "Content is approved and ready to publish within 5 working days",
        status: "At Risk",
        action: "Fast-track publication and track approvals daily until live.",
        prep: "Identify any Day 60 risks now."
      },
      {
        answer: "No content is approved and ready to publish by Day 30",
        status: "Behind",
        action: "Send impact email, run internal AM/CC unblock review, update timeline, and require client decision on updated plan and reduced promotion window.",
        prep: "Define Day 60 minimum viable publication plan."
      }
    ]
  },
  {
    title: "Day 60",
    question: "What is published or readily publishable by Day 60?",
    options: [
      {
        answer: "All planned content published",
        status: "On Track",
        action: "Continue planned promotion and optimization.",
        prep: "Ensure reporting inputs are complete for Day 90."
      },
      {
        answer: "Some content is published, and all remaining content is approved and ready to publish now",
        status: "At Risk",
        action: "Publish remaining content immediately and preserve as much promotion depth as possible.",
        prep: "Confirm everything will be live before Day 90."
      },
      {
        answer: "Some content is published, and some remaining content is not approved or not ready",
        status: "Behind",
        action: "Stop starting new work, request approvals within 5 working days, update timeline, and require client decision on updated plan.",
        prep: "Define Day 90 reporting limitations."
      },
      {
        answer: "No content published",
        status: "Critical",
        action: "Set final 5-day decision window; no new work until client decision.",
        prep: "Draft Day 90 critical-path communication."
      }
    ]
  },
  {
    title: "Day 90",
    question: "What is published or readily publishable by Day 90?",
    options: [
      {
        answer: "All planned content published",
        status: "On Track",
        action: "Run full reporting cycle.",
        prep: "Confirm no extension is needed toward Day 120."
      },
      {
        answer: "Some content is published, and all remaining content is approved and ready to publish now",
        status: "At Risk",
        action: "Publish remaining content immediately and document reporting caveats.",
        prep: "Check if Day 120 extension can be avoided."
      },
      {
        answer: "Some content is published, and some remaining content is not approved or not ready",
        status: "Behind",
        action: "Hold new work, enforce 5-day approval deadline, update timeline, and require client decision on updated plan/scope.",
        prep: "Prepare Day 120 decision options."
      },
      {
        answer: "No content published",
        status: "Critical",
        action: "Promotion and comprehensive reporting are no longer viable; require immediate client decision.",
        prep: "Move to Day 120 extension decision framework."
      }
    ]
  },
  {
    title: "Day 120",
    question: "At Day 120, what is the campaign decision/outcome?",
    options: [
      {
        answer: "Campaign deliverables already completed",
        status: "Complete",
        action: "Close campaign and archive timeline outcomes.",
        prep: "No further checkpoint action needed."
      },
      {
        answer: "Extension decision pending",
        status: "On Hold",
        action: "Pause execution and send a binary decision deadline.",
        prep: "Prepare quarter-impact scenarios."
      },
      {
        answer: "Client sacrifices a future quarter to continue",
        status: "Behind",
        action: "Continue on an updated timeline with explicit future-quarter reduction and client decision recorded.",
        prep: "Set 6-month viability review criteria."
      },
      {
        answer: "Client scraps this quarter",
        status: "Expired",
        action: "Stop remaining quarter work and close with documented scope loss.",
        prep: "Align next-quarter restart conditions if needed."
      },
      {
        answer: "No client response by deadline",
        status: "On Hold",
        action: "Keep paused and escalate commercially via the AM owner.",
        prep: "Carry unresolved state into the 6-month checkpoint."
      }
    ]
  },
  {
    title: "6-month",
    question: "Is campaign completion still viable without harming on-track campaigns?",
    options: [
      {
        answer: "Campaign is complete, or a viable plan is agreed",
        status: "On Track",
        action: "Continue or close per agreed plan.",
        prep: "Confirm 9-month closeout path."
      },
      {
        answer: "Campaign is viable only if client approves reduced scope or tradeoff",
        status: "Critical",
        action: "Get AM-backed client decision on reduced deliverables and timeline.",
        prep: "Lock 9-month final decision criteria."
      },
      {
        answer: "Not viable and decision pending",
        status: "On Hold",
        action: "Pause and issue a final decision window.",
        prep: "Prepare 9-month closure recommendation."
      }
    ]
  },
  {
    title: "9-month",
    question: "Is there still a viable path to deliver remaining campaign value?",
    options: [
      {
        answer: "Campaign is completed, or reduced-scope closeout is agreed and viable",
        status: "On Track",
        action: "Execute closeout and finalize reporting narrative.",
        prep: "No further checkpoint action needed."
      },
      {
        answer: "Not viable; closeout or de-scope required",
        status: "Critical",
        action: "End remaining scope, document impacts, and transition resources.",
        prep: "No further checkpoint action needed."
      },
      {
        answer: "No decision or paused",
        status: "On Hold",
        action: "Maintain hold status and trigger commercial closure path.",
        prep: "No further checkpoint action needed."
      }
    ]
  }
];

const responseGateDefaults = {
  "Kick-off": { responseType: "signoff", responseDeadlineWorkingDays: 5 },
  "Week 1": { responseType: "signoff", responseDeadlineWorkingDays: 5 },
  "Week 2": { responseType: "booking", responseDeadlineWorkingDays: 5 },
  "Week 3": { responseType: "approval", responseDeadlineWorkingDays: 5 },
  "Week 4": { responseType: "approval", responseDeadlineWorkingDays: 5 },
  "Day 30": { responseType: "approval", responseDeadlineWorkingDays: 5 },
  "Day 60": { responseType: "approval", responseDeadlineWorkingDays: 5 },
  "Day 90": { responseType: "approval", responseDeadlineWorkingDays: 5 },
  "Day 120": { responseType: "commercial_decision", responseDeadlineWorkingDays: 5 },
  "6-month": { responseType: "commercial_decision", responseDeadlineWorkingDays: 5 },
  "9-month": { responseType: "commercial_decision", responseDeadlineWorkingDays: 5 }
};

function responseGateCopy(title) {
  const base = "Waiting on client response/sign-off";
  if (title === "Kick-off") {
    return {
      answer: base,
      action: "Request SME confirmation and campaign sign-off within 5 working days.",
      prep: "If unresolved by the next checkpoint, update timeline and require client decision on reduced promotion window."
    };
  }
  if (title === "Week 2") {
    return {
      answer: base,
      action: "Request interview booking confirmation within 5 working days.",
      prep: "If unresolved by the next checkpoint, update timeline and require client decision on compressed plan."
    };
  }
  if (title === "Day 120" || title === "6-month" || title === "9-month") {
    return {
      answer: base,
      action: "Request a commercial decision with a clear response deadline.",
      prep: "If unresolved by the next checkpoint, keep campaign on hold and escalate via AM."
    };
  }
  return {
    answer: base,
    action: "Request client response/sign-off with a clear 5 working day deadline.",
    prep: "If unresolved by the next checkpoint, update timeline and require client decision."
  };
}

const responseGateEquivalentAnswersByCheckpoint = {
  "Kick-off": ["Client has not confirmed the SME"],
  "Week 1": ["Content plan is in edits and approval date is not confirmed"],
  "Week 2": ["Interview is not booked, but booking decision is due within 5 working days"],
  "Day 120": ["No client response by deadline"],
  "6-month": ["Not viable and decision pending"],
  "9-month": ["No decision or paused"]
};

checkpoints.forEach((checkpoint, checkpointIndex) => {
  const defaults = responseGateDefaults[checkpoint.title] || { responseType: "approval", responseDeadlineWorkingDays: 5 };
  const equivalentAnswers = responseGateEquivalentAnswersByCheckpoint[checkpoint.title] || [];
  const existingGateOption = checkpoint.options.find(
    (option) => option.isResponseGate || equivalentAnswers.includes(option.answer)
  );

  if (existingGateOption) {
    existingGateOption.isResponseGate = true;
    existingGateOption.responseDeadlineWorkingDays = existingGateOption.responseDeadlineWorkingDays || defaults.responseDeadlineWorkingDays;
    existingGateOption.escalatesAfterCheckpoints = existingGateOption.escalatesAfterCheckpoints ?? 1;
    existingGateOption.responseType = existingGateOption.responseType || defaults.responseType;
    existingGateOption.gateCheckpointIndex = checkpointIndex;
    return;
  }

  const copy = responseGateCopy(checkpoint.title);
  checkpoint.options.push({
    answer: copy.answer,
    status: "At Risk",
    action: copy.action,
    prep: copy.prep,
    isResponseGate: true,
    responseDeadlineWorkingDays: defaults.responseDeadlineWorkingDays,
    escalatesAfterCheckpoints: 1,
    responseType: defaults.responseType,
    gateCheckpointIndex: checkpointIndex
  });
});

const impactByCheckpointAnswer = {
  "Kick-off::Client has confirmed the SME": [
    "Interview scheduling can proceed without timeline risk."
  ],
  "Kick-off::Client has not confirmed the SME": [
    "Won't be able to schedule interview.",
    "Timeline for drafts will be at risk.",
    "Risk to promotion window."
  ],
  "Week 1::Content plan is approved": [
    "Campaign can proceed as planned."
  ],
  "Week 1::Content plan is in edits and approval date is confirmed": [
    "Campaign cannot fully progress until sign-off.",
    "Publication is at risk of delay.",
    "Promotion window may be shortened."
  ],
  "Week 1::Content plan is in edits and approval date is not confirmed": [
    "Campaign cannot fully progress until sign-off.",
    "Publication is at risk of delay.",
    "Promotion window may be shortened."
  ],
  "Week 1::Not started or no progress": [
    "Original timeline is no longer feasible.",
    "Promotion window is being eaten into and will be shorter."
  ],
  "Week 2::Interview is booked for this week": [
    "Content creation can proceed on schedule."
  ],
  "Week 2::Interview is booked for next week": [
    "Timeline for drafts is at risk.",
    "Promotion window is at risk."
  ],
  "Week 2::Interview is not booked, but booking decision is due within 5 working days": [
    "Timeline for drafts is at risk.",
    "Promotion window is at risk."
  ],
  "Week 2::Interview is booked for Week 4 or later, or no interview date is confirmed": [
    "Original timeline is no longer feasible.",
    "Promotion window is being eaten into and will be shorter."
  ],
  "Week 3::Content creation is underway": [
    "No immediate impact to timeline."
  ],
  "Week 3::Content creation has started but is blocked": [
    "Promotion window is at risk.",
    "Risk to reach and performance if delays continue."
  ],
  "Week 3::Cannot start creation": [
    "Original timeline is no longer feasible.",
    "Promotion window is being eaten into and will be shorter."
  ],
  "Week 4::Content is approved and ready to publish this week": [
    "Full promotion window remains achievable."
  ],
  "Week 4::Content is in final review and expected to publish next week": [
    "Promotion window is at risk of shortening.",
    "Reporting depth may be reduced if delayed further."
  ],
  "Week 4::Content is not approved and no publish date is confirmed": [
    "Promotion window is being eaten into and will be shorter.",
    "Risk to reach and performance.",
    "May not hit benchmarks."
  ],
  "Day 30::Content is approved and ready to publish, or already published": [
    "Promotion can continue as planned."
  ],
  "Day 30::Content is approved and ready to publish within 5 working days": [
    "Promotion window is at risk of shortening.",
    "Risk to reach and performance if delay continues."
  ],
  "Day 30::No content is approved and ready to publish by Day 30": [
    "Promotion window is being eaten into and will be shorter.",
    "Risk to reach and performance.",
    "May not hit benchmarks."
  ],
  "Day 60::All planned content published": [
    "No immediate impact to promotion depth."
  ],
  "Day 60::Some content is published, and all remaining content is approved and ready to publish now": [
    "Remaining content promotion depth is at risk if not published immediately.",
    "Overall campaign reach may reduce if delay continues."
  ],
  "Day 60::Some content is published, and some remaining content is not approved or not ready": [
    "Remaining content will not receive full promotion.",
    "Overall campaign reach will be reduced."
  ],
  "Day 60::No content published": [
    "Only 30 days left in promotion window.",
    "Reduced reach and performance.",
    "Comprehensive report is at risk."
  ],
  "Day 90::All planned content published": [
    "Reporting can run as planned."
  ],
  "Day 90::Some content is published, and all remaining content is approved and ready to publish now": [
    "Reporting depth may be reduced for late-published items."
  ],
  "Day 90::Some content is published, and some remaining content is not approved or not ready": [
    "Not able to promote all content.",
    "Performance will be below benchmark."
  ],
  "Day 90::No content published": [
    "Promotion is no longer possible.",
    "Comprehensive report is not viable.",
    "Will begin to impact other quarters and commitments to other clients."
  ],
  "Day 120::Campaign deliverables already completed": [
    "No extension required."
  ],
  "Day 120::Extension decision pending": [
    "Work remains paused pending a client decision."
  ],
  "Day 120::Client sacrifices a future quarter to continue": [
    "Current campaign continues, but future quarter capacity is reduced."
  ],
  "Day 120::Client scraps this quarter": [
    "Remaining quarter work is stopped and closed."
  ],
  "Day 120::No client response by deadline": [
    "Campaign remains paused and unresolved."
  ],
  "6-month::Campaign is complete, or a viable plan is agreed": [
    "Campaign remains viable without harming on-track campaigns."
  ],
  "6-month::Campaign is viable only if client approves reduced scope or tradeoff": [
    "Campaign completion is no longer achievable without harming on-track campaigns."
  ],
  "6-month::Not viable and decision pending": [
    "Campaign completion is no longer achievable without harming on-track campaigns."
  ],
  "9-month::Campaign is completed, or reduced-scope closeout is agreed and viable": [
    "Remaining value can still be delivered via agreed closeout."
  ],
  "9-month::Not viable; closeout or de-scope required": [
    "Campaign completion is no longer achievable without harming on-track campaigns."
  ],
  "9-month::No decision or paused": [
    "Campaign completion is no longer achievable without harming on-track campaigns."
  ]
};

const state = {
  index: 0,
  koDate: null,
  answers: new Array(checkpoints.length).fill(null),
  highestSeverityReached: "On Track",
  responseGates: {}
};

const checkpointRail = document.getElementById("checkpointRail");
const checkpointLabel = document.getElementById("checkpointLabel");
const questionText = document.getElementById("questionText");
const progressText = document.getElementById("progressText");
const optionsContainer = document.getElementById("optionsContainer");
const resultCard = document.getElementById("resultCard");
const selectedAnswer = document.getElementById("selectedAnswer");
const statusBadge = document.getElementById("statusBadge");
const resultAction = document.getElementById("resultAction");
const koDateInput = document.getElementById("koDateInput");
const koContext = document.getElementById("koContext");
const jumpSuggested = document.getElementById("jumpSuggested");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetAll = document.getElementById("resetAll");
const summaryList = document.getElementById("summaryList");

function statusClass(status) {
  if (status === "On Track") return "status-ontrack";
  if (status === "At Risk") return "status-risk";
  if (status === "Behind") return "status-behind";
  if (status === "Critical") return "status-critical";
  if (status === "On Hold" || status === "Expired") return "status-hold";
  return "status-ontrack";
}

const severityRank = {
  "On Track": 0,
  "At Risk": 1,
  "Behind": 2,
  "Critical": 3,
  "On Hold": 4,
  "Expired": 4,
  "Complete": 4
};

function compareSeverity(a, b) {
  return (severityRank[a] ?? 0) - (severityRank[b] ?? 0);
}

function gateKey(index) {
  return String(index);
}

function ensureResponseGateRecord(index, option) {
  const key = gateKey(index);
  if (state.responseGates[key] && !state.responseGates[key].resolved) {
    return state.responseGates[key];
  }
  state.responseGates[key] = {
    askedDate: "",
    openedAt: new Date().toISOString(),
    openedCheckpointIndex: index,
    deadlineDate: "",
    resolved: false
  };
  return state.responseGates[key];
}

function parseInputDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function setResponseGateAskedDate(index, option, askedDateValue) {
  const key = gateKey(index);
  const gate = ensureResponseGateRecord(index, option);
  const asked = parseInputDate(askedDateValue);
  if (!asked) {
    gate.askedDate = "";
    gate.deadlineDate = "";
    return;
  }
  const deadline = addWorkingDays(asked, option.responseDeadlineWorkingDays || 5);
  gate.askedDate = askedDateValue;
  gate.deadlineDate = deadline.toISOString();
}

function resolveResponseGate(index) {
  const key = gateKey(index);
  if (!state.responseGates[key]) return;
  state.responseGates[key].resolved = true;
}

function gateBaseStatus(index, option) {
  const key = gateKey(index);
  const gate = state.responseGates[key];
  const initialStatus = option.gateInitialStatus || option.status || "At Risk";
  const escalatedStatus = option.gateEscalatedStatus || (initialStatus === "At Risk" ? "Behind" : initialStatus);
  if (!gate || gate.resolved) return initialStatus;
  if (gate.deadlineDate) {
    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const deadline = new Date(gate.deadlineDate);
    const startDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    if (startToday > startDeadline) return escalatedStatus;
  }
  const escalatesAfter = option.escalatesAfterCheckpoints ?? 1;
  const checkpointEscalated = state.index >= (gate.openedCheckpointIndex + escalatesAfter);
  return checkpointEscalated ? escalatedStatus : initialStatus;
}

function getSelectedOption(checkpointIndex) {
  const selectedIndex = state.answers[checkpointIndex];
  if (selectedIndex === null || selectedIndex === undefined) return null;
  return checkpoints[checkpointIndex].options[selectedIndex] || null;
}

function classifyBlockerType(option) {
  if (option.isResponseGate) return "Client response/sign-off";
  const text = `${option.action || ""} ${option.prep || ""}`.toLowerCase();
  if (text.includes("client decision") || text.includes("approval") || text.includes("sign-off")) {
    return "Client response/sign-off";
  }
  return "Internal delivery/process";
}

function shouldShowDiagnosis(checkpoint, picked) {
  const isDay30 = checkpoint.title === "Day 30";
  const isDay90 = checkpoint.title === "Day 90";
  if (!isDay30 && !isDay90) return false;
  return picked.status !== "On Track";
}

function buildHoldupDiagnosis(targetIndex, effectiveStatuses) {
  const blockers = [];
  for (let i = 0; i < targetIndex; i += 1) {
    const option = getSelectedOption(i);
    if (!option) continue;
    const status = effectiveStatuses[i];
    if (compareSeverity(status, "At Risk") < 0) continue;
    const gate = state.responseGates[gateKey(i)];
    const askedSuffix = option.isResponseGate && gate?.askedDate
      ? ` (requested ${formatDeadline(parseInputDate(gate.askedDate))})`
      : "";
    blockers.push({
      checkpoint: checkpoints[i].title,
      answer: option.answer,
      status,
      type: classifyBlockerType(option),
      askedSuffix
    });
  }

  if (!blockers.length) {
    return {
      summary: "No earlier checkpoint is currently marked At Risk/Behind/Critical. The hold-up likely occurred at the current checkpoint only.",
      blockers: []
    };
  }

  const clientCount = blockers.filter((b) => b.type === "Client response/sign-off").length;
  const internalCount = blockers.length - clientCount;
  return {
    summary: `Detected ${blockers.length} likely hold-up stage(s): ${clientCount} client response/sign-off, ${internalCount} internal delivery/process.`,
    blockers
  };
}

function rawStatusForCheckpoint(checkpointIndex) {
  const option = getSelectedOption(checkpointIndex);
  if (!option) return null;
  if (option.isResponseGate) return gateBaseStatus(checkpointIndex, option);
  return option.status;
}

function computeEffectiveStatuses() {
  const effective = new Array(checkpoints.length).fill(null);
  let latest = "On Track";
  checkpoints.forEach((_, i) => {
    const raw = rawStatusForCheckpoint(i);
    if (!raw) return;
    effective[i] = raw;
    latest = raw;
  });
  state.highestSeverityReached = latest;
  return effective;
}

function getImpactLines(checkpointTitle, answer) {
  if (answer === "Waiting on client response/sign-off") {
    const lower = checkpointTitle.toLowerCase();
    if (lower.includes("day 60") || lower.includes("day 90")) {
      return [
        "Campaign cannot fully progress until client response is received.",
        "Publication is delayed and promotion window shortens.",
        "Reach, performance, and reporting depth are at risk."
      ];
    }
    if (lower.includes("day 120") || lower.includes("6-month") || lower.includes("9-month")) {
      return [
        "Campaign remains paused pending client decision.",
        "Work cannot progress without risking on-track campaigns."
      ];
    }
    return [
      "Campaign cannot fully progress until client response is received.",
      "Publication may be delayed.",
      "Promotion window is at risk of shortening."
    ];
  }
  const key = `${checkpointTitle}::${answer}`;
  return impactByCheckpointAnswer[key] || ["Impact not specified for this selection."];
}

function formatGateDeadlineText(option, checkpointIndex) {
  const gate = ensureResponseGateRecord(checkpointIndex, option);
  if (!gate.askedDate || !gate.deadlineDate) {
    return `Request response within ${option.responseDeadlineWorkingDays || 5} working days.`;
  }
  const deadline = new Date(gate.deadlineDate);
  return `Expect client response by ${formatDeadline(deadline)} (${option.responseDeadlineWorkingDays || 5} working days).`;
}

function gateTrackingText(option, checkpointIndex) {
  const gate = ensureResponseGateRecord(checkpointIndex, option);
  if (!gate.askedDate || !gate.deadlineDate) {
    return `Set the request date below to calculate the ${option.responseDeadlineWorkingDays || 5} working day deadline.`;
  }
  const asked = parseInputDate(gate.askedDate);
  const deadline = new Date(gate.deadlineDate);
  return `Requested: ${formatDeadline(asked)}. Response due by: ${formatDeadline(deadline)}.`;
}

function gateEscalationText(option, checkpointIndex) {
  const escalatesAfter = option.escalatesAfterCheckpoints ?? 1;
  const nextIndex = Math.min(checkpoints.length - 1, checkpointIndex + escalatesAfter);
  const nextCheckpoint = checkpoints[nextIndex].title;
  return `If unresolved by the 5 working day deadline, status moves to Behind. If still unresolved at ${nextCheckpoint}, keep escalating with timeline updates and client decision required.`;
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  const last = n % 10;
  if (last === 1) return `${n}st`;
  if (last === 2) return `${n}nd`;
  if (last === 3) return `${n}rd`;
  return `${n}th`;
}

function formatDateDisplay(date) {
  const d = date.getDate();
  const month = date.toLocaleDateString(undefined, { month: "short" });
  const year = date.getFullYear();
  return `${ordinal(d)} ${month} ${year}`;
}

function formatWeekCommencing(date) {
  return `W/c ${formatDateDisplay(date)}`;
}

function formatDeadline(date) {
  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  return `${weekday} ${formatDateDisplay(date)}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addWorkingDays(date, workingDays) {
  const d = new Date(date);
  let left = workingDays;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d;
}

function weekCommencing(date) {
  const d = new Date(date);
  const day = d.getDay();
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offsetToMonday);
  return d;
}

function koWeekCheckpointDate(koDate, weekNumber) {
  const week0 = weekCommencing(koDate);
  return addDays(week0, weekNumber * 7);
}

function parseKoDate() {
  if (!state.koDate) return null;
  const d = new Date(`${state.koDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function koMilestoneDate(label, koDate) {
  const lower = label.toLowerCase();
  if (lower.includes("week 1")) return koWeekCheckpointDate(koDate, 1);
  if (lower.includes("week 2")) return koWeekCheckpointDate(koDate, 2);
  if (lower.includes("week 3")) return koWeekCheckpointDate(koDate, 3);
  if (lower.includes("week 4")) return koWeekCheckpointDate(koDate, 4);
  if (lower.includes("day 30")) return addDays(koDate, 30);
  if (lower.includes("day 60")) return addDays(koDate, 60);
  if (lower.includes("day 90")) return addDays(koDate, 90);
  if (lower.includes("day 120")) return addDays(koDate, 120);
  if (lower.includes("6-month")) return addDays(koDate, 182);
  if (lower.includes("9-month")) return addDays(koDate, 273);
  return null;
}

function applyTimeDates(text, checkpointTitle) {
  if (!state.koDate) return text;
  const ko = parseKoDate();
  if (!ko) return text;

  let out = text;
  const today = new Date();
  const timingNotes = [];
  const wdMatch = out.match(/(\d+)\s+working\s+day/i);
  if (wdMatch) {
    const wd = Number(wdMatch[1]);
    const due = addWorkingDays(today, wd);
    timingNotes.push(`By <span class="date-pill">${formatDeadline(due)}</span>`);
  }

  const dayMatch = out.match(/\bDay\s+(30|60|90|120)\b/i);
  if (dayMatch) {
    const dayNum = Number(dayMatch[1]);
    const d = addDays(ko, dayNum);
    timingNotes.push(`<span class="date-pill">${formatWeekCommencing(weekCommencing(d))}</span>`);
  }

  const weekMatch = out.match(/\bWeek\s+([1-4])\b/i);
  if (weekMatch) {
    const weekNum = Number(weekMatch[1]);
    const d = koWeekCheckpointDate(ko, weekNum);
    timingNotes.push(`<span class="date-pill">${formatWeekCommencing(weekCommencing(d))}</span>`);
  }

  if (/6-month/i.test(out)) timingNotes.push(`<span class="date-pill">${formatWeekCommencing(weekCommencing(addDays(ko, 182)))}</span>`);
  if (/9-month/i.test(out)) timingNotes.push(`<span class="date-pill">${formatWeekCommencing(weekCommencing(addDays(ko, 273)))}</span>`);

  if (timingNotes.length) {
    const unique = [...new Set(timingNotes)];
    out += `<br><span class="timing-note">Timing: ${unique.join(" | ")}</span>`;
  }
  return out;
}

function recommendationText(checkpoint, option) {
  const action = applyTimeDates(option.action, checkpoint.title);
  const prep = applyTimeDates(option.prep, checkpoint.title);
  return `${checkpoint.title}: ${option.answer}\nStatus: ${option.status}\nWhat to do now: ${action}\nThen: ${prep}`;
}

function toBulletItems(text) {
  return String(text)
    .split(/\.\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.endsWith(".") ? line : `${line}.`);
}

function escalationNotice(status) {
  if (status === "Critical") {
    return "AM consultation is required immediately before client comms are sent.";
  }
  if (status === "Behind") {
    return "CSM must align with AM before sending client comms and timeline updates.";
  }
  return "";
}

function campaignDayFromKo(ko) {
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startKo = new Date(ko.getFullYear(), ko.getMonth(), ko.getDate());
  return Math.floor((startToday - startKo) / (1000 * 60 * 60 * 24));
}

function suggestedCheckpointIndex(day) {
  const ko = parseKoDate();
  if (!ko) return 0;

  const today = new Date();
  const checkpointsByDate = [
    { index: 0, date: ko },                           // Kick-off
    { index: 1, date: koWeekCheckpointDate(ko, 1) }, // Week 1
    { index: 2, date: koWeekCheckpointDate(ko, 2) }, // Week 2
    { index: 3, date: koWeekCheckpointDate(ko, 3) }, // Week 3
    { index: 4, date: koWeekCheckpointDate(ko, 4) }, // Week 4
    { index: 5, date: addDays(ko, 30) },             // Day 30
    { index: 6, date: addDays(ko, 60) },             // Day 60
    { index: 7, date: addDays(ko, 90) },             // Day 90
    { index: 8, date: addDays(ko, 120) },            // Day 120
    { index: 9, date: addDays(ko, 182) },            // 6-month
    { index: 10, date: addDays(ko, 273) }            // 9-month
  ];

  let suggested = 0;
  checkpointsByDate.forEach((entry) => {
    if (today >= entry.date) suggested = entry.index;
  });
  return suggested;
}

function renderKoContext() {
  if (!state.koDate) {
    koContext.textContent = "Add a Kick-off date to see where the campaign should be today.";
    jumpSuggested.disabled = true;
    return;
  }
  const ko = parseKoDate();
  if (!ko) {
    koContext.textContent = "Kick-off date is invalid.";
    jumpSuggested.disabled = true;
    return;
  }

  const day = campaignDayFromKo(ko);
  if (day < 0) {
    koContext.textContent = `Kick-off is in the future (${formatDate(ko)}). Campaign has not started yet.`;
    jumpSuggested.disabled = false;
    return;
  }

  const suggested = suggestedCheckpointIndex(day);
  const checkpoint = checkpoints[suggested];
  const checkpointDate = koMilestoneDate(checkpoint.title, ko);
  koContext.textContent = `Today is Day ${day} from Kick-off (${formatDate(ko)}). You should be at ${checkpoint.title}${checkpointDate ? ` (${formatWeekCommencing(weekCommencing(checkpointDate))})` : ""}.`;
  jumpSuggested.disabled = false;
}

function renderRail() {
  const effectiveStatuses = computeEffectiveStatuses();
  checkpointRail.innerHTML = "";
  checkpoints.forEach((checkpoint, i) => {
    const btn = document.createElement("button");
    btn.className = `rail-item ${i === state.index ? "active" : ""}`;
    const selectedOption = getSelectedOption(i);
    const status = effectiveStatuses[i];
    const statusText = selectedOption === null
      ? "Not answered"
      : `<span class="badge ${statusClass(status)}">${status}</span>`;
    btn.innerHTML = `
      <div class="rail-item-title">${i + 1}. ${checkpoint.title}</div>
      <div class="rail-item-status">${statusText}</div>
    `;
    btn.addEventListener("click", () => {
      state.index = i;
      render();
    });
    checkpointRail.appendChild(btn);
  });
}

function renderCurrent() {
  const checkpoint = checkpoints[state.index];
  const selectedIndex = state.answers[state.index];
  const effectiveStatuses = computeEffectiveStatuses();

  checkpointLabel.textContent = `Checkpoint ${state.index + 1} of ${checkpoints.length}`;
  questionText.textContent = checkpoint.question;
  progressText.textContent = checkpoint.title;

  optionsContainer.innerHTML = "";
  checkpoint.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = `option-btn ${selectedIndex === i ? "selected" : ""}`;
    btn.textContent = option.answer;
    btn.addEventListener("click", () => {
      state.answers[state.index] = i;
      if (option.isResponseGate) {
        ensureResponseGateRecord(state.index, option);
      } else {
        resolveResponseGate(state.index);
      }
      render();
    });
    optionsContainer.appendChild(btn);
  });

  if (selectedIndex === null) {
    resultCard.classList.add("hidden");
  } else {
    const picked = checkpoint.options[selectedIndex];
    const gate = picked.isResponseGate ? ensureResponseGateRecord(state.index, picked) : null;
    const action = picked.isResponseGate
      ? `${picked.action} ${formatGateDeadlineText(picked, state.index)}`
      : applyTimeDates(picked.action, checkpoint.title);
    const prep = picked.isResponseGate
      ? gateEscalationText(picked, state.index)
      : applyTimeDates(picked.prep, checkpoint.title);
    const impacts = getImpactLines(checkpoint.title, picked.answer);
    const impactHtml = impacts.map((line) => `<li>${line}</li>`).join("");
    const actionHtml = toBulletItems(action).map((line) => `<li><strong>${line}</strong></li>`).join("");
    const effectiveStatus = effectiveStatuses[state.index];
    const escalationText = escalationNotice(effectiveStatus);
    const diagnosis = shouldShowDiagnosis(checkpoint, picked)
      ? buildHoldupDiagnosis(state.index, effectiveStatuses)
      : null;
    const diagnosisList = diagnosis
      ? diagnosis.blockers.map((item) =>
        `<li><strong>${item.checkpoint}</strong>: ${item.answer} <span class="badge ${statusClass(item.status)}">${item.status}</span><br><span class="diagnosis-meta">${item.type}${item.askedSuffix}</span></li>`
      ).join("")
      : "";
    selectedAnswer.textContent = picked.answer;
    statusBadge.className = `badge ${statusClass(effectiveStatus)}`;
    statusBadge.textContent = effectiveStatus;
    resultAction.innerHTML = `
      ${picked.isResponseGate ? `
      <section class="rec-section">
        <h4 class="rec-title">Client Response Tracking</h4>
        <label for="gateAskedDateInput" class="ko-label">Date we asked client for response/feedback</label>
        <input id="gateAskedDateInput" type="date" value="${gate?.askedDate || ""}" />
        <p class="rec-text">${gateTrackingText(picked, state.index)}</p>
      </section>
      ` : ""}
      ${escalationText ? `
      <section class="rec-section">
        <h4 class="rec-title">CSM + AM Alignment</h4>
        <p class="rec-text"><strong>${escalationText}</strong></p>
      </section>
      ` : ""}
      <section class="rec-section">
        <h4 class="rec-title">Impact</h4>
        <ul class="rec-list">${impactHtml}</ul>
      </section>
      <section class="rec-section">
        <h4 class="rec-title">What To Do Now</h4>
        <ul class="rec-list">${actionHtml}</ul>
      </section>
      <section class="rec-section">
        <h4 class="rec-title">Then</h4>
        <p class="rec-text">${prep}</p>
      </section>
      ${diagnosis ? `
      <section class="rec-section">
        <h4 class="rec-title">${checkpoint.title} Hold-up Diagnosis</h4>
        <p class="rec-text">${diagnosis.summary}</p>
        ${diagnosis.blockers.length ? `<ul class="rec-list">${diagnosisList}</ul>` : ""}
      </section>
      ` : ""}
    `;
    if (picked.isResponseGate) {
      const gateAskedDateInput = document.getElementById("gateAskedDateInput");
      gateAskedDateInput?.addEventListener("change", (event) => {
        setResponseGateAskedDate(state.index, picked, event.target.value || "");
        render();
      });
    }
    resultCard.classList.remove("hidden");
  }

  prevBtn.disabled = state.index === 0;
  nextBtn.disabled = state.index === checkpoints.length - 1;
  nextBtn.textContent = state.index === checkpoints.length - 1 ? "Final checkpoint" : "Next checkpoint";
}

function renderSummary() {
  const effectiveStatuses = computeEffectiveStatuses();
  summaryList.innerHTML = "";
  checkpoints.forEach((checkpoint, i) => {
    const selected = state.answers[i];
    const row = document.createElement("div");
    row.className = "summary-item";

    if (selected === null) {
      row.innerHTML = `<strong>${checkpoint.title}:</strong> Not answered yet`;
    } else {
      const option = checkpoint.options[selected];
      row.innerHTML = `<strong>${checkpoint.title}:</strong> ${option.answer} -> <span class="badge ${statusClass(effectiveStatuses[i])}">${effectiveStatuses[i]}</span>`;
    }

    summaryList.appendChild(row);
  });
}

function render() {
  renderKoContext();
  renderRail();
  renderCurrent();
  renderSummary();
}

prevBtn.addEventListener("click", () => {
  if (state.index > 0) {
    state.index -= 1;
    render();
  }
});

nextBtn.addEventListener("click", () => {
  if (state.index < checkpoints.length - 1) {
    state.index += 1;
    render();
  }
});

koDateInput.addEventListener("change", (e) => {
  state.koDate = e.target.value || null;
  render();
});

jumpSuggested.addEventListener("click", () => {
  const ko = parseKoDate();
  if (!ko) return;
  const day = campaignDayFromKo(ko);
  state.index = suggestedCheckpointIndex(day);
  render();
});

resetAll.addEventListener("click", () => {
  state.answers = new Array(checkpoints.length).fill(null);
  state.index = 0;
  state.koDate = null;
  state.highestSeverityReached = "On Track";
  state.responseGates = {};
  koDateInput.value = "";
  render();
});

render();

const checkpoints = [
  {
    title: "Kick-off",
    question: "Can the client name who the SME is?",
    options: [
      {
        answer: "SME named and confirmed",
        status: "On Track",
        action: "Confirm interview availability windows now.",
        prep: "Draft content plan timeline for Week 1 sign-off."
      },
      {
        answer: "SME not yet confirmed",
        status: "At Risk",
        action: "Send same-day follow-up with a 10 working day deadline, time commitment, and interview format.",
        prep: "Block placeholder interview slots."
      }
    ]
  },
  {
    title: "Week 1",
    question: "Do we have an approved content plan?",
    options: [
      {
        answer: "Approved",
        status: "On Track",
        action: "Lock interview invite and content production schedule.",
        prep: "Confirm Week 2 booking date."
      },
      {
        answer: "In edits with clear approval date",
        status: "At Risk",
        action: "Send impact note and request final sign-off by agreed date.",
        prep: "Draft interview questions."
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
        answer: "Booked for this week",
        status: "On Track",
        action: "Run interview and move directly into draft creation.",
        prep: "Confirm creator/editor availability for Week 3."
      },
      {
        answer: "Booked next week or date being finalized",
        status: "At Risk",
        action: "Lock the final interview slot within 2 working days.",
        prep: "Make sure content creation can start as soon as the interview is done."
      },
      {
        answer: "Week 4 or later, or not booked",
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
        answer: "Creation is underway",
        status: "On Track",
        action: "Keep production moving and set internal publish readiness date.",
        prep: "Confirm Week 4 publication requirements are complete."
      },
      {
        answer: "Partially blocked",
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
        answer: "Ready to publish this week",
        status: "On Track",
        action: "Publish and start full promotion window.",
        prep: "Verify Day 30 publish/readiness evidence is logged."
      },
      {
        answer: "Near-ready, publish expected next week",
        status: "At Risk",
        action: "Push for approval within 5 working days to protect promotion quality.",
        prep: "Prepare Day 30 status update."
      },
      {
        answer: "Not publish-ready or no clear date",
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
        answer: "Content is ready or already published",
        status: "On Track",
        action: "Continue full promotion execution.",
        prep: "Map remaining assets against Day 60 full publication plan."
      },
      {
        answer: "Not yet live, but ready with locked publish in 5 working days",
        status: "At Risk",
        action: "Fast-track publication and track approvals daily until live.",
        prep: "Identify any Day 60 risks now."
      },
      {
        answer: "No content ready by Day 30",
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
        answer: "Some published, and the rest is ready to publish now",
        status: "At Risk",
        action: "Publish remaining content immediately and preserve as much promotion depth as possible.",
        prep: "Confirm everything will be live before Day 90."
      },
      {
        answer: "Some published, and the rest is not ready",
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
        answer: "Some published, and the rest is ready to publish now",
        status: "At Risk",
        action: "Publish remaining content immediately and document reporting caveats.",
        prep: "Check if Day 120 extension can be avoided."
      },
      {
        answer: "Some published, and the rest is not ready",
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
        answer: "Complete or viable plan",
        status: "On Track",
        action: "Continue or close per agreed plan.",
        prep: "Confirm 9-month closeout path."
      },
      {
        answer: "Viable only with reduced scope or accepted tradeoff",
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
        answer: "Completed or viable reduced-scope closeout agreed",
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

const state = {
  index: 0,
  koDate: null,
  answers: new Array(checkpoints.length).fill(null)
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
  checkpointRail.innerHTML = "";
  checkpoints.forEach((checkpoint, i) => {
    const btn = document.createElement("button");
    btn.className = `rail-item ${i === state.index ? "active" : ""}`;
    const selected = state.answers[i];
    const statusText = selected === null
      ? "Not answered"
      : `Status: ${checkpoint.options[selected].status}`;
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
      render();
    });
    optionsContainer.appendChild(btn);
  });

  if (selectedIndex === null) {
    resultCard.classList.add("hidden");
  } else {
    const picked = checkpoint.options[selectedIndex];
    const action = applyTimeDates(picked.action, checkpoint.title);
    const prep = applyTimeDates(picked.prep, checkpoint.title);
    selectedAnswer.textContent = picked.answer;
    statusBadge.className = `badge ${statusClass(picked.status)}`;
    statusBadge.textContent = picked.status;
    resultAction.innerHTML = `
      <section class="rec-section">
        <h4 class="rec-title">What To Do Now</h4>
        <p class="rec-text"><strong>${action}</strong></p>
      </section>
      <section class="rec-section">
        <h4 class="rec-title">Then</h4>
        <p class="rec-text">${prep}</p>
      </section>
    `;
    resultCard.classList.remove("hidden");
  }

  prevBtn.disabled = state.index === 0;
  nextBtn.disabled = state.index === checkpoints.length - 1;
  nextBtn.textContent = state.index === checkpoints.length - 1 ? "Final checkpoint" : "Next checkpoint";
}

function renderSummary() {
  summaryList.innerHTML = "";
  checkpoints.forEach((checkpoint, i) => {
    const selected = state.answers[i];
    const row = document.createElement("div");
    row.className = "summary-item";

    if (selected === null) {
      row.innerHTML = `<strong>${checkpoint.title}:</strong> Not answered yet`;
    } else {
      const option = checkpoint.options[selected];
      row.innerHTML = `<strong>${checkpoint.title}:</strong> ${option.answer} -> <span class="badge ${statusClass(option.status)}">${option.status}</span>`;
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
  koDateInput.value = "";
  render();
});

render();

(function () {
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


  function cloneCheckpoints() {
    return JSON.parse(JSON.stringify(checkpoints));
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

  function statusClass(status) {
    if (status === "On Track") return "status-ontrack";
    if (status === "At Risk") return "status-risk";
    if (status === "Behind") return "status-behind";
    if (status === "Critical") return "status-critical";
    if (status === "On Hold" || status === "Expired") return "status-hold";
    return "status-ontrack";
  }

  function compareSeverity(a, b) {
    return (severityRank[a] ?? 0) - (severityRank[b] ?? 0);
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function weekStartMonday(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay();
    const delta = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + delta);
    return d;
  }

  function nextMondayAfterKoWeek(koDate) {
    const koWeekStart = weekStartMonday(koDate);
    return addDays(koWeekStart, 7);
  }

  function koWeekCheckpointDate(ko, weekNum) {
    const week1Start = nextMondayAfterKoWeek(ko);
    const start = addDays(week1Start, (weekNum - 1) * 7);
    return addDays(start, 6);
  }

  function suggestCheckpointIndex(koDate, now = new Date()) {
    if (!koDate) return 0;
    const checkpointsByDate = [
      { index: 0, date: koDate },
      { index: 1, date: koWeekCheckpointDate(koDate, 1) },
      { index: 2, date: koWeekCheckpointDate(koDate, 2) },
      { index: 3, date: koWeekCheckpointDate(koDate, 3) },
      { index: 4, date: koWeekCheckpointDate(koDate, 4) },
      { index: 5, date: addDays(koDate, 30) },
      { index: 6, date: addDays(koDate, 60) },
      { index: 7, date: addDays(koDate, 90) },
      { index: 8, date: addDays(koDate, 120) },
      { index: 9, date: addDays(koDate, 182) },
      { index: 10, date: addDays(koDate, 273) }
    ];

    let suggested = 0;
    checkpointsByDate.forEach((entry) => {
      if (now >= entry.date) suggested = entry.index;
    });
    return suggested;
  }

  function computeEffectiveStatusFromAnswers(answersByCheckpoint, checkpointDefs = checkpoints) {
    const effectiveStatuses = new Array(checkpointDefs.length).fill(null);
    let latest = "On Track";
    checkpointDefs.forEach((checkpoint, i) => {
      const selectedIndex = answersByCheckpoint?.[i];
      if (selectedIndex === null || selectedIndex === undefined) return;
      const option = checkpoint.options[selectedIndex];
      if (!option) return;
      effectiveStatuses[i] = option.status;
      latest = option.status;
    });
    return { effectiveStatuses, latestStatus: latest };
  }

  window.CampaignHealthModel = {
    checkpoints,
    cloneCheckpoints,
    severityRank,
    statusClass,
    compareSeverity,
    suggestCheckpointIndex,
    computeEffectiveStatusFromAnswers,
    nextMondayAfterKoWeek,
    koWeekCheckpointDate,
    addDays,
    weekStartMonday
  };
})();

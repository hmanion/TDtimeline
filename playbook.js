const triggers = [
  {
    title: "Lack of client response to content plan or article/video drafts",
    trigger: "No client sign-off or feedback 5 working days after document/link is sent.",
    status: "At Risk",
    impact: [
      "Campaign cannot progress",
      "Publication is delayed",
      "Promotion window is shorter: reduced reach and performance"
    ],
    actions: [
      { text: "Day 5: CSM sends nudge email (Status: At Risk)", roles: ["CSM"] },
      { text: "Day 7: CSM sends impact email", roles: ["CSM"] },
      { text: "Day 10: Update timeline and share with client", roles: ["CSM"] },
      { text: "Status becomes Behind (Client blocked)", roles: [] },
      { text: "Make notes that promotion will be reduced", roles: [] },
      { text: "Adjust expectations for benchmarks", roles: [] }
    ]
  },
  {
    title: "No SME confirmed",
    trigger: "Client can’t name an SME in the KO/planning call",
    status: "At Risk",
    impact: [
      "Won’t be able to schedule interview",
      "Timeline for drafts will be at risk",
      "Risk to promotion window"
    ],
    actions: [
      { text: "CSM asks for a decision within 10 working days or promotion window will begin to shrink", roles: ["CSM"] },
      { text: "Provide time commitment (50 minutes) and interview format", roles: ["CSM"] },
      { text: "Email client after KO/planning call", roles: ["CSM"] },
      { text: "Reiterate time commitment and format", roles: ["CSM"] },
      { text: "Explain impact of delay", roles: ["CSM"] },
      { text: "Provide clear decision deadline (10 days)", roles: ["CSM"] },
      { text: "Raise alternatives such as articles only/written interview", roles: [] }
    ]
  },
  {
    title: "Late/no/uncertain SME availability",
    trigger: "No SME availability after first 3 weeks",
    status: "Behind",
    impact: [
      "Original timeline is no longer feasible",
      "Promotion window is being eaten into and will be shorter"
    ],
    actions: [
      { text: "Email client with updated timeline", roles: ["CSM"] },
      { text: "Ask for confirmation that they accept the shorter promotion window", roles: ["CSM"] },
      { text: "Require decision on alternatives such as articles only/written interview", roles: [] },
      { text: "Make notes that promotion will be reduced", roles: [] }
    ]
  }
];

const timeline = [
  {
    title: "Day 30 Content Checkpoint",
    trigger: "No content ready to publish by day 30",
    status: "Behind",
    impact: [
      "Promotion window is being eaten into and will be shorter",
      "Risk to reach and performance",
      "May not hit benchmarks"
    ],
    actions: [
      { text: "Email client", roles: ["CSM"] },
      { text: "Full promotion may no longer be possible", roles: [] },
      { text: "Impact will be reflected in reporting", roles: [] },
      { text: "Provide clear decision deadline", roles: ["CSM"] },
      { text: "Internal review with CC and AM of what is blocking campaign", roles: ["CC", "AM"] }
    ]
  },
  {
    title: "Day 60 Promotion Checkpoint",
    options: [
      {
        label: "Some content published",
        trigger: "Not all content is ready to publish by day 60",
        status: "Behind",
        impact: [
          "Remaining content will not receive full promotion",
          "Overall campaign reach will be reduced"
        ],
        actions: [
          { text: "No new work to be started", roles: [] },
          { text: "Email client", roles: ["CSM"] },
          { text: "If content can be approved in next 5 days, minimal impact on reporting", roles: [] },
          { text: "Make note to adjust reporting expectations", roles: [] }
        ]
      },
      {
        label: "No content published",
        trigger: "No content published by day 60",
        status: "Critical",
        impact: [
          "Only 30 days left in promotion window",
          "Reduced reach and performance",
          "Comprehensive report is at risk"
        ],
        actions: [
          { text: "No new work to start", roles: [] },
          { text: "Email client", roles: ["CSM"] },
          { text: "If content can be approved in next 5 days, we can move forward", roles: [] },
          { text: "Final window to preserve reporting quality for a comprehensive report", roles: [] }
        ]
      }
    ]
  },
  {
    title: "Day 90 Reporting Checkpoint",
    options: [
      {
        label: "Some content published",
        trigger: "Not all content ready to publish by day 90",
        status: "Behind",
        impact: [
          "Not able to promote all content",
          "Performance will be below benchmark"
        ],
        actions: [
          { text: "No new work to start", roles: [] },
          { text: "Email client", roles: ["CSM"] },
          { text: "Need approval on remaining content within 5 working days", roles: ["CSM"] },
          { text: "Report should explicitly mention delays", roles: [] }
        ]
      },
      {
        label: "No content published",
        trigger: "No content ready to publish by day 90",
        status: "Critical",
        impact: [
          "Promotion no longer possible",
          "Comprehensive report not viable",
          "Will begin to impact other quarters and commitments to other clients"
        ],
        actions: [
          { text: "No new work to start", roles: [] },
          { text: "Email client", roles: ["CSM"] },
          { text: "We can hold space in publishing schedule but will be unable to continue work beyond midpoint of next quarter", roles: [] },
          { text: "Provide clear decision deadline: 5 working days", roles: ["CSM"] }
        ]
      }
    ]
  },
  {
    title: "Day 120 Extension Checkpoint",
    options: [
      {
        label: "Campaign completed",
        trigger: "Campaign deliverables are already complete by day 120",
        status: "On Track",
        impact: [
          "No extension is required"
        ],
        actions: [
          { text: "Close campaign and archive outcomes", roles: ["CSM"] },
          { text: "Confirm no further checkpoint actions are required", roles: [] }
        ]
      },
      {
        label: "Decision pending",
        trigger: "Day 120 reached and extension decision is still pending",
        status: "On Hold",
        impact: [
          "Work remains paused pending a client decision"
        ],
        actions: [
          { text: "Pause execution", roles: [] },
          { text: "Send binary decision deadline to client", roles: ["CSM"] },
          { text: "Prepare quarter-impact scenarios", roles: ["AM", "CSM"] }
        ]
      },
      {
        label: "Sacrifice future quarter",
        trigger: "Client chooses to sacrifice a future quarter to continue",
        status: "Behind",
        impact: [
          "Current campaign continues, but future quarter capacity is reduced"
        ],
        actions: [
          { text: "Update timeline and require client confirmation of the tradeoff", roles: ["CSM"] },
          { text: "Record decision and set 6-month viability review criteria", roles: ["AM", "CSM"] }
        ]
      },
      {
        label: "Scrap this quarter",
        trigger: "Client chooses to scrap this quarter",
        status: "Expired",
        impact: [
          "Remaining quarter work is stopped and closed"
        ],
        actions: [
          { text: "Stop remaining quarter work", roles: [] },
          { text: "Close with documented scope loss and next-quarter restart conditions", roles: ["CSM", "AM"] }
        ]
      },
      {
        label: "No response by deadline",
        trigger: "No client response by the decision deadline",
        status: "On Hold",
        impact: [
          "Campaign remains paused and unresolved"
        ],
        actions: [
          { text: "Keep campaign on hold", roles: [] },
          { text: "Escalate commercially via AM owner", roles: ["AM"] },
          { text: "Carry unresolved status into 6-month checkpoint", roles: ["CSM"] }
        ]
      }
    ]
  },
  {
    title: "6 Month + 9 Month Checkpoints",
    trigger: "Campaign is at least one quarter behind at 6+ months",
    status: "Critical",
    impact: [
      "Campaign completion is no longer achievable without harming on-track campaigns"
    ],
    actions: [
      { text: "Requires input from AM", roles: ["AM"] },
      { text: "Explain to client", roles: ["CSM"] },
      { text: "Unable to catch up with campaign", roles: [] },
      { text: "No longer able to prioritise without impacting on-track campaigns", roles: [] },
      { text: "Loss of a quarter of content", roles: [] },
      { text: "Provide clear decision deadline", roles: ["CSM"] }
    ]
  }
];

const roleFilter = document.getElementById("roleFilter");
const statusBar = document.getElementById("statusBar");
const searchInput = document.getElementById("searchInput");
let statusState = "all";

function statusBadge(status) {
  const cls = status === "Critical"
    ? "status-critical"
    : status === "Behind"
      ? "status-behind"
      : status === "On Hold" || status === "Expired"
        ? "status-hold"
      : status === "At Risk"
          ? "status-risk"
          : "status-ontrack";
  return `<span class="badge ${cls}">${status}</span>`;
}

function renderTriggerList() {
  const list = document.getElementById("triggerList");
  const query = searchInput.value.toLowerCase();
  const status = statusState;
  list.innerHTML = "";

  const filtered = triggers.filter(item => {
    const matchesStatus = status === "all" || item.status === status;
    const matchesQuery = !query || [item.title, item.trigger, item.status].some(text => text.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "trigger-button";

    const actions = item.actions.map(action => {
      const match = roleFilter.value === "all" || action.roles.includes(roleFilter.value) || action.roles.length === 0;
      const roleTags = action.roles.length ? action.roles.map(r => `<span class="role-tag">${r}</span>`).join("") : "";
      return `<div class="${match ? "" : "role-dim"}">• ${action.text}${roleTags}</div>`;
    }).join("");

    const impacts = item.impact.map(point => `<div>• ${point}</div>`).join("");

    card.innerHTML = `
      <div class="detail-title">${item.title}</div>
      ${statusBadge(item.status)}
      <div class="detail-section"><strong>Trigger</strong> ${item.trigger}</div>
      <div class="trigger-body">
        <div class="detail-section"><strong>Impact</strong>${impacts}</div>
        <div class="detail-section"><strong>Actions</strong>${actions}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".trigger-button").forEach(el => {
        if (el !== card) {
          el.classList.remove("is-open");
        }
      });
      card.classList.toggle("is-open");
    });

    list.appendChild(card);
  });

  if (filtered.length === 0) {
    list.innerHTML = "<div class=\"placeholder\">No triggers match your filters.</div>";
  }
}

function renderTimeline() {
  const container = document.getElementById("timelineContainer");
  container.innerHTML = "";
  const role = roleFilter.value;
  const status = statusState;

  timeline.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.className = "timeline-item";

    if (item.options) {
      const hasMatchingOption = status === "all" || item.options.some(option => option.status === status);
      if (!hasMatchingOption) {
        return;
      }
      const initialOption = status === "all"
        ? item.options[0]
        : item.options.find(option => option.status === status) || item.options[0];

      const optionButtons = item.options.map(option => `
        <button class="option-button ${option.label === initialOption.label ? "active" : ""}" data-label="${option.label}">
          ${option.label}
        </button>
      `).join("");

      wrapper.innerHTML = `
        <h3>${item.title}</h3>
        <div class="option-toggle">${optionButtons}</div>
        <div class="option-panel"></div>
        <div class="timeline-body"></div>
      `;

      const panel = wrapper.querySelector(".option-panel");
      const body = wrapper.querySelector(".timeline-body");
      const buttons = wrapper.querySelectorAll(".option-button");

      function renderOption(option) {
        if (status !== "all" && option.status !== status) {
          panel.innerHTML = "";
          body.innerHTML = "<div class=\"placeholder\">No options match the selected status filter.</div>";
          return;
        }

        const actions = option.actions.map(action => {
          const match = role === "all" || action.roles.includes(role) || action.roles.length === 0;
          const roleTags = action.roles.length ? action.roles.map(r => `<span class="role-tag">${r}</span>`).join("") : "";
          return `<div class="${match ? "" : "role-dim"}">• ${action.text}${roleTags}</div>`;
        }).join("");

        const impacts = option.impact.map(point => `<div>• ${point}</div>`).join("");

        panel.innerHTML = `
          ${statusBadge(option.status)}
          <div class="detail-section"><strong>Trigger</strong> ${option.trigger}</div>
        `;
        body.innerHTML = `
          <div class="detail-section"><strong>Impact</strong>${impacts}</div>
          <div class="detail-section"><strong>Actions</strong>${actions}</div>
        `;
      }

      renderOption(initialOption);

      buttons.forEach(button => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          buttons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
          const selected = item.options.find(option => option.label === button.dataset.label);
          if (selected) {
            renderOption(selected);
          }
        });
      });
    } else {
      if (status !== "all" && item.status !== status) {
        return;
      }

      const actions = item.actions.map(action => {
        const match = role === "all" || action.roles.includes(role) || action.roles.length === 0;
        const roleTags = action.roles.length ? action.roles.map(r => `<span class="role-tag">${r}</span>`).join("") : "";
        return `<div class="${match ? "" : "role-dim"}">• ${action.text}${roleTags}</div>`;
      }).join("");

      const impacts = item.impact.map(point => `<div>• ${point}</div>`).join("");

      wrapper.innerHTML = `
        <h3>${item.title}</h3>
        ${statusBadge(item.status)}
        <div class="detail-section"><strong>Trigger</strong> ${item.trigger}</div>
        <div class="timeline-body">
          <div class="detail-section"><strong>Impact</strong>${impacts}</div>
          <div class="detail-section"><strong>Actions</strong>${actions}</div>
        </div>
      `;
    }

    wrapper.addEventListener("click", () => {
      document.querySelectorAll(".timeline-item").forEach(itemEl => {
        if (itemEl !== wrapper) {
          itemEl.classList.remove("is-open");
        }
      });
      wrapper.classList.toggle("is-open");
    });

    container.appendChild(wrapper);
  });
}

roleFilter.addEventListener("change", () => {
  renderTriggerList();
  renderTimeline();
});
searchInput.addEventListener("input", renderTriggerList);
statusBar.addEventListener("click", (event) => {
  const target = event.target.closest(".status-chip");
  if (!target) return;
  statusState = target.dataset.status || "all";
  statusBar.querySelectorAll(".status-chip").forEach(btn => btn.classList.remove("active"));
  target.classList.add("active");
  renderTriggerList();
  renderTimeline();
});

renderTriggerList();
renderTimeline();

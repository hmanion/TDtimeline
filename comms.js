const escalation = [
  {
    title: "On Track → At Risk",
    label: "Nudge / Information",
    guidance: "Help the client succeed without feeling pressure."
  },
  {
    title: "At Risk → Behind",
    label: "Impact Warning",
    guidance: "Let the client know they need to choose between two outcomes. A sanity check from AM/CC is helpful."
  },
  {
    title: "Behind → Critical",
    label: "Decision Required",
    guidance: "Require a decision to protect the client’s interest while preserving trust. You must get a sanity check from AM before sending."
  },
  {
    title: "Critical → On Hold",
    label: "Commercial",
    guidance: "Lay the options out for future progress. You must have a conversation with the AM and agree who the message comes from."
  }
];

const guidedSections = [
  {
    key: "empathy",
    title: "1 – Empathy",
    details: [
      "Acknowledge reality without blaming or taking the blame",
      "Frame it as your understanding",
      "Avoid saying “You haven’t done X”",
      "Avoid apologising for things outside of your control"
    ],
    example: "I know this has been tricky to line up internally.",
    placeholder: "I know this has been tricky to line up internally..."
  },
  {
    key: "status",
    title: "2 – Explicit Status Update",
    details: [
      "Clearly state the campaign status using our language",
      "Avoid ambiguity",
      "Make it clear what we mean by “at risk”"
    ],
    example: "At the moment, the campaign is at risk of falling behind.",
    placeholder: "At the moment, the campaign is at risk of falling behind...",
    template: "status"
  },
  {
    key: "cause",
    title: "3 – Neutral Cause",
    details: [
      "Tie the status directly to the trigger from the policy",
      "State facts",
      "Frame it from our perspective – “we haven’t received”"
    ],
    example: "We haven’t had sign-off on the draft we sent on X.",
    placeholder: "We haven't had sign-off on the draft we sent on...",
    template: "cause"
  },
  {
    key: "impact",
    title: "4 – Impact",
    details: [
      "Always link the delay to practical consequences",
      "Shorter promotion window",
      "Reduced reach / performance",
      "Reporting depth and knock-on impacts"
    ],
    example: "This shortens the promotion window and reduces reach and performance.",
    placeholder: "This shortens the promotion window and reduces reach...",
    template: "impact"
  },
  {
    key: "nextStep",
    title: "5 – Next Step + Clear Decision Deadline",
    details: [
      "Give a binary choice with a clear date",
      "If we can do X by Y, then Z can happen",
      "If not, we will do the alternate option",
      "Decisions should feel inevitable, not emotional"
    ],
    example: "If we can get sign-off by March 15, we can still promote your content for a full 30 days. If not, we’ll proceed with a shorter promotion window.",
    placeholder: "If we can [do something] by [this date], [something can happen]. If not, [we will do something else].",
    template: "decision"
  }
];

const principles = [
  "Status language should never surprise the client.",
  "Decisions should feel inevitable, not emotional.",
  "Status updates should remain simple and predictable.",
  "Use our status language consistently and tie it to the policy triggers."
];

const impactBuckets = [
  {
    key: "progress",
    label: "Progress & Schedule",
    items: [
      "The campaign cannot progress until we have approval or input.",
      "Publication will be delayed.",
      "The original timeline is no longer feasible.",
      "Draft timelines will be at risk.",
      "We won’t be able to schedule the interview yet."
    ]
  },
  {
    key: "promotion",
    label: "Promotion Window",
    items: [
      "The promotion window is at risk.",
      "The promotion window will be shorter, reducing reach and performance.",
      "The promotion window is being eaten into and will be shorter.",
      "Only 30 days remain in the promotion window.",
      "Remaining content will not receive full promotion.",
      "Promotion is no longer possible."
    ]
  },
  {
    key: "performance",
    label: "Performance & Benchmarks",
    items: [
      "Reach and performance will be reduced.",
      "Overall campaign reach will be reduced.",
      "We may not hit benchmarks.",
      "Performance will be below benchmark.",
      "We won’t be able to promote all content."
    ]
  },
  {
    key: "reporting",
    label: "Reporting Impact",
    items: [
      "The comprehensive report is at risk.",
      "A comprehensive report is no longer viable.",
      "Reporting depth will be reduced."
    ]
  },
  {
    key: "portfolio",
    label: "Portfolio & Knock-On Effects",
    items: [
      "This will create knock-on impacts to lead gen or later quarters.",
      "We can’t prioritise this work without harming on-track campaigns.",
      "Campaign completion is no longer achievable without harming on-track campaigns.",
      "We will lose a quarter of content."
    ]
  }
];

const neutralCauseOptions = [
  "We haven’t received sign-off or feedback on the content plan we sent on [date].",
  "We haven’t received a client response/sign-off by the agreed deadline.",
  "We haven’t received feedback on the draft we shared on [date].",
  "We don’t yet have confirmation of SME availability.",
  "We haven’t received interview booking confirmation by the agreed deadline.",
  "We haven’t been able to schedule the SME interview yet.",
  "No content is ready to publish by day 30.",
  "Not all content is ready to publish by day 60.",
  "No content has been published by day 60.",
  "Not all content is ready to publish by day 90.",
  "No content is ready to publish by day 90.",
  "We are now 120 days into the campaign without all content published.",
  "We haven’t received a commercial decision by the agreed 5 working day deadline."
];

const guidedFields = document.getElementById("guidedFields");

function renderEscalation() {
  const container = document.getElementById("escalationSteps");
  container.innerHTML = escalation.map(step => `
    <div class="escalation-step">
      <div class="escalation-header">
        <div>
          <div class="escalation-title">${step.title}</div>
          <div class="badge status-risk">${step.label}</div>
        </div>
      </div>
      <div class="escalation-body">
        <p>${step.guidance}</p>
      </div>
    </div>
  `).join("");
}

function renderGuidedFields() {
  guidedFields.innerHTML = guidedSections.map(section => {
    const detailLines = section.details.map(line => `• ${line}`).join("<br>");
    const textareaId = `${section.key}Input`;
    let templateControls = "";
    if (section.template === "status") {
      templateControls = `
        <div class="inline-controls">
          <select id="statusTemplate">
            <option value="">Insert status template…</option>
            <option value="At the moment, the campaign is at risk of falling behind.">At Risk</option>
            <option value="This now puts the quarter behind schedule.">Behind</option>
            <option value="The campaign is now at a critical status where we require input to ensure you can still get value.">Critical</option>
            <option value="The campaign is currently on hold pending a decision on next steps.">On Hold</option>
          </select>
          <button class="ghost" id="insertStatus">Insert</button>
        </div>
      `;
    }
    if (section.template === "cause") {
      templateControls = `
        <div class="inline-controls">
          <select id="causeTemplate">
            <option value="">Select neutral cause…</option>
            ${neutralCauseOptions.map(item => `<option value="${item}">${item}</option>`).join("")}
          </select>
          <button class="ghost" id="insertCause">Insert</button>
        </div>
      `;
    }
    if (section.template === "impact") {
      templateControls = `
        <div class="inline-controls">
          <div class="bucket-group" id="impactBuckets">
            ${impactBuckets.map(bucket => `
              <label class="bucket-option">
                <input type="checkbox" value="${bucket.key}" checked />
                ${bucket.label}
              </label>
            `).join("")}
          </div>
          <select id="impactTemplate">
            <option value="">Select impact…</option>
          </select>
          <button class="ghost" id="addImpact">Add</button>
        </div>
      `;
    }
    if (section.template === "decision") {
      templateControls = `
        <div class="decision-grid">
          <div class="field-group">
            <label>Action (verb phrase)</label>
            <input id="decisionAction" type="text" placeholder="get sign-off" />
          </div>
          <div class="field-group">
            <label>Date (no 'by')</label>
            <input id="decisionDate" type="text" placeholder="12 May" />
          </div>
          <div class="field-group">
            <label>Outcome (no period)</label>
            <input id="decisionOutcome" type="text" placeholder="we can promote for the full 30 days" />
          </div>
          <div class="field-group">
            <label>Fallback (no period)</label>
            <input id="decisionFallback" type="text" placeholder="we will proceed with a shorter promotion window" />
          </div>
          <button class="ghost" id="insertDecision">Insert sentence</button>
        </div>
      `;
    }
    return `
      <div class="guided-block" data-key="${section.key}">
        <div class="guided-header">
          <div class="guided-title">${section.title}</div>
        </div>
        <div class="guided-body">
          <div class="guided-notes">${detailLines}</div>
          <div class="guided-example"><em>Example:</em> ${section.example}</div>
          ${templateControls}
          <textarea id="${textareaId}" rows="2" placeholder="${section.placeholder}"></textarea>
          <button class="ghost next-button" data-next="${section.key}">Next</button>
        </div>
      </div>
    `;
  }).join("") + `<button class="primary" id="buildEmail">Build Email</button>`;
}

function renderPrinciples() {
  const container = document.getElementById("principles");
  container.innerHTML = principles.map((line, index) => `
    <div class="principle-item">
      <div class="principle-index">${index + 1}</div>
      <div class="principle-text">${line}</div>
    </div>
  `).join("");
}

function renderImpactTemplates() {
  const impactTemplate = document.getElementById("impactTemplate");
  const selectedBuckets = Array.from(document.querySelectorAll("#impactBuckets input:checked"))
    .map(input => input.value);

  const filtered = impactBuckets
    .filter(bucket => selectedBuckets.includes(bucket.key))
    .flatMap(bucket => bucket.items);

  impactTemplate.innerHTML = "<option value=\"\">Select impact…</option>";
  filtered.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    impactTemplate.appendChild(option);
  });
}

function appendToTextarea(textarea, text) {
  const current = textarea.value.trim();
  textarea.value = current ? `${current}\n${text}` : text;
}

function normalizeClause(text) {
  return text.trim().replace(/[.]+$/g, "");
}

function normalizeDate(text) {
  return text.trim().replace(/^by\\s+/i, "");
}

function ensureStartsWith(text, prefix) {
  return text.toLowerCase().startsWith(prefix.toLowerCase())
    ? text
    : `${prefix} ${text}`;
}

function buildEmail() {
  const empathy = document.getElementById("empathyInput").value.trim();
  const status = document.getElementById("statusInput").value.trim();
  const cause = document.getElementById("causeInput").value.trim();
  const impact = document.getElementById("impactInput").value.trim();
  const nextStep = document.getElementById("nextStepInput").value.trim();

  const sections = [empathy, status, cause, impact, nextStep].filter(Boolean);
  document.getElementById("emailOutput").textContent = sections.length
    ? sections.join("\n\n")
    : "Fill the fields to generate a draft email.";
}

function copyEmail() {
  const text = document.getElementById("emailOutput").textContent;
  if (!text || text.startsWith("Fill the fields")) return;
  navigator.clipboard.writeText(text);
}

renderEscalation();
renderGuidedFields();
renderPrinciples();
renderImpactTemplates();
document.querySelectorAll("#impactBuckets input").forEach(input => {
  input.addEventListener("change", renderImpactTemplates);
});

const escalationItems = Array.from(document.querySelectorAll(".escalation-step"));
function openEscalation(index) {
  escalationItems.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add("is-open");
    } else {
      item.classList.remove("is-open");
    }
  });
}
escalationItems.forEach((item, index) => {
  const header = item.querySelector(".escalation-header");
  header.addEventListener("click", () => openEscalation(index));
});
openEscalation(0);

const buildButton = document.getElementById("buildEmail");
const copyButton = document.getElementById("copyEmail");
const insertStatusButton = document.getElementById("insertStatus");
const insertCauseButton = document.getElementById("insertCause");
const addImpactButton = document.getElementById("addImpact");
const insertDecisionButton = document.getElementById("insertDecision");

buildButton.addEventListener("click", buildEmail);
copyButton.addEventListener("click", copyEmail);
insertStatusButton.addEventListener("click", () => {
  const statusTemplate = document.getElementById("statusTemplate");
  if (!statusTemplate.value) return;
  document.getElementById("statusInput").value = statusTemplate.value;
});
insertCauseButton.addEventListener("click", () => {
  const causeTemplate = document.getElementById("causeTemplate");
  if (!causeTemplate.value) return;
  document.getElementById("causeInput").value = causeTemplate.value;
});
addImpactButton.addEventListener("click", () => {
  const impactTemplate = document.getElementById("impactTemplate");
  if (!impactTemplate.value) return;
  appendToTextarea(document.getElementById("impactInput"), impactTemplate.value);
  impactTemplate.value = "";
});
insertDecisionButton.addEventListener("click", () => {
  const action = normalizeClause(document.getElementById("decisionAction").value);
  const date = normalizeDate(document.getElementById("decisionDate").value);
  const outcomeRaw = normalizeClause(document.getElementById("decisionOutcome").value);
  const fallbackRaw = normalizeClause(document.getElementById("decisionFallback").value);
  const outcome = ensureStartsWith(outcomeRaw, "we can");
  const fallback = ensureStartsWith(fallbackRaw, "we will");
  if (!action || !date || !outcome || !fallback) return;
  document.getElementById("nextStepInput").value = `If we can ${action} by ${date}, ${outcome}. If not, ${fallback}.`;
});

const guidedBlocks = Array.from(document.querySelectorAll(".guided-block"));

function openBlock(index) {
  guidedBlocks.forEach((block, idx) => {
    if (idx === index) {
      block.classList.add("is-open");
    } else {
      block.classList.remove("is-open");
    }
  });
}

guidedBlocks.forEach((block, index) => {
  const textarea = block.querySelector("textarea");
  const header = block.querySelector(".guided-header");
  const nextButton = block.querySelector(".next-button");

  header.addEventListener("click", () => openBlock(index));
  textarea.addEventListener("focus", () => openBlock(index));
  nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    buildEmail();
    if (index < guidedBlocks.length - 1) {
      openBlock(index + 1);
    }
  });
});

openBlock(0);

let currentStep = 0;
let steps = [];
let overlay, highlight, tooltip;

function startTour(tourSteps) {
  steps = tourSteps;
  currentStep = 0;
  createOverlay();
  showStep();
}

function createOverlay() {
  overlay = document.createElement("div");
  overlay.className = "tour-overlay";
  document.body.appendChild(overlay);
}

function showStep() {
  cleanupStep();

  const step = steps[currentStep];
  const target = document.querySelector(step.selector);
  if (!target) return;

  const rect = target.getBoundingClientRect();

  // Highlight
  highlight = document.createElement("div");
  highlight.className = "tour-highlight";
  Object.assign(highlight.style, {
    top: `${rect.top - 6}px`,
    left: `${rect.left - 6}px`,
    width: `${rect.width + 12}px`,
    height: `${rect.height + 12}px`
  });

  // Tooltip
  tooltip = document.createElement("div");
  tooltip.className = "tour-tooltip";
  tooltip.innerHTML = `
    <h3>${step.title}</h3>
    <p>${step.text}</p>
    <div class="tour-buttons">
      <button class="tour-back" ${currentStep === 0 ? "disabled" : ""}>Back</button>
      <button class="tour-next">
        ${currentStep === steps.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  `;

  tooltip.style.top = `${rect.bottom + 12}px`;
  tooltip.style.left = `${rect.left}px`;

  document.body.append(highlight, tooltip);

  tooltip.querySelector(".tour-next").onclick = nextStep;
  tooltip.querySelector(".tour-back").onclick = prevStep;
}

function nextStep() {
  currentStep++;
  if (currentStep >= steps.length) {
    endTour();
  } else {
    showStep();
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep();
  }
}

function cleanupStep() {
  highlight?.remove();
  tooltip?.remove();
}

function endTour() {
  cleanupStep();
  overlay?.remove();
}

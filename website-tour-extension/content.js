console.log("Tour extension loaded");

const steps = [
  {
    selector: "body",
    title: "Welcome 🎉",
    text: "This is a working website tour guide extension."
  },
  {
    selector: "a",
    title: "Links",
    text: "Most websites contain links like these."
  }
];

let currentStep = 0;
let overlay, highlight, tooltip;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startTour);
} else {
  startTour();
}

function startTour() {
  createOverlay();
  showStep();
}

function createOverlay() {
  overlay = document.createElement("div");
  overlay.className = "tour-overlay";
  document.body.appendChild(overlay);
}

function showStep() {
  cleanup();

  const step = steps[currentStep];
  const target = document.querySelector(step.selector);

  if (!target) {
    console.warn("Target not found:", step.selector);
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  const rect = target.getBoundingClientRect();

  // Highlight
  highlight = document.createElement("div");
  highlight.className = "tour-highlight";
  highlight.style.top = `${rect.top - 6}px`;
  highlight.style.left = `${rect.left - 6}px`;
  highlight.style.width = `${rect.width + 12}px`;
  highlight.style.height = `${rect.height + 12}px`;

  // Tooltip
  tooltip = document.createElement("div");
  tooltip.className = "tour-tooltip";
  tooltip.innerHTML = `
    <h3>${step.title}</h3>
    <p>${step.text}</p>
    <div class="tour-buttons">
      <button class="back" ${currentStep === 0 ? "disabled" : ""}>Back</button>
      <button class="next">${currentStep === steps.length - 1 ? "Finish" : "Next"}</button>
    </div>
  `;

  const top = Math.min(rect.bottom + 12, window.innerHeight - 180);
  const left = Math.min(rect.left, window.innerWidth - 280);
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;

  document.body.append(highlight, tooltip);

  tooltip.querySelector(".next").onclick = nextStep;
  tooltip.querySelector(".back").onclick = prevStep;
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

function cleanup() {
  highlight?.remove();
  tooltip?.remove();
}

function endTour() {
  cleanup();
  overlay?.remove();
  console.log("Tour finished");
}

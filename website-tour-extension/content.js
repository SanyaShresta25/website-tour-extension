(() => {
  'use strict';

  console.log('Website Tour Guide Pro loaded');

  /* ================= CONFIG ================= */

 const steps = [
  {
    selector: 'nav[aria-label="Primary Navigation"] li a[href*="/feed"]',
    title: 'Home Feed',
    text: 'Your main feed where posts and updates appear.'
  },
  {
    selector: 'nav[aria-label="Primary Navigation"] li a[href*="/mynetwork"]',
    title: 'My Network',
    text: 'View and manage your professional connections.'
  },
  {
    selector: 'nav[aria-label="Primary Navigation"] li a[href*="/jobs"]',
    title: 'Jobs',
    text: 'Find job opportunities tailored to your profile.'
  },
  {
    selector: 'nav[aria-label="Primary Navigation"] li a[href*="/messaging"]',
    title: 'Messaging',
    text: 'Chat with recruiters and connections.'
  },
  {
    selector: 'nav[aria-label="Primary Navigation"] li a[href*="/notifications"]',
    title: 'Notifications',
    text: 'View likes, comments, and mentions.'
  },
  {
    selector: 'input[aria-label*="Search"]',
    title: 'Search',
    text: 'Search people, jobs, companies, and posts.'
  }
];


  /* ================= UTILS ================= */

  function waitForElement(selector, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        }
        if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject();
        }
      }, 100);
    });
  }

  /* ================= TOUR ENGINE ================= */

  let index = 0;
  let overlay, tooltip, highlight;

  startTour();

  function startTour() {
    overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    document.body.appendChild(overlay);
    showStep();
  }

  async function showStep() {
    cleanup();

    if (index >= steps.length) {
      endTour();
      return;
    }

    const step = steps[index];
    let target;

   try {
  target = document.querySelector(step.selector);
} catch {
  target = null;
}

    // Defensive scroll (LinkedIn-safe)
    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      console.warn('Scroll skipped');
    }

    const r = target.getBoundingClientRect();

    highlight = document.createElement('div');
    highlight.className = 'tour-highlight';
    Object.assign(highlight.style, {
      top: `${r.top - 8}px`,
      left: `${r.left - 8}px`,
      width: `${r.width + 16}px`,
      height: `${r.height + 16}px`
    });

    tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.innerHTML = `
      <div class="tour-progress">
        <div class="bar" style="width:${((index + 1) / steps.length) * 100}%"></div>
      </div>
      <div class="tour-step">${index + 1} / ${steps.length}</div>
      <h3>${step.title}</h3>
      <p>${step.text}</p>
      <div class="actions">
        <button class="skip">Skip</button>
        <button class="next">${index === steps.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    `;

    positionTooltip(r);

    document.body.append(highlight, tooltip);

    tooltip.querySelector('.next').onclick = () => {
      index++;
      showStep();
    };

    tooltip.querySelector('.skip').onclick = endTour;
  }

  function positionTooltip(r) {
    const spaceBelow = window.innerHeight - r.bottom;
    tooltip.style.top =
      spaceBelow > 220 ? `${r.bottom + 16}px` : `${r.top - 220}px`;
    tooltip.style.left = `${Math.min(r.left, window.innerWidth - 360)}px`;
  }

  function cleanup() {
    highlight?.remove();
    tooltip?.remove();
  }

  function endTour() {
    cleanup();
    overlay?.remove();
    console.log('Tour finished');
  }
})();

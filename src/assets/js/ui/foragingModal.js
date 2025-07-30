/*
 * Optimized Foraging Progress & Dice Roll with Leaf-Only Animation & Auto-Close
 * - Async/Await flow
 * - Rotating leaf loader only
 * - Stops leaf rotation once progress completes
 * - Configurable durations
 * - Auto-close modal if no onComplete or after result
 */
window.showForagingProgressWithDice = async function({ duration = 8000, fillDuration, buffer = 100, onComplete, getSkillModAndDC } = {}) {
  // Determine fill duration or default
  fillDuration = fillDuration || (duration - buffer);

  // Inject animation CSS once
  if (!window._foragingStylesInjected) {
    const style = document.createElement('style');
    style.textContent = `
@keyframes rotateLeaf {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
.foraging-loader { width: 48px; height: 48px; margin-bottom: 16px; }
.foraging-loader svg { width: 100%; height: 100%; animation: rotateLeaf 1.5s linear infinite; }
    `;
    document.head.appendChild(style);
    window._foragingStylesInjected = true;
  }

  // Clean up any previous modal
  document.getElementById('foraging-modal')?.remove();

  // Modal backdrop
  const modal = document.createElement('div');
  modal.id = 'foraging-modal';
  Object.assign(modal.style, {
    position: 'fixed', inset: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.6)'
  });

  // Foraging card (no pulsing)
  const card = document.createElement('div');
  card.className = 'bg-gray-900 rounded-lg shadow-lg p-8 flex flex-col items-center w-full max-w-md';

  // Leaf loader animation
  const loader = document.createElement('div');
  loader.className = 'foraging-loader';
  loader.innerHTML = `
<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
  <path d="M12 2C10 4 6 4 4 8c-2 4 2 6 4 10 2-4 6-4 8-8 2-4-2-6-4-10z"/>
</svg>`;
  card.appendChild(loader);

  // Title
  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold text-green-300 mb-4';
  title.textContent = 'Foraging';
  card.appendChild(title);

  // Progress bar container
  const progressContainer = document.createElement('div');
  progressContainer.className = 'w-full h-6 bg-gray-700 rounded-full overflow-hidden mb-6';
  card.appendChild(progressContainer);

  // Progress bar fill
  const bar = document.createElement('div');
  bar.className = 'h-full bg-green-500';
  bar.style.transition = `width ${fillDuration}ms ease-in-out`;
  bar.style.width = '0%';
  progressContainer.appendChild(bar);

  // Dice roll container
  const diceDiv = document.createElement('div');
  diceDiv.className = 'w-full flex flex-col items-center';
  card.appendChild(diceDiv);

  // Mount modal
  modal.appendChild(card);
  document.body.appendChild(modal);

  // Start fill animation
  requestAnimationFrame(() => bar.style.width = '100%');

  // Wait for fill + buffer
  await new Promise(res => setTimeout(res, fillDuration + buffer));

  // Stop leaf rotation
  const svg = loader.querySelector('svg');
  if (svg) svg.style.animation = 'none';

  // Roll logic
  const { skillMod = 0, dc = 5 } = getSkillModAndDC?.() || {};
  const roll = Math.floor(Math.random() * 20) + 1;
  const finish = (showResult) => { modal.remove(); showResult?.(); };

  if (window.diceRoller && gameData.settings.showDiceAnimations) {
    // Show animated roll
    window.diceRoller.showDiceRollAnimation(
      roll, 20, skillMod, roll + skillMod,
      'Survival Check', dc, diceDiv
    );
    // Attach continue or auto-close
    if (typeof onComplete === 'function') {
      onComplete(roll, skillMod, dc, (showResult) => {
        const attach = () => {
          const btn = diceDiv.querySelector('button, .continue-btn');
          if (btn) btn.addEventListener('click', () => finish(showResult), { once: true });
          else setTimeout(attach, 50);
        };
        attach();
      });
    } else {
      // No onComplete: auto-close after animation (approx 2s)
      setTimeout(() => finish(), 2000);
    }
  } else {
    // Fallback: simple text and button
    diceDiv.innerHTML = `<div class='text-lg text-green-200 mb-2'>Roll: <strong>${roll}</strong> + <strong>${skillMod}</strong> vs DC <strong>${dc}</strong></div>`;
    const btn = document.createElement('button');
    btn.className = 'mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded';
    btn.textContent = 'Continue';
    btn.onclick = () => finish();
    diceDiv.appendChild(btn);
    onComplete?.(roll, skillMod, dc);
  }
};

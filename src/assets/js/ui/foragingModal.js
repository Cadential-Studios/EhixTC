// Foraging modal with progress bar, dice roll, and result animation
window.showForagingProgressWithDice = function({ duration = 2000, onComplete, getSkillModAndDC }) {
    // Remove any existing modal
    const old = document.getElementById('foraging-modal');
    if (old) old.remove();

    // Modal shell
    const modal = document.createElement('div');
    modal.id = 'foraging-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60';

    // Card
    const card = document.createElement('div');
    card.className = 'bg-gray-900 rounded-lg shadow-lg p-8 flex flex-col items-center w-full max-w-md relative';

    // Title
    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-green-300 mb-4';
    title.textContent = 'Foraging';
    card.appendChild(title);

    // Progress bar container
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'w-full h-6 bg-gray-700 rounded-full overflow-hidden mb-6';
    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'h-full bg-green-500 transition-all duration-1000 ease-in-out';
    progressBar.style.width = '0%';
    progressBarContainer.appendChild(progressBar);
    card.appendChild(progressBarContainer);

    // Dice roll UI placeholder
    const diceRollDiv = document.createElement('div');
    diceRollDiv.className = 'w-full flex flex-col items-center justify-center';
    card.appendChild(diceRollDiv);

    // Append card to modal
    modal.appendChild(card);
    document.body.appendChild(modal);

    // Animate progress bar
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 50);

    // After progress bar fills, show dice roll
    setTimeout(() => {
        // Get skill mod and DC
        const { skillMod, dc } = getSkillModAndDC ? getSkillModAndDC() : { skillMod: 0, dc: 5 };
        // Roll d20
        const roll = Math.floor(Math.random() * 20) + 1;
        // Dice roll UI (reuse diceRoller if available)
        if (window.diceRoller && gameData.settings.showDiceAnimations) {
            window.diceRoller.showDiceRollAnimation(
                roll,
                20,
                skillMod,
                roll + skillMod,
                'Survival Check',
                dc,
                diceRollDiv
            );
            // Wait for Continue button
            if (typeof onComplete === 'function') {
                onComplete(roll, skillMod, dc, (showResult) => {
                    // Try to find a Continue button in diceRollDiv
                    const tryAttach = () => {
                        const btn = diceRollDiv.querySelector('button, .continue-btn');
                        if (btn) {
                            btn.addEventListener('click', () => {
                                document.getElementById('foraging-modal')?.remove();
                                if (typeof showResult === 'function') showResult();
                            }, { once: true });
                        } else {
                            setTimeout(tryAttach, 100);
                        }
                    };
                    tryAttach();
                });
            }
        } else {
            // Fallback: simple text and Continue button
            diceRollDiv.innerHTML = `<div class='text-lg text-green-200 mb-2'>Roll: <span class='font-bold'>${roll}</span> + <span class='font-bold'>${skillMod}</span> (Survival) vs DC <span class='font-bold'>${dc}</span></div>`;
            const btn = document.createElement('button');
            btn.className = 'mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded';
            btn.textContent = 'Continue';
            btn.onclick = () => {
                document.getElementById('foraging-modal')?.remove();
                if (typeof onComplete === 'function') onComplete(roll, skillMod, dc, null);
            };
            diceRollDiv.appendChild(btn);
            return;
        }
    }, duration);
};

// Forage result animation modal
window.showForageResultAnimation = function(found) {
    // Remove any existing modal
    const old = document.getElementById('forage-result-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'forage-result-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60';

    const card = document.createElement('div');
    card.className = 'bg-gray-900 rounded-lg shadow-lg p-8 flex flex-col items-center w-full max-w-md relative animate-bounceIn';

    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-green-300 mb-4';
    title.textContent = found.length > 0 ? 'You Foraged:' : 'Nothing Found';
    card.appendChild(title);

    if (found.length > 0) {
        // Sequentially pop in each item line
        found.forEach((item, i) => {
            setTimeout(() => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex items-center gap-2 text-lg text-green-100 mb-2 animate-popIn';
                // Always use item id for lookup
                let displayName = item.id && itemsData[item.id] ? (itemsData[item.id].name || item.id.replace(/_/g, ' ')) : (item.displayName || item.name || 'Unknown');
                itemDiv.innerHTML = `<span class='font-bold'>${item.qty}x</span> <span>${displayName}</span>`;
                card.appendChild(itemDiv);
                // Animate popIn
                itemDiv.animate([
                    { transform: 'translateY(20px)', opacity: 0 },
                    { transform: 'translateY(0)', opacity: 1 }
                ], {
                    duration: 350,
                    delay: 0,
                    fill: 'forwards'
                });
            }, i * 350);
        });
    } else {
        const nothing = document.createElement('div');
        nothing.className = 'text-green-200 text-lg';
        nothing.textContent = 'You find nothing of value.';
        card.appendChild(nothing);
    }

    // Close button (append after all item lines)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded';
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => modal.remove();
    // Wait until all item lines are animated in, then append button
    const totalDelay = found.length > 0 ? (found.length - 1) * 350 + 400 : 0;
    setTimeout(() => {
        card.appendChild(closeBtn);
    }, totalDelay);

    modal.appendChild(card);
    document.body.appendChild(modal);

    // Animate in
    card.animate([
        { transform: 'scale(0.8)', opacity: 0 },
        { transform: 'scale(1.05)', opacity: 1 },
        { transform: 'scale(1)', opacity: 1 }
    ], {
        duration: 500,
        easing: 'cubic-bezier(.68,-0.55,.27,1.55)'
    });
    // Animate each item
    setTimeout(() => {
        card.querySelectorAll('.animate-popIn').forEach((el, i) => {
            el.animate([
                { transform: 'translateY(20px)', opacity: 0 },
                { transform: 'translateY(0)', opacity: 1 }
            ], {
                duration: 350,
                delay: i * 120,
                fill: 'forwards'
            });
        });
    }, 200);
};

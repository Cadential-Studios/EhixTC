class DiceRoller {
    constructor() {
        this.currentModal = null;
        this.audioEnabled = true;
    }

    // Main dice roll function
    roll(sides, modifier = 0, label = 'Dice Roll', dc = null) {
        const baseRoll = Math.floor(Math.random() * sides) + 1;
        const total = baseRoll + modifier;
        
        this.showDiceRollAnimation(baseRoll, sides, modifier, total, label, dc);
        
        return {
            baseRoll,
            modifier,
            total,
            success: dc !== null ? total >= dc : null
        };
    }

    // Enhanced dice roll animation modal
    showDiceRollAnimation(roll, sides, modifier, total, label, dc = null) {
        // Remove any existing modal
        if (this.currentModal) {
            this.currentModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'dice-modal fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-[100]';
        modal.style.backdropFilter = 'blur(0px)';
        
        const animationSpeed = gameData?.settings?.combatAnimationSpeed || 1;
        const cycleDuration = Math.max(1200 / animationSpeed, 600);
        const modifierDelay = Math.max(800 / animationSpeed, 400);
        const initialDelay = 300;
        
        modal.innerHTML = `
            <div class="dice-modal-content bg-gray-900 border-4 border-blue-500 rounded-xl p-8 text-center shadow-2xl max-w-md mx-auto relative overflow-hidden opacity-0" style="background: rgba(26, 26, 46, 0.95); transform: scale(0) translate(-50%, -50%); position: absolute; top: 50%; left: 50%;">
                <!-- Content -->
                <div class="relative">
                    <!-- Dice Icon -->
                    <div class="dice-display mb-6">
                        <div id="dice-icon" class="mb-2 transition-transform duration-200 transform flex justify-center items-center">
                            <img src="src/assets/images/dice.png" alt="D20" class="w-20 h-20 filter drop-shadow-lg" style="filter: drop-shadow(0 0 15px rgba(106, 141, 255, 0.8));" />
                        </div>
                        <div class="dice-type text-blue-400 font-cinzel text-lg font-bold opacity-0 transition-opacity duration-500" id="dice-type-label">d${sides}</div>
                    </div>
                    
                    <!-- Roll Label -->
                    <h3 class="roll-title font-cinzel text-2xl text-white mb-6 border-b border-blue-600 pb-2 opacity-0 transition-opacity duration-500" id="roll-title">
                        ${label}
                    </h3>
                    
                    <!-- Roll Display -->
                    <div class="roll-breakdown space-y-4">
                        <!-- Main Roll Display -->
                        <div class="main-roll-section opacity-0 transition-opacity duration-500" id="main-roll-section">
                            <div class="text-gray-400 text-sm mb-2 font-cinzel" id="roll-description">Rolling d${sides}...</div>
                            <div id="main-roll-value" class="text-6xl font-bold text-white font-cinzel tracking-wider">
                                --
                            </div>
                            <div id="modifier-display" class="text-lg text-blue-400 mt-2 opacity-0 transition-opacity duration-500 font-cinzel">
                                <!-- Modifier text will be added here -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Success/Failure indicator -->
                    <div id="result-indicator" class="mt-6" style="opacity: 0;">
                        <div id="result-text" class="text-2xl font-bold font-cinzel"></div>
                    </div>
                    
                    <!-- Continue button -->
                    <button id="continue-btn" class="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-cinzel font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg" style="opacity: 0;">
                        Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.currentModal = modal;
        
        // Animate modal entrance
        requestAnimationFrame(() => {
            modal.style.transition = 'background-color 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out';
            modal.className = 'dice-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]';
            modal.style.backdropFilter = 'blur(10px)';
            
            const modalContent = modal.querySelector('.dice-modal-content');
            modalContent.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-in-out';
            modalContent.style.transform = 'scale(1) translate(-50%, -50%)';
            modalContent.style.opacity = '1';
            
            // Stagger content appearance
            setTimeout(() => {
                document.getElementById('dice-type-label').style.opacity = '1';
                setTimeout(() => {
                    document.getElementById('roll-title').style.opacity = '1';
                    setTimeout(() => {
                        document.getElementById('main-roll-section').style.opacity = '1';
                        setTimeout(() => {
                            this.startDiceRollSequence(roll, sides, modifier, total, label, cycleDuration, modifierDelay, dc);
                        }, initialDelay);
                    }, 150);
                }, 150);
            }, 200);
        });
        
        // Event handlers
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.closeModal();
        });
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    startDiceRollSequence(finalRoll, sides, modifier, total, label, cycleDuration, modifierDelay, dc = null) {
        const diceIcon = document.getElementById('dice-icon');
        const mainRollValue = document.getElementById('main-roll-value');
        const modifierDisplay = document.getElementById('modifier-display');
        const rollDescription = document.getElementById('roll-description');
        
        let currentCycleValue = 1;
        let cycleCount = 0;
        const maxCycles = Math.floor(cycleDuration / 80);
        
        setTimeout(() => {
            this.playDiceSound('roll');
            
            const modalContent = document.querySelector('.dice-modal-content');
            
            const cycleInterval = setInterval(() => {
                const intensity = Math.min(cycleCount / maxCycles, 1);
                const diceImage = diceIcon.querySelector('img');
                
                // Enhanced 3D rotation
                const rotationX = cycleCount * 45 + Math.sin(cycleCount * 0.8) * 30;
                const rotationY = cycleCount * 60 + Math.cos(cycleCount * 0.6) * 45;
                const rotationZ = cycleCount * 30;
                const scale = 1 + Math.sin(cycleCount * 0.5) * 0.3 * intensity;
                
                diceIcon.style.transform = `scale(${scale}) rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`;
                diceImage.style.filter = `drop-shadow(0 0 ${15 + intensity * 10}px rgba(106, 141, 255, ${0.6 + intensity * 0.4}))`;
                
                // Cycle numbers
                currentCycleValue = Math.floor(Math.random() * sides) + 1;
                mainRollValue.textContent = currentCycleValue;
                mainRollValue.style.color = '#ffffff';
                mainRollValue.style.transform = `scale(${1 + Math.sin(cycleCount * 0.8) * 0.15 * intensity})`;
                mainRollValue.style.textShadow = `0 0 ${10 + intensity * 15}px rgba(255, 255, 255, ${0.5 + intensity * 0.3})`;
                
                // Screen shake
                if (intensity > 0.7) {
                    const shakeX = (Math.random() - 0.5) * 4 * intensity;
                    const shakeY = (Math.random() - 0.5) * 4 * intensity;
                    modalContent.style.transform = `scale(1) translate(calc(-50% + ${shakeX}px), calc(-50% + ${shakeY}px))`;
                }
                
                cycleCount++;
                
                if (cycleCount >= maxCycles) {
                    clearInterval(cycleInterval);
                    modalContent.style.transform = 'scale(1) translate(-50%, -50%)';
                    this.finalizeDiceRoll(finalRoll, sides, modifier, total, modifierDelay, dc);
                }
            }, 80);
        }, 500);
    }

    finalizeDiceRoll(finalRoll, sides, modifier, total, modifierDelay, dc = null) {
        const diceIcon = document.getElementById('dice-icon');
        const mainRollValue = document.getElementById('main-roll-value');
        const modifierDisplay = document.getElementById('modifier-display');
        const rollDescription = document.getElementById('roll-description');
        const continueBtn = document.getElementById('continue-btn');
        
        // Stop animation
        const diceImage = diceIcon.querySelector('img');
        diceIcon.style.animation = '';
        diceIcon.style.transform = 'scale(1.5) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
        
        // Set final glow
        if (finalRoll === 20 && sides === 20) {
            diceImage.style.filter = 'drop-shadow(0 0 20px #10b981) brightness(1.2)';
        } else if (finalRoll === 1 && sides === 20) {
            diceImage.style.filter = 'drop-shadow(0 0 20px #ef4444) brightness(1.2)';
        } else {
            diceImage.style.filter = 'drop-shadow(0 0 15px rgba(106, 141, 255, 0.8)) brightness(1.1)';
        }
        
        // Reveal final roll
        mainRollValue.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        mainRollValue.textContent = finalRoll;
        mainRollValue.style.transform = 'scale(1.4)';
        mainRollValue.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
        
        rollDescription.textContent = `Base roll: ${finalRoll}`;
        
        // Color coding
        if (finalRoll === 20 && sides === 20) {
            mainRollValue.style.color = '#10b981';
            mainRollValue.style.textShadow = '0 0 25px #10b981, 0 0 35px #10b981';
            mainRollValue.classList.add('animate-pulse');
            diceImage.style.filter = 'drop-shadow(0 0 20px #10b981) brightness(1.3)';
            this.showFloatingText('CRITICAL SUCCESS!', '#10b981');
            this.playDiceSound('critical');
            this.flashScreen('#10b981', 0.3);
        } else if (finalRoll === 1 && sides === 20) {
            mainRollValue.style.color = '#ef4444';
            mainRollValue.style.textShadow = '0 0 25px #ef4444, 0 0 35px #ef4444';
            mainRollValue.classList.add('animate-pulse');
            diceImage.style.filter = 'drop-shadow(0 0 20px #ef4444) brightness(1.3)';
            this.showFloatingText('CRITICAL FAILURE!', '#ef4444');
            this.playDiceSound('failure');
            this.flashScreen('#ef4444', 0.2);
        } else {
            mainRollValue.style.color = '#ffffff';
            this.playDiceSound('success');
        }
        
        // Return to normal size
        setTimeout(() => {
            diceIcon.style.transition = 'transform 0.4s ease-out';
            diceIcon.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
            mainRollValue.style.transform = 'scale(1.2)';
        }, 800);
        
        // Add modifiers
        setTimeout(() => {
            if (modifier !== 0) {
                const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                modifierDisplay.innerHTML = `<span class="font-cinzel">${modifierText} modifier</span>`;
                modifierDisplay.style.opacity = '1';
                
                this.animateNumberTransition(finalRoll, total, mainRollValue, rollDescription, modifierDelay, dc, continueBtn);
            } else {
                this.showFinalResult(total, mainRollValue, rollDescription, continueBtn, dc);
            }
        }, 1000);
    }

    animateNumberTransition(startValue, endValue, element, description, duration, dc, continueBtn) {
        const difference = endValue - startValue;
        const steps = Math.max(10, Math.abs(difference));
        const stepSize = difference / steps;
        const stepDuration = duration / steps;
        
        let currentValue = startValue;
        let stepCount = 0;
        
        const transitionInterval = setInterval(() => {
            stepCount++;
            currentValue = Math.round(startValue + (stepSize * stepCount));
            
            element.textContent = currentValue;
            element.style.transform = `scale(${1.2 + Math.sin(stepCount * 0.5) * 0.1})`;
            
            const progress = stepCount / steps;
            if (progress > 0.5) {
                element.style.color = '#6a8dff';
                element.style.textShadow = '0 0 20px rgba(106, 141, 255, 0.8)';
            }
            
            if (stepCount >= steps || currentValue === endValue) {
                clearInterval(transitionInterval);
                element.textContent = endValue;
                element.style.transform = 'scale(1.3)';
                description.textContent = `Final result: ${endValue}`;
                
                setTimeout(() => {
                    this.showFinalResult(endValue, element, description, continueBtn, dc);
                }, 500);
            }
        }, stepDuration);
    }

    showFinalResult(total, element, description, continueBtn, dc = null) {
        element.style.color = '#6a8dff';
        element.style.textShadow = '0 0 25px rgba(106, 141, 255, 0.9)';
        element.classList.add('text-gradient');
        
        if (dc !== null) {
            setTimeout(() => {
                const resultIndicator = document.getElementById('result-indicator');
                const resultText = document.getElementById('result-text');
                
                if (total >= dc) {
                    resultText.innerHTML = '<i class="ph-duotone ph-check-circle"></i> SUCCESS!';
                    resultText.className = 'text-2xl font-bold font-cinzel text-green-400';
                    this.playDiceSound('success');
                } else {
                    resultText.innerHTML = '<i class="ph-duotone ph-x-circle"></i> FAILURE';
                    resultText.className = 'text-2xl font-bold font-cinzel text-red-400';
                    this.playDiceSound('failure');
                }
                
                resultIndicator.style.opacity = '1';
                resultIndicator.style.transition = 'opacity 0.5s ease-in-out';
            }, 800);
        }
        
        setTimeout(() => {
            continueBtn.style.opacity = '1';
            continueBtn.style.transition = 'opacity 0.5s ease-in-out';
        }, dc !== null ? 1500 : 1000);
    }

    // Utility functions
    closeModal() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    playDiceSound(type) {
        if (!this.audioEnabled) return;
        
        // Placeholder for audio implementation
        console.log(`Playing ${type} sound`);
    }

    showFloatingText(text, color) {
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.className = 'floating-text fixed pointer-events-none z-[110] font-cinzel font-bold text-xl';
        floatingText.style.color = color;
        floatingText.style.left = '50%';
        floatingText.style.top = '30%';
        floatingText.style.transform = 'translate(-50%, -50%)';
        floatingText.style.animation = 'floatUp 2s ease-out forwards';
        
        document.body.appendChild(floatingText);
        
        setTimeout(() => {
            floatingText.remove();
        }, 2000);
    }

    flashScreen(color, opacity) {
        const flash = document.createElement('div');
        flash.className = 'screen-flash fixed inset-0 pointer-events-none z-[105]';
        flash.style.backgroundColor = color;
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.1s ease-out';
        
        document.body.appendChild(flash);
        
        requestAnimationFrame(() => {
            flash.style.opacity = opacity;
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    flash.remove();
                }, 100);
            }, 100);
        });
    }
}

// Create global dice roller instance
window.diceRoller = new DiceRoller();
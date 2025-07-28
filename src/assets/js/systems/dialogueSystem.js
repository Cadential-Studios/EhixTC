// NPC Dialogue System
// Provides simple branching conversation support

class DialogueSystem {
    constructor(dialogueData = {}) {
        this.dialogueData = dialogueData;
        this.activeDialogue = null;
    }

    load(data) {
        this.dialogueData = data;
    }

    start(id) {
        this.activeDialogue = this.dialogueData[id] || null;
        return this.activeDialogue;
    }

    choose(optionIndex) {
        if (!this.activeDialogue) return null;
        const option = this.activeDialogue.options[optionIndex];
        if (option && option.next) {
            this.activeDialogue = this.dialogueData[option.next] || null;
        } else {
            this.activeDialogue = null;
        }
        return this.activeDialogue;
    }
}
window.DialogueSystem = DialogueSystem;

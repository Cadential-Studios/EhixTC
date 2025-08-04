# YAML Dialogue System Guide
## Edoria: The Triune Convergence

### Overview
You now have a fully functional YAML-based dialogue system that integrates with your game! Here's how to use it:

## 🎯 Quick Start

### 1. Testing the System
- **Test Button**: A purple "Test Dialogue" button appears in the top-right corner
- **Developer Console**: Use `test_dialogue` command to test
- **Status Check**: Use `dialogue_status` command to verify system status

### 2. Starting Dialogues in Game
```javascript
// Start a dialogue with any character
startDialogue('Village Elder');
startDialogue('General Merchant');
```

## 📝 YAML Structure Guide

### Basic Dialogue Tree
```yaml
dialogue_trees:
  - id: unique_dialogue_id
    character: NPC Name
    location: optional_location  # Restricts dialogue to specific areas
    priority: 1                  # Higher numbers = higher priority
    repeatable: true            # Can this dialogue be used multiple times?
    root: greeting              # Starting node ID
    
    conditions:                 # Global conditions for availability
      - type: level_requirement
        min_level: 5
      - type: quest_status
        quest_id: some_quest
        status: active
    
    variables:                  # Dialogue-specific variables
      trust_level: 0
      first_meeting: true
    
    nodes:
      greeting:                 # Node ID
        text: "Hello there!"    # Simple text
        # OR conditional text:
        text:
          - condition:
              type: variable
              variable: first_meeting
              value: true
            text: "Welcome, newcomer!"
          - default: "Hello again!"
        
        on_enter:               # Actions when entering this node
          - type: set_variable
            variable: first_meeting
            value: false
        
        responses:              # Player response options
          - text: "Tell me about yourself."
            next: info_node
          - text: "Goodbye."
            next: end
```

## 🔧 Condition Types

### Available Condition Types:
- `quest_status`: Check quest state (active, completed, not_started)
- `item_in_inventory`: Check if player has specific items
- `level_requirement`: Minimum player level
- `time_of_day`: Specific hours (array of hour numbers)
- `relationship`: NPC relationship levels
- `flag`: Global game flags
- `variable`: Dialogue-specific variables
- `stat_requirement`: Player stat minimums

### Examples:
```yaml
conditions:
  - type: quest_status
    quest_id: main_story
    status: completed
  
  - type: item_in_inventory
    item_id: special_key
    quantity: 1
  
  - type: relationship
    character: Village Elder
    min_relationship: 10
  
  - type: time_of_day
    hours: [18, 19, 20, 21]  # Evening hours
```

## ⚡ Action Types

### Available Actions:
- `set_variable`: Set dialogue variables
- `set_flag`: Set global game flags
- `add_relationship`: Modify NPC relationships
- `start_quest`: Begin new quests
- `add_item`: Give items to player
- `add_gold`: Give gold to player
- `play_sound`: Play sound effects
- `add_journal_entry`: Add text to player journal
- `save_dialogue_state`: Save current dialogue state

### Examples:
```yaml
on_enter:
  - type: set_flag
    flag: met_elder
    value: true
  
  - type: add_relationship
    character: Village Elder
    amount: 5
  
  - type: start_quest
    quest_id: wolf_problem
  
  - type: add_item
    item_id: healing_potion
    quantity: 3
```

## 🎲 Skill Checks

### Basic Skill Check:
```yaml
responses:
  - text: "[Persuade] Can you help me?"
    skill_check:
      skill: persuasion
      difficulty: 12
      success_node: persuade_success
      failure_node: persuade_failure
    conditions:
      - type: stat_requirement
        stat: charisma
        min_value: 13
```

## 🏗️ Advanced Features

### Conditional Text with Multiple Options:
```yaml
text:
  - condition:
      type: variable
      variable: trust_level
      min_value: 20
    text: "My most trusted friend!"
  
  - condition:
      type: flag
      flag: first_meeting
      value: true
    text: "A new face! Welcome!"
  
  - default: "Good day, traveler."
```

### Response Costs:
```yaml
responses:
  - text: "I'll buy information for 50 gold."
    next: secret_info
    cost:
      gold: 50
```

### Multiple Dialogue Trees for Same Character:
```yaml
# First meeting dialogue
- id: elder_first_meeting
  character: Village Elder
  priority: 2
  conditions:
    - type: flag
      flag: met_elder
      value: false

# Regular dialogue
- id: elder_regular
  character: Village Elder  
  priority: 1
  conditions:
    - type: flag
      flag: met_elder
      value: true
```

## 📋 File Organization

### Recommended Structure:
```
src/data/dialogue/
├── village_dialogues.yaml    # Village NPCs
├── merchant_dialogues.yaml   # Merchants and traders
├── quest_dialogues.yaml      # Quest-specific conversations
└── story_dialogues.yaml      # Main story conversations
```

## 🔗 Integration with Your Game

### Adding Dialogue to NPCs:
1. **In Scene Files**: Add dialogue triggers to NPC interactions
2. **In Main Game**: Use `startDialogue('Character Name')` 
3. **Quest Integration**: Dialogue can start/complete quests automatically
4. **Relationship System**: Track player relationships with NPCs

### Example Integration:
```javascript
// In your NPC interaction code
function interactWithNPC(npcName) {
    const dialogueStarted = startDialogue(npcName);
    if (!dialogueStarted) {
        // Fallback to default interaction
        showGameMessage(`${npcName} has nothing to say right now.`);
    }
}
```

## 🎨 Styling and UI

The dialogue system uses your existing Tailwind classes and integrates with your game's visual style:
- Modal background with transparency
- Character name and portrait area
- Responsive text display
- Styled response buttons
- Skill check indicators
- Cost displays

## 🔄 State Management

The system automatically:
- Saves dialogue variables between conversations
- Tracks NPC relationships
- Manages global flags
- Integrates with your quest system
- Updates player inventory and stats

## 📚 Example Usage Scenarios

### 1. Simple Merchant:
```yaml
- id: fruit_vendor
  character: Fruit Vendor
  repeatable: true
  root: greeting
  nodes:
    greeting:
      text: "Fresh apples! Best in the market!"
      responses:
        - text: "I'll take an apple."
          next: purchase
          cost: { gold: 2 }
    purchase:
      text: "Here you go! Enjoy!"
      on_enter:
        - type: add_item
          item_id: fresh_apple
          quantity: 1
      responses: []
```

### 2. Quest Giver with Conditions:
```yaml
- id: quest_giver_advanced
  character: Town Captain
  conditions:
    - type: level_requirement
      min_level: 5
    - type: quest_status
      quest_id: previous_quest
      status: completed
  nodes:
    greeting:
      text: "You've proven yourself capable. I have a dangerous mission..."
```

## 🐛 Troubleshooting

### Common Issues:
1. **"No available dialogues"**: Check conditions and character names
2. **Dialogue not starting**: Verify YAML syntax and file loading
3. **Actions not working**: Check action syntax and game state integration
4. **Skill checks failing**: Ensure player has required stats/skills

### Debug Commands:
- `dialogue_status` - Check system status
- `test_dialogue` - Test with Village Elder
- `player` - Check player stats for skill requirements

## 🚀 Next Steps

1. **Create More Dialogues**: Add conversations for all your NPCs
2. **Quest Integration**: Connect dialogues to your quest system
3. **Voice Acting**: Add sound file references to dialogue nodes
4. **Branching Stories**: Create complex narrative branches
5. **Localization**: Prepare for multiple language support

Your YAML dialogue system is now fully integrated and ready to use! Start by testing with the provided Village Elder dialogue, then create your own conversations using the examples above.

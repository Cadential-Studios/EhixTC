# Dialogue System Design Document
*Edoria: The Triune Convergence*

## Overview

The dialogue system for Edoria should be flexible, data-driven, and capable of handling complex branching conversations with NPCs, enemies, and environmental interactions. The system needs to support narrative depth while maintaining performance and ease of content creation.

---

## Core Principles

### 1. **Data-Driven Architecture**
- All dialogue content stored in JSON files
- Easy for writers and designers to modify without touching code
- Version control friendly format
- Supports localization from the ground up

### 2. **Modular & Scalable**
- Dialogue trees can be easily added, removed, or modified
- Support for conditional branching based on player state
- Reusable dialogue fragments and responses

### 3. **Context-Aware**
- Dialogue changes based on player actions, quest states, relationships
- Dynamic content insertion (player name, recent events, etc.)
- Mood and tone variations based on NPC disposition

---

## Data Structure Design

### Dialogue Tree JSON Schema

```json
{
  "dialogue_id": "unique_identifier",
  "npc_id": "merchant_thalion",
  "title": "Merchant Conversation",
  "metadata": {
    "author": "Writer Name",
    "created": "2025-01-15",
    "version": "1.2",
    "tags": ["merchant", "quest", "tutorial"]
  },
  "conditions": {
    "required_flags": ["met_thalion"],
    "forbidden_flags": ["thalion_angry"],
    "min_level": 1,
    "required_items": [],
    "time_of_day": "any",
    "location": "marketplace"
  },
  "start_node": "greeting",
  "nodes": {
    "greeting": {
      "type": "npc_speech",
      "speaker": "Thalion",
      "text": "Welcome to my shop, {player_name}! What brings you here today?",
      "emotion": "friendly",
      "animation": "wave",
      "choices": [
        {
          "id": "browse_wares",
          "text": "I'd like to see what you have for sale.",
          "leads_to": "show_shop",
          "conditions": {}
        },
        {
          "id": "ask_quest",
          "text": "Do you have any work for an adventurer?",
          "leads_to": "quest_intro",
          "conditions": {
            "required_flags": ["tutorial_complete"]
          }
        },
        {
          "id": "leave",
          "text": "Just passing through. Farewell!",
          "leads_to": "farewell",
          "conditions": {}
        }
      ]
    },
    "show_shop": {
      "type": "action",
      "action": "open_shop",
      "parameters": {
        "shop_id": "thalion_general_goods"
      },
      "leads_to": "end"
    },
    "quest_intro": {
      "type": "npc_speech",
      "speaker": "Thalion",
      "text": "Ah, you have the look of someone who can handle themselves! I do have a problem that needs solving...",
      "emotion": "concerned",
      "choices": [
        {
          "id": "accept_quest",
          "text": "Tell me more.",
          "leads_to": "quest_details",
          "conditions": {}
        },
        {
          "id": "decline_quest",
          "text": "I'm not interested right now.",
          "leads_to": "quest_declined",
          "conditions": {}
        }
      ]
    },
    "farewell": {
      "type": "npc_speech",
      "speaker": "Thalion",
      "text": "Safe travels, friend! Come back anytime.",
      "emotion": "friendly",
      "leads_to": "end"
    },
    "end": {
      "type": "end_dialogue"
    }
  },
  "effects": {
    "on_start": [
      {
        "type": "set_flag",
        "flag": "talked_to_thalion",
        "value": true
      }
    ],
    "on_complete": [
      {
        "type": "modify_relationship",
        "npc": "thalion",
        "change": 5
      }
    ]
  }
}
```

---

## System Components

### 1. **Dialogue Manager**
- **File**: `src/assets/js/systems/dialogueManager.js`
- **Responsibilities**:
  - Load and parse dialogue trees
  - Manage current conversation state
  - Handle condition checking
  - Process dynamic text replacement
  - Trigger dialogue effects

### 2. **Dialogue UI Controller**
- **File**: `src/assets/js/ui/dialogueUI.js`
- **Responsibilities**:
  - Render dialogue interface
  - Handle player choice selection
  - Manage typing animations
  - Display character portraits/emotions
  - Handle dialogue history/log

### 3. **Condition Evaluator**
- **File**: `src/assets/js/systems/dialogueConditions.js`
- **Responsibilities**:
  - Check player flags, stats, inventory
  - Evaluate complex conditional logic
  - Time/location-based conditions
  - Relationship status checks

### 4. **Text Processor**
- **File**: `src/assets/js/utils/textProcessor.js`
- **Responsibilities**:
  - Dynamic text replacement ({player_name}, {current_time}, etc.)
  - Text formatting and styling
  - Localization support
  - Rich text parsing (colors, emphasis)

---

## File Organization

```
src/data/dialogue/
├── npcs/
│   ├── merchants/
│   │   ├── thalion.json
│   │   └── sarah_blacksmith.json
│   ├── quest_givers/
│   │   ├── elder_miran.json
│   │   └── captain_aldric.json
│   └── general/
│       ├── guards.json
│       └── civilians.json
├── enemies/
│   ├── bandits.json
│   ├── cultists.json
│   └── monsters.json
├── environmental/
│   ├── signs_and_books.json
│   ├── magical_artifacts.json
│   └── ancient_ruins.json
└── system/
    ├── tutorial.json
    ├── death_messages.json
    └── narrator.json
```

---

## Implementation Strategy

### Phase 1: Core Foundation
1. **Basic Dialogue Manager**
   - Simple linear conversations
   - JSON loading and parsing
   - Basic UI display

2. **Simple UI**
   - Text display area
   - Choice buttons
   - Basic styling with Tailwind

### Phase 2: Enhanced Features
1. **Conditional Logic**
   - Flag-based branching
   - Inventory/stat checks
   - Quest state integration

2. **Dynamic Content**
   - Text replacement system
   - Character name insertion
   - Variable content based on game state

### Phase 3: Advanced Features
1. **Rich UI**
   - Character portraits
   - Emotion/animation system
   - Typing effects and sound
   - Dialogue history

2. **Complex Systems**
   - Relationship tracking
   - Mood/disposition effects
   - Time-based dialogue variations

### Phase 4: Polish & Optimization
1. **Performance**
   - Dialogue caching
   - Lazy loading of large trees
   - Memory optimization

2. **Content Tools**
   - Dialogue editor interface
   - Validation tools
   - Export/import utilities

---

## Integration Points

### With Existing Systems

#### **Quest System**
- Dialogue can trigger quest start/completion
- Quest progress affects available dialogue options
- Dynamic quest status updates in conversation

#### **Inventory System**
- Check for required items in dialogue conditions
- Grant/remove items through dialogue effects
- Shop integration for merchant dialogues

#### **Character Stats**
- Stat-based dialogue unlocks (high charisma, etc.)
- Skill checks within conversations
- Experience rewards for social interactions

#### **Location System**
- Location-specific dialogue availability
- Environmental storytelling integration
- Area-based NPC mood modifiers

---

## Technical Considerations

### **Performance**
- Lazy load dialogue trees only when needed
- Cache frequently accessed conversations
- Minimize DOM manipulation during updates

### **Memory Management**
- Unload unused dialogue data
- Efficient storage of conversation history
- Garbage collection of temporary dialogue state

### **Error Handling**
- Graceful fallbacks for missing dialogue files
- Validation of dialogue tree structure
- Safe handling of circular references

### **Accessibility**
- Screen reader support for dialogue text
- Keyboard navigation for choices
- Text size/contrast options
- Audio cues for dialogue transitions

---

## Content Creation Workflow

### For Writers
1. **Create Dialogue Tree**
   - Use JSON template
   - Define conversation flow
   - Set appropriate conditions

2. **Test & Iterate**
   - In-game testing tools
   - Validation checks
   - Feedback integration

3. **Localization Prep**
   - Text extraction tools
   - Key generation
   - Context notes for translators

### For Designers
1. **Integration Planning**
   - Determine NPC placement
   - Set trigger conditions
   - Plan quest integration

2. **Balancing**
   - Reward/consequence design
   - Pacing considerations
   - Player choice impact

---

## Future Enhancements

### **Advanced Features**
- Voice acting integration
- Lip sync and facial animation
- Branching dialogue based on player class/background
- Procedural dialogue generation for minor NPCs

### **Content Tools**
- Visual dialogue tree editor
- Analytics for player choice tracking
- A/B testing framework for dialogue effectiveness

### **Community Features**
- User-generated dialogue mod support
- Community translation tools
- Dialogue sharing and rating system

---

## Success Metrics

### **Technical Metrics**
- Dialogue loading time < 100ms
- Memory usage < 50MB for dialogue system
- Zero dialogue tree parsing errors

### **Content Metrics**
- Average conversation length: 3-5 exchanges
- Player choice distribution tracking
- Dialogue replay rate for important conversations

### **Player Experience**
- Survey feedback on dialogue quality
- Player engagement with optional conversations
- Completion rate for dialogue-heavy content

---

*This document will be updated as the dialogue system evolves and new requirements emerge.*

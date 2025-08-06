# Copilot Guide for Edoria: The Triune Convergence

**Purpose**
This guide directs AI coding agents working on the *Edoria: The Triune Convergence* codebase. It ensures contributions are productive, lore‑consistent, and maintainable.

---

## 1. Project Overview

* **Type:** HTML5 interactive RPG (fantasy, story‑driven)
* **Stack:** HTML5, CSS3 (Tailwind), JavaScript (ES6+), JSON
* **Entry point:** `index.html` (do not alter structure unless explicitly requested)

---

## 2. Directory Layout

```
├── src/
│   ├── assets/
│   │   ├── js/        # Game logic (main.js, developerMenu.js, etc.)
│   │   ├── css/       # Styling (main.css, Tailwind config)
│   │   └── images/    # Artwork and icons
│   └── data/          # JSON game content (locations, scenes, items, quests…)
├── saves/             # Player save files (JSON)
├── docs/              # Documentation, changelogs, templates, TODO files
├── tests/             # Jest unit tests for JS modules
└── index.html         # Main HTML shell
```

---

## 3. Conventions

### 3.1 JSON

* Follow the strict schemas in `AGENTS.md`.
* Use `snake_case` for keys and IDs.
* Always validate JSON before committing.

### 3.2 JavaScript

* ES6+ syntax, modular functions.
* Use `camelCase` for variables and functions.
* Use async/await for any I/O or data loading.

### 3.3 CSS

* Use Tailwind utility classes.
* Custom classes follow a BEM‑like pattern.

### 3.4 Lore & Tone

* All content must fit Edoria’s fantasy setting.
* Maintain a cohesive, immersive tone in code comments and text.

---

## 4. Workflow Rules

### 4.1 Branching

1. Never work directly on `main`.
2. Use `develop` for integration, and create feature/content branches for new work.
3. Before starting, always confirm you’re on the correct branch (`git branch` → `git checkout [branch]`).

### 4.2 Testing

* Add or update Jest tests in `tests/` whenever JS logic changes.
* Validate JSON and run the game in desktop and mobile browsers after edits.

### 4.3 Documentation & Tracking

* Log every completed task in the `implementation_log` section of the todo file
* Update relevant docs under `docs/` for new features or bug fixes.
* Track work items in `docs/updates/todo/` as markdown; move finished items to `docs/updates/complete/`.

---

## 5. Common AI‑Driven Tasks

* **Add content:**

  * Edit JSON under `src/data/`.
  * Follow schema and maintain cross‑references.
* **Modify logic:**

  * Touch JS modules under `src/assets/js/`.
  * Keep code modular and well‑documented.
* **Style updates:**

  * Edit Tailwind or `main.css` under `src/assets/css/`.
* **New features:**

  * Combine JSON data updates + JS logic + CSS tweaks.
  * Write or update tests and documentation.

---

## 6. “High‑Level” Directives

> **When you receive a clear, high‑level command**—for example, “Complete all tasks in the TODO files”—**do not ask for sub‑confirmation.**
> Instead, proceed to:
>
> 1. Read through `docs/updates/todo/*.md`.
> 2. Execute each item in the order that best serves game flow.
> 3. Update tests, implementation logs, and move the TODO file to `docs/updates/complete/` when done.

---

## 7. Absolute Don’ts

* Never edit `index.html` structure unless expressly asked.
* Don’t break JSON relationships or remove required fields.
* Don’t change file paths without updating all references.
* Don’t commit untested or incomplete code.

---

## 8. Absolute Do’s

* Always validate JSON and run the game after any change.
* Maintain consistent code style and naming conventions.
* Communicate uncertainties or limitations promptly.
* Keep `AGENTS.md` and project docs up to date if you introduce new workflows.

---

> **Need more detail?** See `AGENTS.md` and the templates in `docs/`.
> **Let’s build Edoria together—one commit at a time.**

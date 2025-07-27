
EhixTC — Bugs & Technical Debt To-Do List

Status: In Progress
Created: 2025-07-27 — 17:45
Owner: @Cadential-Studios

Bugs & Issues

This section tracks current bugs and technical issues for triage and resolution.

To-Do Items

- [ ] Replace cdn.tailwindcss.com with a production-ready Tailwind CSS build (PostCSS plugin or Tailwind CLI)
- [ ] Fix ReferenceError: edyriaPhase is not defined in src/assets/js/utils/core.js:999
- [ ] Resolve spell data load failure: SyntaxError: Unexpected token '<', "<!DOCTYPE ... is not valid JSON"
- [ ] Fix TypeError: e.target.hasAttribute is not a function in src/assets/js/ui/inventoryUIFeatures.js:515 and :526
- [ ] Remove duplicate level up pop up; keep only the one with the star icon

Implementation Details:

Code files to modify:
- src/assets/js/utils/core.js
- src/assets/js/ui/inventoryUIFeatures.js
- index.html (for Tailwind CSS)

Frameworks/Libraries touched:
- Tailwind CSS

Testing Performed:
Type: Manual, Unit
Tools Used: Jest, Browser DevTools
Platforms Tested: Browser (Chrome, Firefox, Edge)

Results:
- [Pending] Bugs identified and reproducible
- [Pending] Fixes verified in local/dev environment

Findings & Observations:
- CDN usage for Tailwind is not suitable for production
- Some event handlers may be receiving unexpected event targets

Next Steps / Recommendations:
- Implement fixes for each bug
- Add regression tests where possible
- Review event delegation logic in inventory UI

Update Log
2025-07-27 — 17:45: Initial bug list and to-do formatting using project template

Developer Notes
Follow naming conventions in STYLE_GUIDE.md
Validate all data using linters and schema checks
Include inline comments or JSDoc where needed
Integrate bug fixes into CI pipeline
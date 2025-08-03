# Code Organization & Optimization Task List

## 1. Modularization & Structure
- Refactor large JS files into smaller, single-responsibility modules (e.g., split inventory, UI, and system logic).
- Move utility/helper functions into dedicated utility modules (e.g., `utils/`).
- Ensure all data schemas and interfaces are documented and validated (especially in `src/data/`).

## 2. Code Cleanliness & Consistency
- Remove unused variables, functions, and legacy code.
- Standardize naming conventions across all files (camelCase for JS, snake_case for JSON, BEM for CSS).
- Add or update JSDoc comments for all major functions and classes.

## 3. Performance & Efficiency
- Debounce or throttle expensive UI updates (e.g., search/filter in inventory).
- Lazy-load non-critical modules (e.g., modals, analytics, tooltips).
- Optimize DOM queries and minimize reflows/repaints in UI scripts.
- Review and optimize data lookups (e.g., use maps/objects for frequent item lookups).

## 4. CSS & Styling
- Remove redundant or unused CSS classes.
- Consolidate repeated style rules and use CSS variables for theme colors.
- Ensure all custom UI elements (scrollbars, checkboxes, modals) are consistent and responsive.

## 5. Testing & Validation
- Increase test coverage for core systems (inventory, foraging, combat, etc.).
- Add tests for edge cases and error handling.
- Validate all JSON data against schemas before loading.

## 6. Documentation & Developer Experience
- Update and expand documentation in `docs/` (especially for new or refactored modules).
- Add code examples and usage notes for complex systems.
- Maintain a clear changelog and implementation log for all major changes.

## 7. Accessibility & UX
- Audit and improve ARIA roles, keyboard navigation, and focus management.
- Ensure all interactive elements are accessible and provide feedback.

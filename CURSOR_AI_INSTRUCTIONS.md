# 🧠 Cursor AI Instructions

> Use this as your coding, fixing, and UI creation guideline. Always follow these principles when editing or creating anything in this project.

## ✅ General Coding Guidelines

- **Fix Errors from the Root**

  - Before applying any fix, **analyze the entire codebase** for related issues.
  - Your **first priority** should always be to fix errors at their **root cause**, not just patch symptoms.

- **Use Proper Naming**

  - File names must follow the format: `full-name.jsx` or `full-name.js`.
  - Use **clear, descriptive, and consistent** variable and function names.

- **Prefer `const`**
  - Use `const` for all variables unless reassignment is absolutely necessary.
  - Only use `let` when mutation is required.

---

## 🎨 UI & Design Standards

- **Follow Existing Design Patterns**

  - When building or updating UI, match the **existing style** of similar components or the overall website.
  - Maintain **visual and functional consistency** across the project.
  - Use design systems like ShadCN UI to ensure consistency in layout, typography, and color schemes.

- **Use ShadCN UI & Lucide React**

  - Build UI components using **ShadCN UI** as the primary library.
  - Use **Lucide React** for icons.
  - Take advantage of ShadCN UI's built-in accessibility features and responsive design.

- **Make Everything Responsive**
  - Ensure that all UI components are fully **responsive** across screen sizes.
  - Apply mobile-first principles and test layout flexibility.

---

## 🗂️ File Structure & Component Use

- Group files logically according to purpose:

  - `hooks/` for custom hooks
  - `store/` for Zustand stores
  - `api/` or `services/` for API handlers
  - `models/` for Mongoose schemas
  - `components/` for reusable UI elements

- Maintain consistent **structure, naming, and coding style** across all files of the same type.

---

**Always aim for clean, maintainable, and scalable code.**
Make intelligent decisions based on the project's current architecture and design system.

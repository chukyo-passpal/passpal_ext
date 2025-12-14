# Code Style and Conventions

## Language & Configuration

- **TypeScript**: Strict mode enabled (`strict: true`). Use explicit types where possible.
- **Target**: ESNext.
- **Module System**: ES Modules (`type: "module"` in package.json).

## Linting & Formatting

- **ESLint**: Uses `typescript-eslint/recommended` and `eslint:recommended`.
- **Prettier**: Used for code formatting (implied by `prettier` dependency).
- **Globals**: Browser, Node, and WebExtensions globals are available.

## Framework & Libraries

- **React**: Use Functional Components and Hooks.
- **State**: Use **Zustand** for global state management.
- **Routing**: Use **TanStack Router** for the popup UI routing.
- **Styling**:
    - **Tailwind CSS**: Preferred for utility-first styling.
    - **Sass**: Supported for custom styles (e.g., `popup.css` imports).

## Directory Structure

- **Feature-based**: Components are often grouped by feature (e.g., `components/auth`, `components/dashboard`).
- **Content Scripts**: Located in `contents/`. Each script targets specific URLs defined in `manifest.json`.

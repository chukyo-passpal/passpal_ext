# Suggested Commands

The project uses **Bun** as the package manager.

## Development

- `bun run dev`: Start the development server with hot reload (`extension dev`).
- `bun run gen-routes`: Generate routes for TanStack Router (run this when adding/modifying routes in `action/routes`).

## Build

- `bun run build`: Build the extension for production. This runs route generation first
  (`tsr generate && extension build`).

## Quality Control

- `bun run lint`: Run ESLint to check for code quality issues (`eslint . --ext .ts,.tsx --fix`).

## Other

- `bun install`: Install dependencies.

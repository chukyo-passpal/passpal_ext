# Project Overview

**Project Name**: passpal_ext (Manifest Name: `chukyo-manabo-extensions`)

**Description**: A browser extension designed to support students at Chukyo University by enhancing the "PassPal"
learning support tools (Manabo, Cubics, etc.). It includes features for auto-login, attendance buttons, and video
controls.

**Tech Stack**:

- **Language**: TypeScript (Target: ESNext)
- **Framework**: React v19
- **State Management**: Zustand
- **Routing**: TanStack Router (`@tanstack/react-router`)
- **Styling**: Tailwind CSS, Sass
- **Build Tool**: `extension` CLI, Bun
- **Package Manager**: Bun

**Key Directories**:

- `action/`: The extension's popup UI (React application).
- `contents/`: Content scripts injected into specific university pages (Manabo, Shibboleth, etc.).
- `services/`: Background service worker (`background.ts`).
- `pages/`: Offscreen pages (e.g., `offscreen.html`).
- `store/`: Global state management (Zustand).
- `utils/`: Utility functions.
- `manifest.json`: Manifest V3 configuration.

**Key Features**:

- **Popup UI**: Dashboard, Settings, Auth (Google Login).
- **Content Scripts**:
    - `Powerful_Syusseki_Caller`: Attendance button injection.
    - `shib_login`: Auto-login for Shibboleth.
    - `video_controller`: Enhanced video controls.
    - `manabo_auto_reauth`: Auto re-authentication.

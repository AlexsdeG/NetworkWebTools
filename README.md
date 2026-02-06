# NetworkWebTools

A modern, monorepo-based suite of network and diagnostic tools. This project includes a full-stack application featuring a React frontend and an Express backend.

![App Screenshot](https://github.com/AlexsdeG/NetworkWebTools/blob/main/NetworkWebTools.png)

## 🚀 Projects

- **[Client (Frontend)](./apps/client)**: A sleek, React-based dashboard for interactive network diagnostics.
- **[API (Backend)](./apps/api)**: A secure Express API providing tools for scanning, SMTP testing, and IP information.

## ✨ Main Features

- **Port & IP Scanner**: Efficiently scan networks and ports.
- **SMTP Test Tool**: Validate mail server configurations.
- **IP Info**: Geolocation and detailed info for IP addresses.
- **Modern Tech Stack**: Built with TypeScript, React, Vite, and Express.
- **Monorepo Management**: Powered by `pnpm` for blazing fast workspace management.

## 🛠️ Development

This project uses a `pnpm` workspace. You can manage everything from the root directory.

### Quick Start

```bash
# Install dependencies for all apps
pnpm install

# Start both backend and frontend in parallel
pnpm dev

# Build all applications
pnpm build
```

### Specific Scripts

- `pnpm dev:client`: Start only the frontend.
- `pnpm dev:api`: Start only the backend.

---

*NetworkWebTools — Empowering security and diagnostic tasks.*

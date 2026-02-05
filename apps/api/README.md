# NetworkWebTools - API 🚀

Secure Express backend providing powerful network diagnostic tools.

## ✨ Features

- **🔐 Robust Security**:
  - `Helmet` for secure HTTP headers.
  - `Express-Rate-Limit` to prevent brute-force/DoS.
  - `CORS` configured for controlled frontend access.
- **🛡️ Authentication**:
  - JWT-based authentication.
  - Secure password hashing with `bcryptjs`.
- **🛠️ Network Tools**:
  - **Port Scanner**: Fast scanning using `evilscan`.
  - **IP Info**: Geolocation and detailed network information via `geoip-lite`.
  - **SMTP Tester**: Validate mail server connectivity and functionality.
- **📐 Validated Environment**: Strict environment variable validation using `Zod`.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express with TypeScript
- **Execution**: `tsx` for modern ESM support and fast development restarts.
- **Validation**: Zod (for environment and API payloads).

## 🏃 Getting Started

### Prerequisites

Create a `.env` file in this directory:

```env
PORT=3010
NODE_ENV=development
JWT_SECRET=your_super_secret_key
ADMIN_PASS_HASH=your_bcrypt_hashed_admin_password
CORS_ORIGIN=http://localhost:3000

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_FROM=your_email
SMTP_SECURE=false
```

npx bcryptjs hash "your-desired-password"

### Scripts

- `pnpm dev`: Start development server with `tsx watch`.
- `pnpm build`: Compile TypeScript to JavaScript.
- `pnpm start`: Run the compiled production build.

## 🔌 API Endpoints (Overview)

- **Auth**:
  - `POST /api/auth/login`
- **Tools**:
  - `POST /api/tools/scan`: Start a port scan.
  - `GET /api/tools/ip-info?ip=...`: Get detailed IP geolocation.
  - `POST /api/tools/smtp-test`: Test an SMTP server.

---
*Part of the NetworkWebTools Suite.*

## 🐳 Docker

Build and run the API in a container. This Dockerfile expects to be built from the repository root (so the workspace lockfile is available to the build context).

Build (from repository root):

```bash
docker build -f apps/api/Dockerfile -t networkwebtools-api .
```

Run (maps host port 64573 to container port 3010):

```bash
docker run -d \
  --name networkwebtools-api \
  --env-file apps/api/.env \
  -p 64573:3010 \
  networkwebtools-api
```

Notes:
- The container runs the compiled app from `dist/main.js`.
- Ensure `apps/api/.env` contains required environment variables (see above).
- If you prefer to build from `apps/api` as the build context, copy the root `pnpm-lock.yaml` into the build context or run pnpm install inside the container without the lockfile.

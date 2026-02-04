## 1. Global Project Structure

This structure must be established before Phase 1 begins.

```text
/network-tools-suite
├── /backend
│   ├── /src
│   │   ├── /controllers     # Logic: authController.js, scanController.js, ipController.js, smtpController.js
│   │   ├── /middleware      # authMiddleware.js, validateRequest.js, rateLimit.js
│   │   ├── /routes          # authRoutes.js, toolRoutes.js
│   │   ├── /services        # Abstractions for evilscan, nodemailer, geoip
│   │   ├── /utils           # logger.js, validators.js (Zod schemas)
│   │   ├── server.js        # Express app entry point
│   │   └── app.js           # Express app setup (separated from listener for testing)
│   ├── /tests               # Jest test files
│   ├── .env.example
│   ├── package.json
│   └── jest.config.js
├── /frontend
│   ├── /src
│   │   ├── /api             # axiosClient.js (Interceptors)
│   │   ├── /components      # Layout.jsx, PrivateRoute.jsx, Navbar.jsx
│   │   ├── /features        # /auth (Login), /tools (Scanner, IP, SMTP components)
│   │   ├── /pages           # LoginPage.jsx, Dashboard.jsx
│   │   ├── /hooks           # useAuth.js, useScan.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── package.json (Root - Optional workspace config)

```

---

## Phase 1: Foundation & Infrastructure

**Goal:** Initialize a working monorepo with connected Frontend and Backend, and a running test harness.

### Step 1.1: Backend Initialization

* **Action:**
* Initialize `backend/package.json`.
* Install core deps: `express`, `cors`, `helmet`, `dotenv`, `zod`.
* Install dev deps: `jest`, `supertest`, `nodemon`.
* Create `backend/src/app.js` (Express setup with JSON body parser, CORS, Helmet).
* Create `backend/src/server.js` (Server listener).


* **Test Integration:**
* Create `backend/tests/health.test.js`.
* **Test Case:** `GET /health` returns status 200 and `{ status: "ok" }`.



### Step 1.2: Frontend Initialization

* **Action:**
* Initialize Vite React project in `/frontend`.
* Install deps: `axios`, `react-router-dom`, `@tanstack/react-query`, `lucide-react`, `tailwindcss`, `postcss`, `autoprefixer`.
* Initialize Tailwind CSS config.
* Create a simple "Hello World" `App.jsx`.


* **Test Integration:**
* Verify build passes via `pnpm build`.



---

## Phase 2: Authentication System (The Gatekeeper)

**Goal:** Secure the backend and create the frontend login flow. No tools are built yet; only the keys.

### Step 2.1: Backend Auth Logic

* **Action:**
* Install `jsonwebtoken`, `bcryptjs`.
* Update `.env` with `JWT_SECRET` and `ADMIN_PASS_HASH`.
* Create `backend/src/controllers/authController.js` with `login` function.
* Create `backend/src/routes/authRoutes.js`.


* **Test Integration:**
* Create `backend/tests/auth.test.js`.
* **Test Case 1:** POST `/api/auth/login` with correct password returns 200 + JWT.
* **Test Case 2:** POST `/api/auth/login` with wrong password returns 401.



### Step 2.2: Backend Auth Middleware

* **Action:**
* Create `backend/src/middleware/authMiddleware.js`.
* Logic: Parse `Authorization: Bearer <token>`, verify signature.
* Create a dummy protected route `/api/protected-ping` for testing.


* **Test Integration:**
* Update `backend/tests/auth.test.js`.
* **Test Case 3:** GET `/api/protected-ping` without header returns 401.
* **Test Case 4:** GET `/api/protected-ping` with valid token returns 200.



### Step 2.3: Frontend Auth State & Login UI

* **Action:**
* Create `frontend/src/api/axiosClient.js`: Add interceptor to inject Token from LocalStorage.
* Create `frontend/src/features/auth/Login.jsx`: Form with Password input.
* Create `frontend/src/context/AuthContext.jsx`: Manage user session state.


* **Test Integration:**
* Manual verification: Login with correct password redirects to dashboard (which is currently empty).



---

## Phase 3: Backend Tools Implementation (The Probe)

**Goal:** Implement the "heavy lifting" logic in Node.js.

### Step 3.1: Port Scanner Endpoint

* **Action:**
* Install `evilscan`.
* Create `backend/src/utils/validators.js`: Add Zod schema for IP and Port validation.
* Create `backend/src/controllers/scanController.js`: Implement `evilscan` logic with strict timeout (2000ms).
* Create route `POST /api/tools/scan`.


* **Test Integration:**
* Create `backend/tests/scan.test.js`.
* **Test Case 1:** Valid localhost scan (Port 3000/Backend port) returns `open`.
* **Test Case 2:** Invalid IP input returns 400 (Zod validation error).



### Step 3.2: IP Metadata Endpoint

* **Action:**
* Install `request-ip`, `geoip-lite`, `ipaddr.js`.
* Create `backend/src/controllers/ipController.js`.
* Logic: Extract IP -> Normalize -> Lookup Geo -> Return JSON.
* Create route `GET /api/tools/my-ip`.


* **Test Integration:**
* Create `backend/tests/ip.test.js`.
* **Test Case:** Mock `x-forwarded-for` header and assert correct Geo JSON response.



### Step 3.3: SMTP Tester Endpoint

* **Action:**
* Install `nodemailer`.
* Create `backend/src/controllers/smtpController.js`.
* Logic: `createTransport` -> `verify()`. Handle `EAUTH` and `ETIMEDOUT` specific errors for clean UI feedback.
* Create route `POST /api/tools/test-smtp`.


* **Test Integration:**
* Create `backend/tests/smtp.test.js`.
* **Test Case:** Mock Nodemailer `verify` to return true/false and check API response code.



---

## Phase 4: Frontend Implementation (The Remote)

**Goal:** Build the UI to interact with the now-ready Backend APIs.

### Step 4.1: Dashboard & Navigation

* **Action:**
* Create `frontend/src/components/Layout.jsx`: Sidebar/Navbar with Logout button.
* Setup `react-router-dom` in `App.jsx` with `PrivateRoute` wrapper.



### Step 4.2: Port Scanner UI

* **Action:**
* Create `frontend/src/features/tools/PortScanner.jsx`.
* Inputs: Host (Default: User's IP), Port Range (Presets: "Common", "Database", "All").
* Output: Grid view of ports. Green = Open, Red = Closed.
* Use `useMutation` (React Query) for the scan request.



### Step 4.3: My IP & Metadata UI

* **Action:**
* Create `frontend/src/features/tools/IpInfo.jsx`.
* Use `useQuery` (React Query) to fetch `/api/tools/my-ip` on mount.
* Display: Map coordinates (text), City, ISP, IP Version.



### Step 4.4: SMTP Tester UI

* **Action:**
* Create `frontend/src/features/tools/SmtpTester.jsx`.
* Form: Host, Port, User, Pass (masked), SSL Toggle.
* Feedback: Toast notification or status banner (Success/Fail).



---

## Phase 5: Security Hardening & Polish

**Goal:** Prepare for "production-ready" status (even for private use).

### Step 5.1: Rate Limiting (Crucial)

* **Action:**
* Install `express-rate-limit`.
* Apply Global Limit: 100 req/15min.
* Apply Strict Limit to `/api/tools/scan`: 5 scans per minute per IP.


* **Test Integration:**
* Test `scan.test.js`: Fire 6 requests rapidly and ensure the 6th returns 429 (Too Many Requests).



### Step 5.2: Final End-to-End Check

* **Action:**
* Verify `.env` has all production keys.
* Run `pnpm test` in backend (ensure all 10+ tests pass).
* Manual walkthrough: Login -> Check Own IP -> Scan Localhost -> Logout.

## 1. Backend Specific Architecture

We will use a **Service-Controller-Route** pattern to keep business logic testable and separated from HTTP transport layers.

```text
/backend
├── /src
│   ├── /config          # Configuration loader (env vars)
│   ├── /controllers     # HTTP Request/Response handling
│   ├── /middleware      # Express Middleware (Auth, Validation, Errors)
│   ├── /routes          # Route definitions
│   ├── /services        # Core logic (Scanning, SMTP, IP lookup)
│   ├── /utils           # Helpers (Logger, Zod Schemas)
│   ├── app.js           # Express App setup (for testing)
│   └── server.js        # Server listener (starts app)
├── /tests               # Jest test suite
│   ├── /integration     # Supertest API tests
│   └── /unit            # Service logic tests
├── jest.config.js
└── package.json

```

---

## Phase 1: Core Foundation & Testing Harness

**Goal:** Initialize a secure Express app with a working test environment before adding features.

### Step 1.1: Project Skeleton & Dependencies

* **Action:**
* Initialize `package.json` with `type: "module"`.
* Install **Runtime:** `express`, `cors`, `helmet`, `dotenv`, `zod`.
* Install **Dev:** `jest`, `supertest`, `nodemon`, `cross-env`.
* Create `src/config/env.js`: Centralized env loader using `dotenv` (validates keys like `PORT`, `JWT_SECRET`).


* **Verification:** Run `node src/config/env.js` and ensure it throws an error if `.env` is missing.

### Step 1.2: Express App Setup

* **Action:**
* Create `src/app.js`:
* Setup `express()`.
* Use `helmet()` (Security headers).
* Use `cors()` (Configured to allow frontend origin).
* Use `express.json()` (Body parsing).
* Add a simple `/health` route.


* Create `src/server.js`: Import `app` and call `app.listen()`.


* **Test Integration:**
* Create `tests/integration/health.test.js`.
* Use `supertest` to request `GET /health`. Expect status 200.
* Run `pnpm test`.



---

## Phase 2: Security & Authentication Layer

**Goal:** Build the "Gatekeeper" to protect all tools.

### Step 2.1: Auth Logic & Token Generation

* **Action:**
* Install `jsonwebtoken` and `bcryptjs`.
* Create `src/services/authService.js`:
* `login(password)`: Compare input against `process.env.ADMIN_PASS_HASH`. Return JWT if valid.


* Create `src/controllers/authController.js`: Handles HTTP inputs.
* Create `src/routes/authRoutes.js`: Define `POST /login`.


* **Test Integration:**
* Create `tests/unit/authService.test.js`.
* Mock `bcrypt.compare` to verify logic without real hashes.



### Step 2.2: Auth Middleware

* **Action:**
* Create `src/middleware/authMiddleware.js`.
* Logic: Extract `Bearer` token -> `jwt.verify()` -> Attach `req.user` or return 401/403.
* Register this middleware globally for `/api/tools/*` routes in `app.js`.


* **Test Integration:**
* Create `tests/integration/authMiddleware.test.js`.
* Try accessing a dummy protected route without a token. Expect 401.



---

## Phase 3: Feature - Port Scanner Service

**Goal:** Implement the `evilscan` wrapper securely.

### Step 3.1: Scanner Service (The "Probe")

* **Action:**
* Install `evilscan`.
* Create `src/services/scanService.js`.
* **Logic:** Export a function `scanTarget(ip, ports)`.
* **Wrapper:** `evilscan` uses events. Wrap it in a `Promise` so we can `await` the results in the controller.
* **Constraint:** Hardcode a 2000ms timeout in options to prevent hanging processes.


* **Test Integration:**
* Create `tests/unit/scanService.test.js`.
* Scan `127.0.0.1` on port `3000` (where the test server runs). Expect result to contain `{ status: 'open' }`.



### Step 3.2: Scanner Controller & Validation

* **Action:**
* Create `src/utils/validators.js`: Define Zod schema:
```javascript
z.object({
  target: z.string().ip(),
  ports: z.string().regex(/^([0-9]+(,[0-9]+)*)?$/) // "80,443" format
})

```


* Create `src/controllers/scanController.js`: Validate input -> Call Service -> Return JSON.
* Add route `POST /api/tools/scan`.


* **Test Integration:**
* `tests/integration/scan.test.js`: Send invalid IP `999.999.999`. Expect 400 Bad Request.



---

## Phase 4: Feature - IP Metadata Service

**Goal:** Implement IP detection and Geo-lookup.

### Step 4.1: IP Service

* **Action:**
* Install `request-ip`, `geoip-lite`, `ipaddr.js`.
* Create `src/services/ipService.js`.
* **Method A:** `getPublicIp(req)`: Use `request-ip` to get client IP. Clean it using `ipaddr.js` (convert `::ffff:127.0.0.1` to `127.0.0.1`).
* **Method B:** `getGeoData(ip)`: Query `geoip-lite`. Return object `{ city, country, ll, timezone }`.



### Step 4.2: IP Controller

* **Action:**
* Create `src/controllers/ipController.js`.
* Route `GET /api/tools/my-ip`.
* Logic: `const ip = ipService.getPublicIp(req); const geo = ipService.getGeoData(ip);`


* **Test Integration:**
* `tests/integration/ip.test.js`: Manually set header `X-Forwarded-For: 8.8.8.8` in supertest. Expect response to say "United States".



---

## Phase 5: Feature - SMTP Tester Service

**Goal:** Implement the Nodemailer verification tool.

### Step 5.1: SMTP Service

* **Action:**
* Install `nodemailer`.
* Create `src/services/smtpService.js`.
* **Logic:** `verifyConnection(settings)`.
* Create a transporter with `connectionTimeout: 5000`.
* Run `transporter.verify()`.
* **Error Handling:** Catch `EAUTH` (Bad password) vs `ETIMEDOUT` (Firewall) vs `ENOTFOUND` (Bad Host). Return clean error codes to controller.



### Step 5.2: SMTP Controller

* **Action:**
* Create `src/controllers/smtpController.js`.
* Route `POST /api/tools/test-smtp`.
* **Input Validation:** Ensure `host` is string, `port` is number (1-65535).


* **Test Integration:**
* `tests/unit/smtpService.test.js`: Mock `nodemailer.createTransport` using `jest.fn()`. Ensure `verify` is called.



---

## Phase 6: Hardening & Production Prep

**Goal:** Prevent abuse and prepare for deployment.

### Step 6.1: Rate Limiting

* **Action:**
* Install `express-rate-limit`.
* Create `src/middleware/rateLimit.js`.
* **Rule:** 5 requests per minute for `/api/tools/scan`.
* **Rule:** 100 requests per 15 min for all other API routes.


* **Test:** Fire 6 requests to scan endpoint in a loop. Expect 429.

### Step 6.2: Final Code Review

* **Check:** Ensure no `console.log` of sensitive data (passwords).
* **Check:** Ensure `helmet` is active.
* **Check:** Ensure all tests pass (`pnpm test`).

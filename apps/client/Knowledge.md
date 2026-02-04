
## 1. Project Overview

**Name:** Secure Network Tools Suite
**Type:** Monorepo-style Web Application (Frontend + Backend)
**Purpose:** A private, self-hosted toolkit for network diagnostics including port scanning, IP metadata analysis, and SMTP server testing.
**Core Constraint:** The application is **strictly private**. It must include an authentication layer to prevent public access, mitigating the risk of abuse and hosting provider bans.

---

## 2. Tech Stack & Packages

### 2.1 Backend (Node.js / Express)

* **Runtime:** Node.js (v18+)
* **Package Manager:** `pnpm`
* **Core Dependencies:**
* `express`: Web server framework.
* `cors`: Handling Cross-Origin Resource Sharing.
* `dotenv`: Loading environment variables (Port, Auth Hash, Secrets).
* `helmet`: Basic security headers.
* `zod`: Schema validation for all incoming API requests (Critical for security).


* **Auth & Security:**
* `jsonwebtoken`: Generating stateless session tokens after login.
* `bcryptjs`: Verifying the password against the stored hash.
* `express-rate-limit`: Preventing brute-force attacks on the scanner.


* **Network Tools:**
* `evilscan`: Efficient, concurrent TCP port scanning.
* `nodemailer`: SMTP handshake and connection verification.
* `request-ip`: Extracting the true client IP (handling proxies/headers).
* `geoip-lite`: Resolving IP addresses to geographic metadata (Zero-latency local DB).
* `ipaddr.js`: Normalizing IPv6 mapped addresses (e.g., `::ffff:127.0.0.1`).



### 2.2 Frontend (Vite + React)

* **Build Tool:** Vite
* **Framework:** React (TypeScript recommended for type safety).
* **Styling:** TailwindCSS (Utility-first for rapid UI dev).
* **State/Async Management:** `@tanstack/react-query` (Handling loading states, caching, and error states for network requests).
* **HTTP Client:** `axios` (Better interceptor support for attaching Auth tokens than native fetch).
* **Icons:** `lucide-react` (Clean, modern icons for UI).
* **Routing:** `wouter` or `react-router-dom` (Simple routing between Login and Dashboard).

---

## 3. Project File Structure

The project should follow a clean separation of concerns.

```text
/network-tools-suite
├── /backend
│   ├── /src
│   │   ├── /controllers     # Logic for each tool (scan, smtp, ip)
│   │   ├── /middleware      # authMiddleware.js, rateLimit.js
│   │   ├── /routes          # Express router definitions
│   │   ├── /utils           # Helper functions (logging, validation)
│   │   └── server.js        # Entry point
│   ├── .env                 # PORT, JWT_SECRET, ADMIN_PASSWORD_HASH
│   └── package.json
├── /frontend
│   ├── /src
│   │   ├── /components      # Reusable UI (Button, Input, Card)
│   │   ├── /hooks           # Custom hooks (useAuth, useScan)
│   │   ├── /pages           # Login.jsx, Dashboard.jsx, Tools/*.jsx
│   │   ├── /api             # axios instance configuration
│   │   └── App.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md

```

---

## 4. Authentication System Implementation

This is the "Gatekeeper" feature. The app must block *all* functional routes until a valid token is present.

### 4.1 Concept

1. **Storage:** Store a BCRYPT hash of the desired password in `backend/.env` (Key: `ADMIN_PASS_HASH`).
2. **Login:** User sends plain password to `/api/login`.
3. **Verification:** Backend uses `bcrypt.compare()`.
4. **Session:** If valid, Backend issues a generic JWT (signed with `JWT_SECRET`).
5. **Protection:** Middleware checks the `Authorization: Bearer <token>` header on every tool request.

### 4.2 Code Snippet: Backend Auth Middleware

```javascript
// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

```

### 4.3 Code Snippet: Login Controller

```javascript
// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { password } = req.body;
  const storedHash = process.env.ADMIN_PASS_HASH;

  const isValid = await bcrypt.compare(password, storedHash);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Issue Token (Valid for 24 hours)
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};

```

---

## 5. Feature Specifications

### 5.1 Tool: Port Scanner

* **Input:** Target IP (String), Port Range (String/Array).
* **Logic:**
* **External Scan:** Check if `target` == `req.ip` (Self Scan) or other.
* **Limitation:** If scanning a 3rd party IP, strict rate limits apply.
* **Library:** `evilscan`


* **Validation (Zod):**
```javascript
const scanSchema = z.object({
  target: z.string().ip(), 
  ports: z.string().regex(/^[\d,]+$/) // "80,443,8080"
});

```


* **Implementation Note:** `evilscan` is event-based. Wrap it in a Promise to use with `async/await`.

### 5.2 Tool: My IP & Metadata

* **Logic:** Use `request-ip` to bypass Nginx/Proxy headers and find the real IP. Then query `geoip-lite`.
* **Data Returned:** IPv4/6, City, Region, Country, ISP (if available via fallback API), Timezone.
* **Snippet (GeoIP):**
```javascript
import geoip from 'geoip-lite';
// ... inside route
const geo = geoip.lookup(ip); // Returns object or null

```



### 5.3 Tool: SMTP Tester

* **Input:** Host (e.g., `smtp.gmail.com`), Port, User, Password, TLS Toggle.
* **Logic:**
* Use `nodemailer.createTransport`.
* Set `secure: true` for port 465, `secure: false` for 587/25.
* For 587, `nodemailer` automatically attempts STARTTLS.
* Run `transporter.verify()` to test auth without sending mail.


* **Attention Point:** Catch specific error codes (e.g., `EAUTH` for bad password, `ETIMEDOUT` for firewall).

---

## 6. Critical Attention Points & "Gotchas"

### 6.1 Hosting Provider Bans (High Risk)

* **Issue:** Most cloud providers (AWS, Vercel, DigitalOcean, Heroku) strictly prohibit outbound port scanning. They detect it as "network abuse."
* **Mitigation:**
1. **Rate Limiting:** Ensure the scanner waits 100-200ms between ports if possible, or limit the number of ports scanned per request.
2. **Self-Scan Priority:** The tool is safest when scanning the IP requesting the page (Localhost/Home IP).
3. **Auth Layer:** The authentication layer added in Section 4 is **mandatory**. If this tool is public, bots will use it to proxy attacks, guaranteeing a server ban.



### 6.2 Input Sanitization

* **Issue:** Command Injection.
* **Risk:** Passing unvalidated variables into `evilscan` or shell commands.
* **Solution:** STRICT strict validation using `zod`. Never pass raw strings to the scanner. Ensure inputs are valid IP addresses.

### 6.3 Browser Timeouts

* **Issue:** A scan of 100 ports might take 10 seconds. Browsers/Proxies (like Nginx) often timeout requests after 30-60s.
* **Solution:**
* Limit scans to ~20-50 ports per chunk.
* Or, use WebSockets / Server Sent Events (SSE) for real-time progress updates (Advanced, but better UX). *For MVP, stick to short port lists.*



### 6.4 CORS & Environment

* **Issue:** Vite runs on port 5173, Node on 3000.
* **Solution:** Configure `cors` on Express to accept `origin: 'http://localhost:5173'`. In production, serve the React build *from* the Express server using `express.static()`.


## 7. Backend API Routes Specification

All API routes should be prefixed with `/api` to avoid conflicts with frontend routing (if served statically). All routes except `/auth/login` must be protected by the `authMiddleware`.

### 7.1 Authentication

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| **POST** | `/api/auth/login` | No | Exchanges a password for a JWT session token. |
| **GET** | `/api/auth/verify` | **Yes** | Verifies if the current stored token is still valid (used on app load). |

* **Request Body (Login):** `{ "password": "super_secret_password" }`
* **Response (Success):** `{ "token": "eyJh... (JWT string)" }`

### 7.2 Network Tools

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| **POST** | `/api/tools/scan-ports` | **Yes** | Scans a specific IP against a list of ports. |
| **GET** | `/api/tools/my-ip` | **Yes** | Returns the requester's public IP and Geo-metadata. |
| **POST** | `/api/tools/test-smtp` | **Yes** | Performs a handshake test with an external SMTP server. |

#### Detailed Route Specifications:

**1. Port Scanner**

* **Endpoint:** `POST /api/tools/scan-ports`
* **Body:**
```json
{
  "target": "192.168.1.1",
  "ports": "21,22,80,443" // or array [21, 22, 80, 443]
}

```


* **Response:** Array of objects `{ port: 80, status: 'open', banner: 'Apache...' }`.

**2. IP Metadata**

* **Endpoint:** `GET /api/tools/my-ip`
* **Response:**
```json
{
  "ip": "203.0.113.45",
  "type": "IPv4",
  "location": "Berlin, Germany",
  "isp": "Deutsche Telekom AG", // (If available via fallback)
  "timezone": "Europe/Berlin"
}

```



**3. SMTP Tester**

* **Endpoint:** `POST /api/tools/test-smtp`
* **Body:**
```json
{
  "host": "smtp.example.com",
  "port": 587,
  "user": "me@example.com",
  "pass": "password123",
  "secure": false // false = STARTTLS, true = SSL/TLS
}

```


* **Response:** `{ "success": true, "message": "Connection verified" }` or error details.
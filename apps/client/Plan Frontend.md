
## 1. Frontend Specific Architecture

Before starting, we establish the strict file structure to keep the codebase scalable.

```text
/frontend
├── /src
│   ├── /api
│   │   ├── axios.js           # Global instance with Interceptors
│   │   └── endpoints.js       # Centralized API URL constants
│   ├── /components
│   │   ├── /ui                # Dumb components (Button, Input, Card, Badge)
│   │   ├── /layout            # Sidebar, Header, PrivateLayout
│   │   └── /feedback          # LoadingSpinner, ErrorMessage, Toaster
│   ├── /context
│   │   └── AuthContext.jsx    # Authentication State Provider
│   ├── /features
│   │   ├── /auth              # LoginForm.jsx
│   │   ├── /scanner           # ScannerForm.jsx, ResultsGrid.jsx
│   │   ├── /ip                # IpInfoCard.jsx, MapView.jsx
│   │   └── /smtp              # SmtpTesterForm.jsx
│   ├── /hooks
│   │   ├── useScan.js         # React Query mutation for scanning
│   │   └── useIpInfo.js       # React Query query for IP data
│   ├── /pages
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Scanner.jsx
│   │   ├── IpInfo.jsx
│   │   └── Smtp.jsx
│   ├── App.jsx
│   └── main.jsx

```

---

## Phase 1: Core Setup & Styling System

**Goal:** Initialize the project and create the reusable UI "Lego blocks" (Tailwind components).

### Step 1.1: Project & Library Init

* **Action:**
* Initialize Vite: `pnpm create vite frontend --template react`.
* Install dependencies: `axios`, `react-router-dom`, `@tanstack/react-query`, `lucide-react`, `clsx`, `tailwind-merge`.
* Install Dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`.
* Run `npx tailwindcss init -p`.


* **Config:**
* Update `tailwind.config.js` to include dark mode support (class strategy) and custom colors (slate/zinc palette).
* Setup `main.jsx` with `QueryClientProvider` and `BrowserRouter`.



### Step 1.2: UI Component Library

* **Action:** Create "dumb" components to avoid repeating Tailwind classes.
* `src/components/ui/Button.jsx`: Variants (primary, ghost, danger).
* `src/components/ui/Input.jsx`: Standard styled text input.
* `src/components/ui/Card.jsx`: Wrapper with shadow and border.
* `src/components/ui/Badge.jsx`: Status indicators (Green for Open, Red for Closed).


* **Verification:** Create a temporary route `/test` to render all these components and visually verify styling.

---

## Phase 2: Authentication Layer

**Goal:** Implement the security logic before building any features.

### Step 2.1: API Client Configuration

* **Action:** Create `src/api/axios.js`.
* Create `axios` instance with `baseURL` from `import.meta.env`.
* **Request Interceptor:** Check `localStorage` for `token` and inject `Authorization: Bearer ...` header.
* **Response Interceptor:** Catch `401 Unauthorized` responses and automatically redirect to `/login` (or clear token).



### Step 2.2: Auth Context & Hooks

* **Action:** Create `src/context/AuthContext.jsx`.
* State: `user` (null | object), `loading` (boolean).
* Methods: `login(password)`, `logout()`.
* On Mount: Check if a token exists in LocalStorage. If yes, assume logged in (validation happens via API calls).



### Step 2.3: Login Page & Route Guard

* **Action:**
* Create `src/features/auth/LoginForm.jsx`.
* Create `src/pages/Login.jsx`.
* Create `src/components/layout/PrivateLayout.jsx`: checks `useAuth()`. If not logged in, `<Navigate to="/login" />`.


* **Test:** Try accessing `/` without a token -> Redirects to Login. Login with fake success -> Redirects to `/`.

---

## Phase 3: Application Shell (Layout)

**Goal:** Create the navigation structure.

### Step 3.1: Sidebar & Navigation

* **Action:** Create `src/components/layout/Sidebar.jsx`.
* Use `lucide-react` icons: `Shield` (Scan), `Globe` (IP), `Mail` (SMTP), `LogOut`.
* Use `NavLink` from `react-router-dom` for active state styling (highlight current tab).


* **Responsiveness:** Ensure sidebar collapses to a bottom bar or hamburger menu on mobile (Tailwind `hidden md:flex`).

---

## Phase 4: Feature - Port Scanner

**Goal:** Build the interface for the primary tool.

### Step 4.1: Scanner Logic (Hook)

* **Action:** Create `src/hooks/useScan.js`.
* Use `useMutation` from React Query.
* Function calls `POST /api/tools/scan-ports`.
* Handle `onSuccess`: Update local state with results.
* Handle `onError`: trigger toast notification.



### Step 4.2: Scanner UI Components

* **Action:**
* `ScannerForm.jsx`: Input for IP (default to "Self") and Port Range Selector (Buttons for "Common Ports", "All Ports").
* `ResultsGrid.jsx`: A CSS Grid displaying small boxes for each port.
* **Visuals:** Green Box = Open, Gray Box = Closed/Timeout.
* **Animation:** Simple fade-in when results arrive.





---

## Phase 5: Feature - IP Metadata

**Goal:** Display the "Who am I" data.

### Step 5.1: IP Data Fetching

* **Action:** Create `src/hooks/useIpInfo.js`.
* Use `useQuery` targeting `GET /api/tools/my-ip`.
* Cache time: Infinity (IP rarely changes in a session).



### Step 5.2: IP Dashboard UI

* **Action:** Create `src/pages/IpInfo.jsx`.
* Display a large Card with the IP address.
* Display a "Details List": ISP, City, Timezone.
* (Optional) Embed a simple Google Maps iframe using the coordinates returned by the backend.



---

## Phase 6: Feature - SMTP Tester

**Goal:** Build the form for email server testing.

### Step 6.1: SMTP Form

* **Action:** Create `src/features/smtp/SmtpForm.jsx`.
* Fields: Host, Port (number), User, Password (type="password"), SSL (Checkbox).
* **Logic:** When Port 465 is typed, auto-check SSL. When 587, auto-uncheck.



### Step 6.2: Connection Logs

* **Action:** Create `src/features/smtp/ConnectionLog.jsx`.
* A terminal-like window (black background, green text).
* Since the backend only returns success/fail, we simulate the log steps in the UI for UX:
1. "Resolving host..."
2. "Connecting to port..."
3. "Handshake success/fail."





---

## Phase 7: Polish & Deployment Prep

**Goal:** Final user experience improvements.

### Step 7.1: Feedback Systems

* **Action:** Install `react-hot-toast` or build a simple Context-based Toast system.
* **Integration:** Add toast calls to all `onError` callbacks in the Query hooks.

### Step 7.2: Loading Skeletons

* **Action:** Create `src/components/feedback/Skeleton.jsx`.
* **Usage:** While `useIpInfo` is `isLoading`, show a gray pulsing bar instead of the text.

### Step 7.3: Environment Variables

* **Action:** Create `.env` and `.env.production`.
* `VITE_API_URL=http://localhost:3000/api` (Dev)
* `VITE_API_URL=/api` (Prod - relative path because we will serve frontend from backend).
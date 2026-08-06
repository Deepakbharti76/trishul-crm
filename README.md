# Trishul CRM — Smart Business Management

A full-stack Customer Relationship Management system with a premium dark UI,
cinematic login animation, and role-based access control.

**Backend:** Java 21 · Spring Boot 3 · Spring MVC · Spring Data JPA ·
Spring Security (session-based, role-based) · MySQL · Maven

**Frontend:** HTML5 · CSS3 (vanilla, no framework) · Vanilla JavaScript ·
Chart.js · Font Awesome — consumes the backend purely over the Fetch API.

---

## 1. Project Structure

```
trishul-crm/
├── backend/                     Spring Boot application (Maven project)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/trishul/crm/
│       │   ├── TrishulCrmApplication.java
│       │   ├── config/          SecurityConfig, DataSeeder
│       │   ├── controller/      REST controllers (one per module)
│       │   ├── service/         Business logic
│       │   ├── repository/      Spring Data JPA repositories
│       │   ├── entity/          JPA entities (users, roles, customers…)
│       │   ├── dto/             Request/response DTOs
│       │   ├── security/        UserDetailsService, JSON auth handlers
│       │   └── exception/       Centralized exception handling
│       └── resources/
│           └── application.properties
│
├── frontend/                    Static HTML/CSS/JS (served by any static host)
│   ├── index.html               Session router (→ dashboard or login)
│   ├── login.html               Cinematic opening + sign-in form
│   ├── dashboard.html           Stats, charts, recent activity
│   ├── customers.html           Customers CRUD
│   ├── leads.html               Leads CRUD
│   ├── tasks.html                Tasks CRUD
│   ├── employees.html           Employees CRUD (role-restricted)
│   ├── reports.html             Reports + funnel chart
│   ├── ai-assistant.html        AI Assistant chat UI
│   ├── settings.html            Company settings & account info
│   ├── css/style.css            Design system
│   ├── css/animations.css       Cinematic opening + motion utilities
│   └── js/                      api.js, auth.js, layout.js + one file per module
│
├── database/
│   └── trishul_crm.sql          Full schema + sample data (manual import)
│
└── docs/
    └── API_DOCUMENTATION.md     Full REST API reference
```

---

## 2. Prerequisites

- Java 21 (JDK)
- Maven 3.8+
- MySQL 8.0+
- Any static file server for the frontend (or just open the HTML files
  directly — see note below)

---

## 3. Backend Setup

### 3.1 Create the database

You have two options:

**Option A — Let Hibernate create everything (recommended for first run)**

1. Create an empty schema:
   ```sql
   CREATE DATABASE trishul_crm CHARACTER SET utf8mb4;
   ```
2. Start the backend (see below). `spring.jpa.hibernate.ddl-auto=update` will
   create all tables automatically, and `DataSeeder.java` will insert roles,
   3 demo users, and sample customers/leads/tasks/employees/reports/settings
   on first boot.

**Option B — Import the ready-made SQL file**

```bash
mysql -u root -p < database/trishul_crm.sql
```

This creates the schema and inserts the same sample data directly. If you
use this path, either let `DataSeeder` skip re-seeding (it only inserts when
a table is empty, so it's safe either way) or set
`spring.jpa.hibernate.ddl-auto=validate` once the schema exists.

### 3.2 Configure credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/trishul_crm?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3.3 Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API will start on **http://localhost:8080**.

### 3.4 Demo accounts (seeded automatically)

| Username   | Password  | Role       |
| ---------- | --------- | ---------- |
| admin      | Admin@123 | ADMIN      |
| supervisor | Super@123 | SUPERVISOR |
| user       | User@123  | USER       |

---

## 4. Frontend Setup

The frontend is plain static HTML/CSS/JS — no build step required.

**Option A — VS Code Live Server / any static server**

```bash
cd frontend
npx serve .

```

Then open `http://localhost:5500/login.html`.

**Option B — Open directly in the browser**
You can open `frontend/login.html` directly via `file://`. Since the backend
enables CORS with credentials for all origins, this also works, though a
local static server is recommended for consistent cookie behavior.

> The API base URL is configured in `frontend/js/api.js` as
> `const API_BASE_URL = 'http://localhost:8080';` — change this if your
> backend runs elsewhere.

---

## 5. Modules

1. **Login** — cinematic trident opening animation, session-based auth
2. **Dashboard** — stat cards, revenue/leads/tasks charts, recent activity
3. **Customers** — full CRUD, search & status filter
4. **Leads** — full CRUD, pipeline stages, search & filter
5. **Tasks** — full CRUD, priority & status, due dates
6. **Employees** — full CRUD (create/update: Admin & Supervisor, delete: Admin only)
7. **Reports** — summary stats, conversion funnel, generate & list reports
8. **AI Assistant** — chat UI that answers questions using live CRM data
9. **Settings** — company profile, notification preferences, account info

---

## 6. Role-Based Access Control

| Action                                | ADMIN | SUPERVISOR | USER |
| ------------------------------------- | :---: | :--------: | :--: |
| View all modules                      |  ✅   |     ✅     |  ✅  |
| Create/Update customers, leads, tasks |  ✅   |     ✅     |  ✅  |
| Delete customers, leads, tasks        |  ✅   |     ✅     |  ❌  |
| Create/Update employees               |  ✅   |     ✅     |  ❌  |
| Delete employees                      |  ✅   |     ❌     |  ❌  |
| Generate reports                      |  ✅   |     ✅     |  ❌  |
| Edit company settings                 |  ✅   |     ❌     |  ❌  |

Enforced on both the backend (`SecurityConfig.java`) and reflected in the
frontend UI (`layout.js` hides/disables actions the current role can't use).

---

## 7. Notes

- Sessions are stored server-side (`JSESSIONID` cookie); the frontend never
  handles a token directly.
- Passwords are hashed with BCrypt.
- All list/CRUD endpoints validate input with Jakarta Bean Validation and
  return field-level error messages on `400`.
- See `docs/API_DOCUMENTATION.md` for the full REST reference.

## 8. 📸 Screenshots

### 🔐 Login Page

![Login Page](docs/images/Login%20Page.png)

### 📊 Dashboard

![Dashboard](docs/images/Dashboard.png)

### 📈 Reports

![Reports](docs/images/Reports.png)

### 🤖 AI Assistant

![AI Assistant](docs/images/AI%20Assistant.png)

### ⚙️ Settings

![Settings](docs/images/Settings.png)

<div align="center">

# 🛡️ Trishul CRM — Smart Business Management

A full-stack Customer Relationship Management system with a premium dark
UI, cinematic trident opening animation, live analytics dashboard, and
role-based access control for Admin, Supervisor, and User roles.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)](https://trishul-crm-six.vercel.app/)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://trishul-crm-backend.onrender.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](#-license)

### 🚀 [Live Demo](https://trishul-crm-six.vercel.app/) &nbsp;·&nbsp; 💻 [GitHub Repository](https://github.com/Deepakbharti76/trishul-crm)

[Features](#-features) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started-local-development) • [RBAC](#-role-based-access-control) • [API Docs](#-api-documentation)

</div>

---

## ✨ Features

- 🔐 **Secure session-based authentication** with BCrypt password hashing
- 🎭 **Role-Based Access Control** — Admin / Supervisor / User, enforced on both frontend and backend
- 📊 **Live analytics dashboard** — revenue trend, lead pipeline, task status, recent activity
- 👥 **Full CRUD** for Customers, Leads, Tasks, and Employees
- 📈 **Reports module** with an auto-calculated conversion funnel
- 🤖 **AI Assistant** that answers natural-language questions using your live CRM data
- ⚙️ **Company settings** panel (Admin-only edits)
- 🎬 **Cinematic SVG opening animation** on the login screen — pure CSS/SVG, no animation library
- 📱 **Fully responsive** — desktop, tablet, and mobile
- 🌙 **Premium dark UI** with a brass-gold / teal design system

---

## 🛠 Tech Stack

**Backend**

- ☕ Java 21
- 🍃 Spring Boot 3 · Spring MVC
- 🗄 Spring Data JPA (Hibernate)
- 🔐 Spring Security (session-based, role-based)
- 🐬 MySQL (TiDB Cloud in production)
- 📦 Maven

**Frontend**

- 🌐 HTML5
- 🎨 CSS3 (vanilla, no framework)
- 🟨 JavaScript (vanilla, Fetch API)
- 📊 Chart.js
- 🔤 Font Awesome

**Deployment**

- ▲ Frontend hosted on **Vercel**
- 🎨 Backend hosted on **Render**
- 🗄 Database hosted on **TiDB Cloud**

---

## 📸 Screenshots

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

---

## 🌐 Live Demo

**Frontend:** [https://trishul-crm-six.vercel.app/](https://trishul-crm-six.vercel.app/)
**Backend API:** [https://trishul-crm-backend.onrender.com/](https://trishul-crm-backend.onrender.com/)

> ⏳ The backend is hosted on Render's free tier, which spins down after
> inactivity. The **first** login after a period of inactivity may take
> 30–60 seconds to wake up — subsequent requests are fast.

### Try it out — demo accounts

| Username   | Password  | Role       |
|------------|-----------|------------|
| admin      | Admin@123 | ADMIN      |
| supervisor | Super@123 | SUPERVISOR |
| user       | User@123  | USER       |

---

## 📁 Project Structure

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
├── frontend/                    Static HTML/CSS/JS, deployed on Vercel
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
│   ├── vercel.json              Proxies /api/* to the Render backend
│   │                            (keeps the session cookie first-party)
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

## 🚀 Getting Started (Local Development)

### Prerequisites

- Java 21 (JDK)
- Maven 3.8+
- MySQL 8.0+
- Any static file server for the frontend (or open the HTML files directly)

### 1. Database Setup

**Option A — Let Hibernate create everything (recommended for first run)**

```sql
CREATE DATABASE trishul_crm CHARACTER SET utf8mb4;
```

Start the backend (below). `spring.jpa.hibernate.ddl-auto=update` creates all
tables automatically, and `DataSeeder.java` inserts roles, 3 demo users, and
sample customers/leads/tasks/employees/reports/settings on first boot.

**Option B — Import the ready-made SQL file**

```bash
mysql -u root -p < database/trishul_crm.sql
```

### 2. Configure Credentials

Edit `backend/src/main/resources/application.properties`, or set these as
environment variables (used automatically in production on Render):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/trishul_crm?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

> ⚠️ Never commit your real database password. See [What Not to Commit](#-what-not-to-commit) below.

### 3. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

API starts on **http://localhost:8080**

### 4. Run the Frontend

```bash
cd frontend
npx serve .
```

Open **http://localhost:5500/login.html**

> The API base URL is set in `frontend/js/api.js`. In production it's a
> relative path (`/api`) proxied by `vercel.json` to the Render backend —
> this keeps the session cookie first-party so login works in Incognito
> and on every browser/device. For local development without the Vercel
> proxy, point it directly at your local backend instead:
> `const API_BASE_URL = 'http://localhost:8080';`

### 5. Demo Accounts (seeded automatically)

| Username   | Password  | Role       |
| ---------- | --------- | ---------- |
| admin      | Admin@123 | ADMIN      |
| supervisor | Super@123 | SUPERVISOR |
| user       | User@123  | USER       |

---

## 🧩 Modules

| #   | Module           | Description                                                       |
| --- | ---------------- | ------------------------------------------------------------------- |
| 1   | **Login**        | Cinematic trident opening animation, session-based auth           |
| 2   | **Dashboard**    | Stat cards, revenue/leads/tasks charts, recent activity           |
| 3   | **Customers**    | Full CRUD, search & status filter                                 |
| 4   | **Leads**        | Full CRUD, pipeline stages, search & filter                       |
| 5   | **Tasks**        | Full CRUD, priority & status, due dates                           |
| 6   | **Employees**    | Full CRUD (create/update: Admin & Supervisor, delete: Admin only) |
| 7   | **Reports**      | Summary stats, conversion funnel, generate & list reports         |
| 8   | **AI Assistant** | Chat UI that answers questions using live CRM data                |
| 9   | **Settings**     | Company profile, notification preferences, account info           |

---

## 🔒 Role-Based Access Control

| Action                                | ADMIN | SUPERVISOR | USER |
| -------------------------------------- | :---: | :--------: | :--: |
| View all modules                      |  ✅   |     ✅     |  ✅  |
| Create/Update customers, leads, tasks |  ✅   |     ✅     |  ✅  |
| Delete customers, leads, tasks        |  ✅   |     ✅     |  ❌  |
| Create/Update employees               |  ✅   |     ✅     |  ❌  |
| Delete employees                      |  ✅   |     ❌     |  ❌  |
| Generate reports                      |  ✅   |     ✅     |  ❌  |
| Edit company settings                 |  ✅   |     ❌     |  ❌  |

Enforced on both the **backend** (`SecurityConfig.java` — the real security
layer) and reflected in the **frontend UI** (`layout.js` hides/disables
actions and redirects away from restricted pages, for UX only).

---

## 📚 API Documentation

Full REST endpoint reference, request/response shapes, and status codes are
in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md).

---

## 🔐 Security Notes

- Sessions are stored server-side (`JSESSIONID` cookie) — the frontend never
  handles a token directly
- Passwords are hashed with **BCrypt**
- Session cookie is `HttpOnly`, `Secure`, `SameSite=None`, and served
  first-party in production via a Vercel rewrite proxy (`vercel.json`) so
  it works reliably across all browsers, including Incognito and Safari
- All list/CRUD endpoints validate input with Jakarta Bean Validation and
  return field-level error messages on `400`
- Role checks are enforced at the API layer, not just in the UI

---

## 🚫 What Not to Commit

This repo's `.gitignore` excludes:

```
backend/target/       # Maven build output — regenerated by `mvn clean install`
.idea/ *.iml           # IDE metadata
.vscode/
.DS_Store, Thumbs.db   # OS files
*.log
*.class
```

Also avoid committing real production database credentials in
`application.properties` — the demo credentials in this repo are fine for
local development only. Production credentials are set as environment
variables on Render.

---

## 🗺️ Roadmap

- [ ] Pagination on list endpoints
- [ ] Export to PDF / Excel
- [ ] Automated tests (JUnit + Mockito, MockMvc)
- [x] Deploy backend (Render) + frontend (Vercel) + database (TiDB Cloud)

---

<div align="center">

Built with ☕ Java, 🍃 Spring Boot, and a lot of dark-mode design.

**[🚀 Live Demo](https://trishul-crm-six.vercel.app/)** &nbsp;·&nbsp; **[💻 GitHub](https://github.com/Deepakbharti76/trishul-crm)**

</div>

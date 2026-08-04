# 📚 LibraSys — Smart Library Management System

LibraSys is a production-grade, full-stack library management system engineered for high scalability, secure access, and optimized performance. The project is designed using a **Clean Layered Architecture** on the backend and a modular **React SPA** on the frontend.

---

## 🛠️ Architecture & Tech Stack

### Backend (Spring Boot)
*   **Core**: Java 17, Spring Boot 3.x, Spring Data JPA, Hibernate.
*   **Security**: Spring Security 6, Stateless JWT Token Authentication.
*   **Database**: MySQL 8.0 (Relation mapping, constraints, indexing).
*   **Caching**: Redis (Namespaced caching with custom automatic failover).
*   **Notifications**: Spring Mail (Asynchronous thread execution via `@Async`).
*   **Documentation**: Springdoc OpenAPI / Swagger UI.

### Frontend (React)
*   **Core**: React v18, Vite (fast HMR build toolchain), Tailwind CSS.
*   **Routing**: React Router v6 (Protected routes, role-based guard layout).
*   **State & Client**: Context API (Auth session storage), Axios (Automatic JWT interceptor headers).

---

## 📂 Project Structure

```
LibraSys/                  # Root Project Directory (Mono-repo)
├── .gitignore            # Root Git Ignore settings (Backend + Frontend rules)
├── README.md             # Project documentation index
├── database/             # [NEW] SQL initialization scripts
│   ├── schema.sql        # Database table structures DDL
│   └── seed.sql          # Default categories, authors, books, and users
├── backend/              # Spring Boot Java Backend root
│   ├── pom.xml           # Backend Maven dependencies
│   ├── mvnw.cmd          # Maven portable wrapper script
│   ├── .mvn/             # Maven wrapper properties
│   └── src/              # Spring Boot source root
│       ├── main/
│       │   ├── java/com/librasys/   # Java package hierarchy
│       │   └── resources/
│       │       ├── application.yml          # Local properties (gitignored)
│       │       └── application.yml.example  # Configuration template
└── frontend/             # React SPA Client root
    ├── package.json      # Node scripts and modules dependencies
    ├── tailwind.config.js# Tailwind theme and custom colors
    ├── vite.config.js    # Vite compilation rules
    ├── .env.example      # Environment variables template
    └── src/
        ├── api/          # Axios custom instance configurations
        ├── components/   # Reusable UI widgets (Navbar, Sidebar, PrivateRoute)
        ├── context/      # AuthContext session provider
        └── pages/        # View Pages (Dashboard, Books, Authors, Transactions, etc.)
```

---

## 🚀 Setting Up & Running Locally

### Prerequisites
*   **Java**: JDK 17 or higher.
*   **Node.js**: v18.x or higher (npm v9.x+).
*   **Database**: MySQL 8.x running.
*   **Caching**: Redis 6.x/7.x running (optional, system has auto-failover to MySQL if Redis is off).

### 1. Database Setup
1. Create a MySQL database named `librasys_db`:
   ```sql
   CREATE DATABASE librasys_db;
   ```
2. Import the DDL schema file:
   ```bash
   mysql -u your_username -p librasys_db < database/schema.sql
   ```
3. Import the default seed data (users, books, categories, authors):
   ```bash
   mysql -u your_username -p librasys_db < database/seed.sql
   ```

### 2. Run Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy `src/main/resources/application.yml.example` to `src/main/resources/application.yml` and fill in your MySQL credentials, mail configuration, and a custom JWT Secret:
   ```bash
   cp src/main/resources/application.yml.example src/main/resources/application.yml
   ```
3. Start the application:
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Linux / macOS
   chmod +x mvnw
   ./mvnw spring-boot:run
   ```
*The API will start running at **`http://localhost:8080`**.*

### 3. Run Frontend Client
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Copy the environment template file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
*The client application will start running at **`http://localhost:5173`**.*

---

## 👥 Default Credentials

Use the following profiles to log in to the portal:

| Role | Email | Password |
|---|---|---|
| **ROLE_ADMIN** | `admin@librasys.com` | `adminpassword` |
| **ROLE_LIBRARIAN** | `librarian@librasys.com` | `librarianpassword` |
| **ROLE_STUDENT** | `student@librasys.com` | `studentpassword` |
| **Test User** | `testuser_unique@gmail.com` | `password123` |

---

## ⚡ Redis Caching & Failover Policy

To maximize responsiveness, the catalog directories and recommendation vectors are cached in Redis namespace blocks:
*   **Caches**: `bookById` (1 hour TTL), `bookSearch` (5 minutes TTL), `categories` (permanent), `recommendations` (1 hour TTL).
*   **Eviction**: Mutating transactions (issue checkouts, returns, catalog additions) automatically trigger targeted `@CacheEvict` signals to invalidate affected search lists and details, preventing stale outputs.
*   **Resiliency**: If your Redis server stops, the custom `RedisCacheErrorHandler` intercepts the connection timeout and **gracefully downgrades all reads to the MySQL database directly**, maintaining a 100% uptime rate without raising 500 exceptions.

---

## 📡 API Documentation
Interactive API docs are auto-generated via Swagger UI. Once the backend server is running, navigate to:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

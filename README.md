# 📝 Task Management App

![CI/CD](https://github.com/Ancaz20in/taskmanager-backend/actions/workflows/ci-cd.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green)
![React](https://img.shields.io/badge/React-18-61dafb)

> Full stack task management app with JWT authentication, built as a portfolio project
> to demonstrate end-to-end development skills.

![Dashboard Screenshot](docs/screenshot-dashboard.png)

## 🎯 Why I Built This

Transitioning from hospitality to software engineering, I wanted to build something
that solves a real problem I understand: **managing daily tasks in a demanding environment**.
This app applies the same organizational principles I used as Sous Chef — prioritization,
status tracking, deadlines — translated into software.

## 🚀 Live Demo
- 🌐 Frontend: https://taskmanager-frontend.vercel.app
- 📚 API Docs: https://taskmanager-api.onrender.com/swagger-ui.html

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React 18  │────▶│  Axios +    │────▶│Spring Boot  │────▶│ PostgreSQL  │
│  (Vercel)   │◀────│   JWT       │◀────│  (Render)   │◀────│  (Render)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                │
                                         ┌──────┴──────┐
                                         │   JUnit 5   │
                                         │   Mockito   │
                                         └─────────────┘
```

**Layers:** Controller (HTTP) → Service (business logic) → Repository (data access)

## 🛠️ Tech Stack
- **Backend:** Java 21, Spring Boot 3.3, Spring Security, JWT (JJWT 0.12), PostgreSQL
- **Frontend:** React 18, Vite, Tailwind CSS, Axios
- **DevOps:** Docker, GitHub Actions, Render, Vercel
- **Testing:** JUnit 5, Mockito, H2 (integration)

## 📸 Features
- User registration and login with JWT
- Create, read, update, delete tasks
- Filter tasks by status and priority
- Responsive design
- Full API documentation with Swagger

## 💡 Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Spring Boot over Flask** | Stronger typing and enterprise patterns for a portfolio piece |
| **JWT over Session Cookies** | Stateless auth fits SPA architecture and horizontal scaling |
| **Layered Architecture** | Clear separation: Controller handles HTTP, Service owns business logic, Repository accesses data |
| **Records for DTOs** | Java 21 records eliminate boilerplate while keeping immutability |

## 🧪 Testing Strategy

- **Unit Tests:** Mockito for service layer — mocked dependencies, fast feedback
- **Controller Tests:** `@WebMvcTest` + MockMvc to validate HTTP layer in isolation
- **Integration Tests:** H2 in-memory DB for full Spring context load
- **CI/CD:** GitHub Actions runs tests on every push to `main` and `develop`

## 🛣️ Roadmap

- [ ] Task categories and tags
- [ ] Email notifications for due dates
- [ ] Team collaboration (shared workspaces)
- [ ] Mobile app with React Native

## Run Locally

### Prerequisites
- Java 21
- Node.js 20+
- Docker (optional)

### Backend
```bash
cd backend
docker-compose up -d   # Starts PostgreSQL
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
API will be available at http://localhost:8080  
Swagger UI at http://localhost:8080/swagger-ui.html

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App will be available at http://localhost:5173

## Run Tests
```bash
cd backend
./mvnw clean test
```

## Docker
```bash
cd backend
docker-compose up --build
```

## Deployment
- **Backend:** Connect GitHub repo to Render (Docker deployment)
- **Frontend:** Connect to Vercel (set `VITE_API_URL` environment variable)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT |
| GET | /api/tasks | List tasks (with filters) |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/{id} | Update task |
| DELETE | /api/tasks/{id} | Delete task |

## Environment Variables

### Backend
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

### Frontend
- `VITE_API_URL`

Built by Antonio Cazorla

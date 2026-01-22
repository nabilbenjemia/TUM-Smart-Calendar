# TUM Smart Calendar

An intelligent scheduling companion for Technical University of Munich (TUM) students.

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed on your system
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Node.js** (optional, only for local frontend development)
- **Java 17+** (optional, only for local backend development)

## 🏗️ Architecture

This project uses a microservices architecture with the following services:

### Services

1. **MySQL Database** (`mysql`)
   - Port: `3306`
   - Two databases: `smartcalendar_auth` and `smartcalendar`
   - Stores user authentication data and calendar information

2. **Authentication Service** (`authentication`)
   - Port: `8081`
   - Handles user registration, login, and JWT token generation
   - Technology: Spring Boot (Java)
   - Database: MySQL (`smartcalendar_auth`)

3. **Calendar Service** (`calendar`)
   - Port: `8080`
   - Manages calendar events and scheduling
   - Technology: Spring Boot (Java)
   - Database: MySQL (`smartcalendar`)

4. **Frontend** (`frontend`)
   - Port: `3000` (mapped to container port 80)
   - React application with TailwindCSS
   - Served via Nginx in production
   - Communicates with backend services via API proxy

### Network Architecture

```
Browser (localhost:3000)
    ↓
Frontend Container (Nginx)
    ↓ /api/auth/* → Authentication Service (port 8081)
    ↓ /api/calendar/* → Calendar Service (port 8080)
    ↓
MySQL Database (port 3306)
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TUM-Smart-Calendar
```

### 2. Configure Environment Variables

Create a `.env` file in the project root directory:

```bash
cp .env.example .env
```

**Edit the `.env` file with your configuration:**

```env
# MySQL Configuration
MYSQL_ROOT_USERNAME=root
MYSQL_ROOT_PASSWORD=your_secure_password_here

# JWT Configuration (use a long random string, at least 32 characters)
JWT_SECRET=your-secret-key-change-this-in-production-use-long-random-string
JWT_EXPIRATION=86400000
```

> ⚠️ **Important**: Never commit the `.env` file to version control. It contains sensitive credentials.

> 📧 **Need help with configuration?** Contact one of the developers:
> - N. Ben Jemia
> - Y. Bouchaala
> - O. Fahim

### 3. Build and Run with Docker

Start all services:

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up --build -d
```

### 4. Access the Application

Once all containers are running:

- **Frontend**: http://localhost:3000
- **Authentication API**: http://localhost:8081/api/auth/*
- **Calendar API**: http://localhost:8080/api/calendar/*
- **MySQL**: localhost:3306

### 5. Create Your First Account

1. Navigate to http://localhost:3000
2. Click "Don't have an account? Sign Up"
3. Fill in the form with your TUM email (@tum.de or @mytum.de)
4. Create a password (minimum 8 characters)
5. Click "Create Account"

## 🛠️ Development

### Running Services Individually

**Start only the database:**
```bash
docker-compose up mysql
```

**Start authentication service:**
```bash
docker-compose up authentication
```

**Start calendar service:**
```bash
docker-compose up calendar
```

**Start frontend:**
```bash
docker-compose up frontend
```

### Local Development (without Docker)

#### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will run on http://localhost:3000

#### Backend Services
```bash
cd backend/authentication  # or backend/calendar
./mvnw spring-boot:run
```

Make sure MySQL is accessible at localhost:3306 and configure the environment variables.

### Viewing Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker logs -f smartcalendar-frontend
docker logs -f smartcalendar-auth
docker logs -f smartcalendar-calendar
docker logs -f smartcalendar-mysql
```

## 🔄 Common Commands

### Stop all services
```bash
docker-compose down
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

### Reset database
```bash
docker-compose down -v
docker volume rm tum-smart-calendar_mysql-data
docker-compose up --build
```

## 🐛 Troubleshooting

### Port Already in Use
If you get a port conflict error, stop the service using that port:
```bash
# Find process using port 3000, 8080, or 8081
lsof -i :3000
lsof -i :8080
lsof -i :8081

# Kill the process
kill -9 <PID>
```

### Authentication Service Not Starting
Check the logs:
```bash
docker logs smartcalendar-auth
```

Common issues:
- MySQL not ready: Wait for MySQL healthcheck to pass
- Missing environment variables: Check your `.env` file
- Port 8081 in use: Stop conflicting service

### Frontend Shows 502 Error
This usually means the backend service isn't running or isn't accessible:
```bash
# Check if authentication service is running
docker ps | grep authentication

# Test connectivity from frontend to backend
docker exec smartcalendar-frontend wget -O- http://authentication:8081/api/auth/login
```

### Page Reload Shows 404
This is already handled by the nginx configuration. If you still see 404:
```bash
# Rebuild frontend with updated nginx.conf
docker-compose up --build frontend
```

## 📁 Project Structure

```
TUM-Smart-Calendar/
├── backend/
│   ├── authentication/          # Authentication microservice
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   └── calendar/                # Calendar microservice
│       ├── src/
│       ├── pom.xml
│       └── Dockerfile
├── frontend/                    # React frontend
│   ├── src/
│   ├── public/
│   ├── nginx.conf              # Nginx configuration for production
│   ├── package.json
│   └── Dockerfile
├── init-db.sql                 # Database initialization script
├── docker-compose.yml          # Docker services configuration
├── .env                        # Environment variables (create this)
├── .env.example               # Environment variables template
└── README.md                   # This file
```

## 🔐 Security Notes

- Always use strong passwords for MySQL root user
- Change the JWT secret to a long, random string (minimum 32 characters)
- Never commit `.env` file to version control
- Use HTTPS in production
- Regularly update dependencies

## 📝 License

© 2026 N. Ben Jemia, Y. Bouchaala, O. Fahim

## 🤝 Contributing

For questions or contributions, please contact the development team.

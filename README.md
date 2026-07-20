<div align="center">

# 🏥 Hospital Management System

### A microservices-based platform for hospital authentication, appointment booking & notifications

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

</div>

---

## 📖 Overview

The **Hospital Management System** is a containerized, microservices-based backend that handles the core operations of a modern hospital: **secure authentication**, **appointment booking**, and **automated email notifications**. Each service runs independently, communicates over a private Docker network, and is fronted by an Nginx reverse proxy.

---

## ✨ Features

- 🔐 **JWT-based Authentication** — secure login & token-based access control
- 📅 **Appointment Booking** — patients can book and manage appointments
- 📧 **Email Notifications** — automatic confirmations & reminders via SMTP
- 🌐 **API Gateway** — single entry point through Nginx reverse proxy
- 🗄️ **Isolated Databases** — separate MongoDB databases per domain
- 🐳 **Fully Dockerized** — one command to spin up the entire stack
- ♻️ **Auto-restart** — services recover automatically on failure

---

## 🏗️ Architecture

```
                          ┌─────────────┐
                          │   Client    │
                          └──────┬──────┘
                                 │ :80
                          ┌──────▼──────┐
                          │    NGINX    │  ← API Gateway / Reverse Proxy
                          └──────┬──────┘
              ┌──────────────────┼──────────────────┐
              │                  │                   │
      ┌───────▼───────┐  ┌───────▼────────┐  ┌───────▼──────────┐
      │ Auth Service  │  │ Booking Service│  │ Notification Svc │
      │    :3001      │  │     :3002      │  │      :3003       │
      └───────┬───────┘  └───────┬────────┘  └──────────────────┘
              │                  │
              └────────┬─────────┘
                       │
                ┌──────▼──────┐
                │   MongoDB   │
                │   :27017    │
                └─────────────┘
```

---

## 🧩 Services

| Service | Port | Description | Database |
|---------|:----:|-------------|----------|
| 🌐 **Nginx** | `80` | Reverse proxy & API gateway | — |
| 🔐 **Auth Service** | `3001` | User authentication & JWT issuing | `hospital_auth` |
| 📅 **Booking Service** | `3002` | Appointment management | `hospital_booking` |
| 📧 **Notification Service** | `3003` | Email notifications via SMTP | — |
| 🗄️ **MongoDB** | `27017` | Persistent data storage | — |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Database** | MongoDB 7 |
| **Auth** | JSON Web Tokens (JWT) |
| **Gateway** | Nginx (Alpine) |
| **Email** | Nodemailer / SMTP |
| **Orchestration** | Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose installed
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/shreyash871/HOSPITAL-SYSTEM.git
cd HOSPITAL-SYSTEM
```

**2. Set up environment variables**

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> ⚠️ **Never commit your `.env` file.** Use a strong, random `JWT_SECRET` and a Gmail **App Password** (not your account password).

**3. Build & run the stack**

```bash
docker compose up --build
```

**4. Access the application**

```
http://localhost
```

---

## 📡 API Endpoints

> Update these to match your actual routes.

### 🔐 Auth Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in & receive JWT |

### 📅 Booking Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/bookings` | List all bookings |
| `POST` | `/api/bookings` | Create a booking |
| `DELETE` | `/api/bookings/:id` | Cancel a booking |

### 📧 Notification Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/notify` | Trigger an email notification |

---

## 📁 Project Structure

```
HOSPITAL-SYSTEM/
├── auth-service/           # Authentication microservice
├── booking-service/        # Appointment booking microservice
├── notification-service/   # Email notification microservice
├── nginx/
│   └── nginx.conf          # Reverse proxy configuration
├── docker-compose.yml      # Multi-container orchestration
├── .env                    # Environment variables (git-ignored)
├── .gitignore
└── README.md
```

---

## 🔒 Security Notes

- All secrets are managed through environment variables
- `.env` is excluded from version control via `.gitignore`
- JWT tokens expire after **7 days** by default
- Services communicate over an **isolated Docker network** (`hospital-net`)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

### 👨‍💻 Author

**Shreyash**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shreyash871)

⭐ *If you found this project helpful, give it a star!* ⭐

</div>

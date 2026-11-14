# WanderLink Deployment Guide 🚀

This document covers two production deployment strategies for WanderLink:
1. **Cloud PaaS (Vercel + Render / Railway)**: Recommended for fast, free/low-cost serverless hosting with continuous deployment from GitHub.
2. **Containerized (Docker & Docker Compose)**: Recommended for self-hosting on any cloud VM (AWS EC2, DigitalOcean, Linode, Hetzner, etc.).

---

## Architecture Overview

```
                      ┌──────────────────────┐
                      │    Client Browser    │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
       ┌───────────────────┐           ┌───────────────────┐
       │     Frontend      │           │    Backend API    │
       │   React + Vite    │──────────►│    Spring Boot    │
       │  (Vercel / Nginx) │           │ (Render / Docker) │
       └───────────────────┘           └─────────┬─────────┘
                                                 │
                                                 ▼
                                       ┌───────────────────┐
                                       │     Database      │
                                       │ MySQL / Postgres  │
                                       └───────────────────┘
```

---

## Option 1: Cloud Deployment (Vercel + Render)

### 1. Push Code to GitHub
Ensure your latest code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure production deployment"
git push origin main
```

---

### 2. Deploy Backend to Render (or Railway)

1. Go to [render.com](https://render.com) and log in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   * **Name**: `wanderlink-backend`
   * **Region**: Choose the closest region to your users (e.g., Singapore, Frankfurt, Oregon)
   * **Root Directory**: `backend`
   * **Environment**: `Java` (or `Docker`)
   * **Build Command**:
     ```bash
     mvn clean package -DskipTests
     ```
   * **Start Command**:
     ```bash
     java -jar target/wanderlink-backend-1.0.0.jar
     ```
   * **Plan**: Free / Starter
5. Under **Environment Variables**, add:
   * `SERVER_PORT`: `8080`
   * `WANDERLINK_CORS_ALLOWED_ORIGINS`: `https://your-frontend-app.vercel.app` *(update with your real frontend domain after Step 3)*
   * *(Optional: If using a real MySQL/Postgres instance)*:
     * `DB_URL`: `jdbc:mysql://<host>:<port>/wanderlink?...`
     * `DB_DRIVER`: `com.mysql.cj.jdbc.Driver`
     * `DB_USERNAME`: `<user>`
     * `DB_PASSWORD`: `<password>`
     * `DB_DIALECT`: `org.hibernate.dialect.MySQLDialect`
6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g., `https://wanderlink-backend.onrender.com`).

---

### 3. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** → **Project**.
3. Select your GitHub repository.
4. Configure the project:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click "Edit" and select `WanderLink-community-frontend`.
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   * **Name**: `VITE_API_BASE_URL`
   * **Value**: `https://wanderlink-backend.onrender.com/api` *(your Render backend URL followed by `/api`)*
6. Click **Deploy**.
7. Once deployed, copy your production frontend URL (e.g., `https://wanderlink.vercel.app`).

---

### 4. Update Backend CORS
Return to your backend service on **Render**:
1. Open the **Environment** tab.
2. Set `WANDERLINK_CORS_ALLOWED_ORIGINS` to `https://wanderlink.vercel.app`.
3. Save changes. Render will automatically redeploy the backend.

Your app is now live and fully connected! 🎉

---

## Option 2: Docker & Docker Compose (Single Server / VPS)

You can run the entire system (MySQL 8 + Spring Boot API + React Nginx) with Docker Compose on any server.

### Prerequisites
* Docker and Docker Compose installed (`docker compose version >= 2.0`)

### 1. Start All Services
From the root directory of the project:
```bash
docker compose up -d --build
```

### 2. Verify Running Containers
```bash
docker compose ps
```
You should see:
* `wanderlink-db` (healthy on port 3306)
* `wanderlink-backend` (running on port 8080)
* `wanderlink-frontend` (running on port 80)

### 3. Access the Application
* **Frontend UI**: `http://localhost` (or `http://<your-server-ip>`)
* **Backend API**: `http://localhost:8080/api` (or `http://<your-server-ip>:8080/api`)

### 4. Managing Containers
* **View logs**:
  ```bash
  docker compose logs -f
  # Or specific service:
  docker compose logs -f backend
  ```
* **Stop containers**:
  ```bash
  docker compose down
  ```
* **Stop containers and delete volumes (resets database)**:
  ```bash
  docker compose down -v
  ```

---

## Health Checks & API Verification

* Test groups endpoint:
  ```bash
  curl http://localhost:8080/api/groups
  ```
* Test accommodations endpoint:
  ```bash
  curl http://localhost:8080/api/accommodations
  ```
* Test food experiences endpoint:
  ```bash
  curl http://localhost:8080/api/food
  ```

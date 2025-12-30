# Uptime Monitoring System (Kubernetes + CI/CD)

A production-style uptime monitoring system that checks website availability, stores status in PostgreSQL, and sends alerts when a site goes down or recovers.

The application is containerized using Docker, deployed on Kubernetes, and uses GitHub Actions for CI to build and publish images to Docker Hub.

---

## Architecture Overview

Client
↓
API (Node.js)
↓
PostgreSQL ←─── Background Checker
↓
Webhook Alerts

##CI (GitHub Actions) → Docker Hub → Kubernetes (Image Pull)

---

## Key Features

- Periodic uptime checks using a background checker
- Transition-based alerting (DOWN / RECOVER)
- Persistent state stored in PostgreSQL
- Webhook-based notifications
- Dockerized application
- Kubernetes deployment with:
  - Readiness and liveness probes
  - Rolling updates
  - Graceful shutdown handling (SIGTERM)
- CI pipeline using GitHub Actions
- Docker Hub as image registry

---

## Tech Stack

- **Backend:** Node.js
- **Database:** PostgreSQL
- **Containerization:** Docker
- **Orchestration:** Kubernetes (Minikube for local development)
- **CI:** GitHub Actions
- **Alerts:** Webhook (Webhook.site for testing)

---

## Failure Handling & Reliability

- Database outages do not crash the application
- Checker failures are logged without stopping the service
- CrashLoopBackOff issues debugged and resolved
- Graceful shutdown ensures clean pod termination
- Old pods remain active during rollouts until new pods are ready

---

## Running Locally (Docker)

```bash
docker build -t uptime-monitor .
docker run -p 3000:3000 uptime-monitor
```
**##Running on Kubernetes (Minikube)**
```bash
kubectl apply -f k8s/
kubectl -n uptime port-forward svc/uptime-app 8080:80
```
Access the API at:
http://localhost:8080

**##API Endpoints**
Add a monitor

```bash
POST /monitors
{
  "url": "https://example.com"
}
```
List monitors
```bash
GET /monitors
```
Health Check
```bash
GET /health
```
Readiness Check
```bash
GET /ready
```

**Alerting**

Alerts are triggered only on state transitions

DOWN alert when a site becomes unreachable

RECOVER alert when a site comes back up

Alerts are sent via HTTP POST to a configured webhook URL

**CI/CD Pipeline**

Triggered on every push to main

Builds Docker image

Pushes image to Docker Hub

Image is tagged with:

latest

commit SHA

Kubernetes pulls the image using imagePullPolicy: Always

Deployment to Minikube is performed manually (local cluster)

**Why This Project**

This project was built to gain hands-on experience with real-world backend and DevOps challenges, including container lifecycle management, Kubernetes rollouts, CI/CD pipelines, failure recovery, and alerting reliability.

**Future Improvements**

Add a frontend UI for managing monitors

Alert throttling and cooldowns

Authentication and multi-user support

Metrics and dashboards (Prometheus/Grafana)

Deployment to a managed cloud Kubernetes cluster

**Author**
Built by **Rutwik Patil**


# Uptime Monitoring System (Kubernetes + CI/CD)


A production-style uptime monitoring system that checks website availability, stores status in PostgreSQL, and sends alerts when a site goes down or recovers.

The application is containerized using Docker, deployed on Kubernetes, and uses GitHub Actions for CI to build and publish images to Docker Hub.


## Architecture Overview

### High-Level Architecture Diagram

### Architecture Explanation

Client requests are routed through a Kubernetes Service to a Node.js application running in a Deployment.  
The application stores monitor state in PostgreSQL and runs a background checker that periodically verifies URL availability.

When a monitor transitions between UP and DOWN states, webhook alerts are triggered.  
The application supports graceful shutdown and rolling updates using Kubernetes readiness probes.

GitHub Actions is used to build and push Docker images to Docker Hub.  
The Kubernetes cluster pulls the latest image during deployments.

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
## Tech stack

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

## Running on Kubernetes (Minikube)
```bash
kubectl apply -f k8s/
kubectl -n uptime port-forward svc/uptime-app 8080:80
```

## Access the API at
```bash
http://localhost:8080
```

## API Endpoints

### Add a monitor
```bash
POST /monitors
Content-Type: application/json

{
  "url": "https://example.com"
}
```
### List monitors
```bash
GET /monitors
```
### Health check
```bash
GET /health
```
### Readiness check
```bash
GET /ready
```


## Alerting

- Alerts are triggered only on state transitions

- DOWN alert when a site becomes unreachable

- RECOVER alert when a site comes back up

- Alerts are sent via HTTP POST to a configured webhook URL

## CI/CD Pipeline

- Triggered on every push to main

- Builds Docker image

- Pushes image to Docker Hub

- Image is tagged with:

  - latest

  - commit SHA

- Kubernetes pulls the image using     
    -  imagePullPolicy: Always

- Local Minikube deployment is performed manually

## Future Improvements

- Add a frontend UI for managing monitors

- Alert throttling and cooldowns

- Authentication and multi-user support

- Metrics and dashboards (Prometheus/Grafana)

- Deployment to a managed cloud Kubernetes cluster

## Author
- Built by Rutwik Patil
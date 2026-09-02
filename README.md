# PrintToDoor — AWS Deployment Architecture

## Overview

PrintToDoor is a print-on-demand web application built with a modern full-stack architecture. This repository contains the deployment-oriented structure for the application, with a **Laravel API backend**, **Next.js TypeScript frontend**, containerized development environment, and an AWS-based production architecture.

The project is designed with a clear separation between application services, database infrastructure, file storage, networking, and deployment automation.

The primary goal is to build a reliable and maintainable deployment workflow that can support development, testing, and future production workloads.

---

## Technology Stack

### Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* Docker

### Backend

* Laravel 11
* PHP 8.2+
* REST API
* Laravel Queue
* Docker

### Database & Storage

* MySQL 8
* Amazon RDS
* Amazon S3

### Infrastructure & DevOps

* Amazon EC2
* Docker & Docker Compose
* NGINX
* GitHub
* GitHub Actions
* Namecheap DNS
* HTTPS / SSL

---

# Application Architecture

The application is divided into two primary applications:

```text
PrintToDoor
│
├── Frontend
│   └── Next.js + TypeScript
│
└── Backend
    └── Laravel REST API
```

The backend also contains a Laravel queue worker for asynchronous tasks such as email processing and other background jobs.

---

# Local Development Architecture

The local development environment uses Docker containers to reproduce the major application services.

```text
                         Browser
                            │
             ┌──────────────┴──────────────┐
             │                             │
       localhost:3000                localhost:8000
             │                             │
             ▼                             ▼
       Next.js Container            Laravel Container
             │                             │
             │                             │
             └──────── Docker Network ─────┘
                                           │
                                           ▼
                                      MySQL Container
                                          
                                      Queue Container
```

The frontend and backend are maintained as separate Docker Compose projects while communicating through a shared Docker network.

This allows the application to maintain clear service boundaries while still supporting efficient local development.

---

# AWS Production Architecture

The target AWS architecture separates the application layer from managed infrastructure services.

```text
                         Internet
                            │
                            ▼
                    Namecheap DNS
                            │
                            ▼
                    AWS EC2 Instance
                            │
                            ▼
                         NGINX
                     Reverse Proxy
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
     Next.js Container              Laravel Container
     Frontend Application            REST API
                                           │
                                           ▼
                                   Laravel Queue Worker
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                              ▼                         ▼
                         Amazon RDS                 Amazon S3
                          MySQL 8             Files / Uploads
```

### Domain Routing

The production domain will use separate routes for the frontend and API:

```text
https://yourdomain.com
        │
        ▼
      NGINX
        │
        ▼
    Next.js


https://api.yourdomain.com
        │
        ▼
      NGINX
        │
        ▼
     Laravel API
```

NGINX acts as the reverse proxy and routes incoming requests to the appropriate application container.

---

# AWS Infrastructure

## Amazon EC2

EC2 hosts the application containers:

* NGINX
* Next.js
* Laravel
* Laravel Queue Worker

For the initial development and testing stage, these services are intentionally kept on a single EC2 instance to keep the infrastructure simple and cost-effective.

The architecture can later be expanded into separate compute services as traffic and business requirements grow.

## Amazon RDS

MySQL is planned to run on **Amazon RDS** rather than inside the production application container.

Benefits include:

* Managed database infrastructure
* Automated backups
* Easier maintenance
* Database monitoring
* Separation between application and database infrastructure

## Amazon S3

Amazon S3 will be used for application files and uploaded assets rather than relying on the EC2 filesystem.

This provides more suitable storage for user-generated files and future scaling.

---

# Git Branching Strategy

The repository uses separate development and production branches for the frontend and backend.

```text
frontend-dev
      │
      ▼
frontend-main
      │
      ▼
Frontend Deployment → EC2


backend-dev
      │
      ▼
backend-main
      │
      ▼
Backend Deployment → EC2
```

### Frontend

`frontend-dev`

Used for frontend development and testing.

`frontend-main`

Contains production-ready frontend code and will be connected to the frontend deployment workflow.

### Backend

`backend-dev`

Used for backend development and testing.

`backend-main`

Contains production-ready backend code and will be connected to the backend deployment workflow.

---

# CI/CD Direction

The planned deployment workflow is:

```text
Developer
    │
    ▼
Development Branch
    │
    │ Testing / Review
    ▼
Main Branch
    │
    ▼
GitHub Actions
    │
    ▼
AWS EC2
    │
    ▼
Docker Deployment
```

Frontend and backend deployments can be triggered independently.

For example:

```text
frontend-main
      │
      ▼
GitHub Actions
      │
      ▼
Build / Deploy Next.js
      │
      ▼
EC2
```

and:

```text
backend-main
      │
      ▼
GitHub Actions
      │
      ▼
Build / Deploy Laravel
      │
      ▼
EC2
```

This allows frontend and backend changes to be deployed independently.

---

# Environment & Secrets Management

Application secrets and production environment variables are **not stored in Git**.

Development machines use local environment files such as:

```text
backend/.env
frontend/.env.local
```

These files are excluded through `.gitignore`.

Git contains safe configuration templates such as:

```text
backend/.env.example
```

Production configuration will be managed separately on the deployment infrastructure.

This separation helps protect:

* Database credentials
* API keys
* Stripe secrets
* AWS credentials
* Application secrets
* Production service configuration

---

# Docker Strategy

Docker is used to provide consistent development and deployment environments.

### Development

```text
Docker Compose
│
├── Next.js
├── Laravel
├── Laravel Queue
└── MySQL
```

### Production

```text
EC2
│
├── NGINX
├── Next.js Container
├── Laravel Container
└── Queue Container
     │
     ├── RDS
     └── S3
```

The development environment uses Docker volumes and shared networking to support rapid development while maintaining service isolation.

Production containers will use optimized Docker images and production startup commands.

---

# Security & Reliability Considerations

The deployment architecture is designed with several security and reliability principles:

* Production secrets are kept outside Git.
* Database infrastructure is separated from application containers.
* HTTPS will be enabled for public application traffic.
* NGINX provides a controlled public entry point.
* MySQL production data is stored in Amazon RDS.
* Application files are stored in Amazon S3.
* Docker provides service isolation.
* Git branches separate development and production-ready code.
* CI/CD will provide repeatable deployments.

---

# Deployment Roadmap

The project is being developed incrementally:

```text
✓ Laravel + MySQL local development
✓ Next.js local development
✓ Dockerized backend
✓ Dockerized frontend
✓ Docker networking
✓ Development environment configuration
✓ Git repository and branching strategy

→ Production Docker configuration
→ NGINX reverse proxy
→ AWS EC2 deployment
→ Amazon RDS
→ Amazon S3
→ Namecheap DNS
→ HTTPS / SSL
→ GitHub Actions CI/CD
→ Production deployment
```

---

# Project Structure

```text
printtodoor/
│
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── .gitignore
└── README.md
```

---

# Engineering Goals

The deployment architecture is being developed with the following goals:

* Clean separation of frontend and backend services
* Containerized development and deployment
* Reproducible environments
* Secure environment-variable management
* Managed database infrastructure
* Scalable object storage
* Reverse-proxy based routing
* Independent frontend and backend deployments
* Automated CI/CD
* Cost-conscious AWS infrastructure for the early development stage

The architecture is intentionally simple at the current stage while keeping a clear path toward a more scalable production environment.

---

## Current Status

**Project:** PrintToDoor

**Architecture:** Docker + AWS

**Frontend:** Next.js / TypeScript

**Backend:** Laravel 11 / PHP

**Database:** MySQL 8 / Amazon RDS

**Storage:** Amazon S3

**Compute:** Amazon EC2

**Reverse Proxy:** NGINX

**CI/CD:** GitHub Actions — planned

**DNS:** Namecheap

**SSL:** Planned

---

## Deployment Philosophy

The objective is not simply to deploy the application to AWS, but to build an infrastructure that is **repeatable, maintainable, secure, and easy for developers to work with**.

The architecture starts small for the current development and testing workload while maintaining a clear migration path toward higher availability and scalability as the PrintToDoor platform grows.

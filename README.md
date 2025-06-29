<<<<<<< HEAD
# 🎟️ Microservices Ticketing App (EDA + Kubernetes)

A production-grade, event-driven microservices architecture for a ticketing platform where users can buy and sell tickets. Built using Node.js, TypeScript, NATS, Redis, Stripe, and deployed on Kubernetes.

---

## 🧱 Tech Stack

| Layer          | Tech Used                                 |
| -------------- | ------------------------------------------ |
| Frontend       | Next.js (TypeScript)                       |
| Auth           | Node.js + Express + MongoDB + JWT         |
| Ticketing      | Node.js + MongoDB + OCC                   |
| Orders         | Node.js + MongoDB + Redis                 |
| Payments       | Node.js + Stripe Integration              |
| Expiration     | Redis Queue + Event-Based Expiry Logic    |
| Event Bus      | NATS Streaming Server (Pub/Sub)           |
| Deployment     | Kubernetes + Docker + Ingress Controller  |
| Shared Module  | Custom NPM Package (Events, Errors, Auth) |

---

## 🧠 Architecture

- Microservices: Independent, language-agnostic services
- Event-Driven Communication: Using NATS for reliable Pub/Sub
- Optimistic Concurrency Control (OCC): Prevents race conditions
- Redis Queue: Handles time-based expiry of orders
- Stripe Payment Integration
- Secure JWT-based authentication
- Deployed via Kubernetes using `ClusterIP` for internal service communication and `Ingress` for external access

---

## 🧭 Microservices Overview

### 🧑‍💼 Auth Service
- Login, Signup, JWT-based Auth
- Issues and verifies tokens via shared middleware

### 🎫 Ticketing Service
- CRUD tickets
- Implements OCC via Mongoose `version` key
- Publishes events: `ticket:created`, `ticket:updated`, `ticket:deleted`

### 📦 Order Service
- Manages ticket reservations
- Listens to ticket events
- Emits: `order:created`, `order:cancelled`, `order:awaitingpayment`

### 🕒 Expiration Service
- Uses Redis to manage expiring orders
- Publishes: `order:expired`

### 💳 Payment Service
- Listens to `order:created`
- Processes via Stripe API
- Emits: `payment:created`

### 🌐 Client (Next.js)
- React + TypeScript frontend
- Talks to backend via Kubernetes ingress

---

## 📬 Event Flow (Simplified)

```mermaid
graph TD
  Client -->|REST| Ingress
  Ingress --> Auth
  Ingress --> Ticket
  Ingress --> Order
  Auth -- JWT --> AllServices
  Ticket -- ticket:created --> NATS
  Order -- order:created --> NATS
  Expiration -- order:expired --> NATS
  Payment -- payment:created --> NATS
  NATS --> Order
  NATS --> Expiration
  NATS --> Payment
=======
# Ticketing-EDA-
>>>>>>> 2bdf577353b4a9c97828a1f08a1fa6c5eeb16438

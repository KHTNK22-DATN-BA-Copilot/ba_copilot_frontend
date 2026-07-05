# TicketBox Project Specification Documentation

## Project Overview
- High-concurrency event ticketing system.
- Designed to handle massive load spikes (e.g., 80,000 users in the first 5 minutes).
- Features strict per-user ticket limits.
- Manages unstable payment gateways (VNPAY/MoMo).
- Supports offline mobile ticket inspection in weak-signal stadium areas.
- Implements one-way VIP CSV list synchronization.

## High-Level Design (HLD)
### Backend Architecture
- **Technology Stack**: Java and Spring Boot ecosystem.
- **C4 Level 2 Container Diagram**:
  ```mermaid
  graph TD;
      A[Next.js Web App] -->|HTTP| B[Java Backend API];
      B --> C[Database];
      B --> D[Message Broker];
      B --> E[Redis Cache];
      A -->|WebSocket| F[Mobile App];
  ```

## Low-Level Design (LLD)
### Entity-Relationship Diagram (ERD)
- **Core Ticketing Models**:
  ```mermaid
  erDiagram
      Concert ||--o{ TicketType : has
      TicketType ||--o{ Order : contains
      Order ||--|{ User : placed_by
  ```
- **Idempotency Key Mechanism**:
  - **Key Generation**: Unique per request.
  - **Storage**: Temporary storage in Redis.
  - **Expiration**: Configured TTL (Time-To-Live) to prevent stale keys.

## Infrastructure & Deployment
- **Docker Containerization Strategies**:
  - Use Docker for environment consistency.
  - Multi-stage builds for optimized images.
- **Load Balancing**:
  - Implement load balancers to distribute incoming traffic evenly.
  - Auto-scaling groups to handle sudden traffic spikes.
- **Circuit Breaker Patterns**:
  - **Closed**: Normal operation.
  - **Open**: Stops calls to failing services.
  - **Half-Open**: Tests service recovery.

## UI/UX Design
- **Interactive SVG Seating Chart**:
  - Dynamic rendering based on availability.
  - User-friendly interface for seat selection.

## Requirements Traceability Matrix (RTM)
| Requirement ID | Requirement Description                                 | LLD Specification Reference                   |
|----------------|-------------------------------------------------------|----------------------------------------------|
| REQ-001        | Handle 80,000 concurrent users                         | HLD - Backend Architecture                    |
| REQ-002        | Enforce per-user ticket limits                         | LLD - Entity-Relationship Diagram (User)    |
| REQ-003        | Integrate VNPAY/MoMo payment gateways                 | LLD - Idempotency Key Mechanism              |
| REQ-004        | Support offline mobile ticket inspection               | HLD - High-Level Design                      |
| REQ-005        | Implement one-way VIP CSV list synchronization         | LLD - Entity-Relationship Diagram (Concert)  |
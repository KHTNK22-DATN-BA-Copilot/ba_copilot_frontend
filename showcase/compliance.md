# TicketBox Compliance Document

## 1. Project Overview

TicketBox is designed as a high-concurrency event ticketing system capable of handling massive user loads, especially during ticket sales for major concerts in Vietnam. The system must ensure fairness in ticket distribution, enforce per-user ticket limits, manage unstable payment gateways, and provide offline capabilities for ticket inspection.

## 2. Risk Register

### 2.1. Concurrent Ticket Disputes
- **Risk**: Multiple users attempting to purchase the last available SVIP ticket simultaneously.
- **Mitigation Strategy**: Implement optimistic locking mechanisms to ensure that once a ticket is reserved for a user, it cannot be purchased by another until the transaction completes or fails.

### 2.2. Payment Timeout Scenarios
- **Risk**: Users may experience payment timeouts, leading to potential double charges.
- **Mitigation Strategy**: Use idempotency keys for payment transactions, ensuring that even if a user submits multiple requests, only one charge is processed. The system should check for existing transactions before initiating a new one.

### 2.3. Corrupted CSV File Imports
- **Risk**: Inconsistencies and errors during the import of guest lists from CSV files.
- **Mitigation Strategy**: Implement validation checks on the CSV format before processing. Log errors and notify administrators of any issues while allowing successful entries to be processed.

## 3. Feasibility & Compliance

### 3.1. Performance Feasibility
- The system is designed to handle thousands of requests per second. Key strategies include:
  - **Caching**: Utilize Redis for caching concert information and ticket availability to reduce database load.
  - **Load Balancing**: Distribute incoming traffic across multiple servers to handle high concurrency effectively.
  - **Rate Limiting**: Apply techniques such as the Token Bucket algorithm to manage traffic spikes during ticket sales.

### 3.2. CI/CD Compliance
- Ensure automated test coverage of over 70% using JaCoCo. This requirement will be enforced through a Jenkinsfile, ensuring that builds are blocked if coverage falls below the threshold. The CI/CD pipeline will include the following steps:
  - Code compilation and quality checks.
  - Running automated tests with JaCoCo for coverage metrics.
  - Deployment to staging environments for further validation.
  - Manual or automated promotion to production upon successful testing.

## 4. Conclusion

The TicketBox project will implement comprehensive risk management strategies, ensuring compliance with performance and quality standards while addressing the specific challenges of high-concurrency ticket sales. Continuous testing and monitoring will be pivotal in maintaining system integrity and user satisfaction.
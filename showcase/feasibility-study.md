# Feasibility Study for TicketBox Project

## Project Overview
The TicketBox project aims to create a robust ticketing system for high-demand events in Vietnam, addressing issues such as high concurrency during ticket sales, payment processing, and ticket inspection. 

## Objectives
- Develop a scalable ticketing system capable of handling up to 80,000 concurrent users.
- Implement strict per-user ticket limits to prevent scalping and fraud.
- Ensure reliable payment processing through VNPAY and MoMo.
- Support offline ticket inspection in areas with weak signal.
- Facilitate one-way synchronization of VIP guest lists via CSV.

## Key Assumptions
- The system will be hosted on a cloud environment capable of scaling resources dynamically.
- Users will interact primarily via web and mobile applications.
- The performance constraints will be evaluated based on real-world traffic patterns.

## Risk Register
| Risk | Description | Mitigation Strategy |
| --- | --- | --- |
| Concurrent Ticket Disputes | Ensuring no two users get the last SVIP ticket | Implement optimistic locking in the database and a transactional approach for ticket sales. |
| Payment Timeout Scenarios | Users may experience payment timeouts without receiving tickets | Use idempotency keys to prevent double-charging and ensure transaction integrity. |
| Corrupted CSV File Imports | Issues with guest list data integrity | Implement validation checks for CSV format and fallback mechanisms for manual correction. |

## Performance Feasibility
The system must be capable of processing thousands of requests per second. Key strategies include:
- **Load Balancing:** Distributing incoming traffic across multiple servers to manage high loads effectively.
- **Caching:** Implementing caching strategies (e.g., Redis) to reduce database load for frequently accessed data.
- **Rate Limiting:** Using techniques like Token Bucket or Leaky Bucket to manage sudden spikes in ticket purchases.

## CI/CD Compliance
To ensure continuous integration and delivery, the following requirements will be enforced:
- Automated test coverage must exceed 70%, monitored using JaCoCo.
- The Jenkinsfile will explicitly define build and test processes, including coverage checks.

## Conclusion
The TicketBox project is feasible given the planned technical architecture and risk mitigation strategies. The implementation of robust performance measures and CI/CD practices will ensure a reliable ticketing experience for users.

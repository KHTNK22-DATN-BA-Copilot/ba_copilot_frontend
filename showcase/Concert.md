# COURSE PROJECT – TicketBox

## Context

Major music concerts in Vietnam — such as Anh Trai Say Hi, Anh Trai Vuot Ngan Chong Gai, Em Xinh Say Hi, Chi Dep Dap Gio Re Song — attract tens of thousands of audiences. When organizers open ticket sales, websites often crash within the first few minutes due to massive concurrent traffic; audiences are charged but do not receive tickets; scalpers use bots to buy out all tickets in seconds and resell them at multiple times the original price. Currently, many events still sell tickets through fragmented channels: Zalo OA, Google Forms, manual bank transfers — which does not ensure fairness and is highly prone to fraud. The event organizing company wants to build the TicketBox system to digitize the entire ticketing process, from the moment sales open until the audience enters the event gates. 

## Users

| Group | Description |
| --- | --- |
| **Audience** | View concert information, buy tickets, receive e-tickets, check-in at the gate |
| **Organizer** | Create and manage concerts, configure ticket types, track revenue and sales volume |
| **Ticket Inspector** | Verify tickets at the entrance using a mobile app |

## System Requirements

### View and buy tickets

* Audiences can view the list of upcoming concerts, including performing artists' information, venue, seating chart (interactive SVG chart by zone: GA, SVIP, VIP, CAT1, CAT2), and the remaining number of tickets in real-time for each type. 


* Audiences select the ticket type and quantity, then proceed to payment via payment gateways (VNPAY, MoMo). 


* Upon successful payment, audiences receive an e-ticket in the form of a QR code to enter the event gates. 


* Each account is only allowed to purchase a maximum number of tickets per ticket type, configured by the organizer when creating the concert (e.g., SVIP maximum 2 tickets/account, CAT1 maximum 4 tickets/account). 


* This limit applies across all successfully paid orders — audiences cannot bypass it by creating multiple small orders. 



### Notifications

* After successfully purchasing tickets, audiences receive a confirmation notification via the app and email with the e-ticket attached. 


* When the concert is approaching (24 hours beforehand), the system sends automatic reminders. 


* The system needs to be designed to easily add new notification channels (e.g., Zalo OA, SMS) in the future without major changes. 



### Administration

* Organizers use the admin website to create new concerts, configure ticket types (name, price, quantity, opening time), update information, or cancel concerts. 


* The admin page is strictly for internal use and requires strict access control — the three user groups have different permissions: audiences can only view information and buy tickets; organizers have the right to create, edit, cancel concerts, and view revenue statistics; ticket inspectors only have access to the QR code scanning function. 



### Event Ticket Inspection

* Staff at the entrance use a mobile app to scan the QR codes on the audiences' e-tickets. 


* Large concert venues (stadiums, arenas) often have unstable signal areas when tens of thousands of people gather — the app must allow temporary recording of ticket scans when there is no network and automatically sync when the connection is restored. 



### AI Artist Bio

* Organizers can upload the artists' profile PDF files or concert press kits. 


* The system automatically processes, extracts content, cleans the text, and sends it to an AI model to generate a concise introduction displayed on the concert details page. 



### Syncing VIP Guest List

* Some concerts have a Guest List area for sponsors' invited guests. 


* The brand's guest management system does not have an API — the only method is to receive a CSV file sent by the brand on the night before the event day. 


* TicketBox needs to periodically import this list so ticket inspectors can verify guests at the VIP gates. 



## Problems to Solve

* 
**Ticket disputes:** Some SVIP ticket types for the Anh Trai Say Hi concert only have 200 seats, but tens of thousands of audiences might try to buy them simultaneously right when sales open. The system must ensure that no two audiences receive the last ticket. 


* 
**Sudden load spikes:** When the Chi Dep Dap Gio Re Song concert opens for sale, an estimated 80,000 users will access it in the first 5 minutes, with 70% concentrated in the first minute. The system needs a mechanism to protect the backend API from overload, prevent bots and clients from sending continuous requests, while ensuring fairness among real audiences. 


* 
**Unstable payments:** If payment gateways (VNPAY/MoMo) experience issues, audiences must still be able to view concert info and the remaining ticket lists normally. The paid ticketing flow needs to handle payment timeout situations without causing double charges; non-payment features must continue to function normally when payment gateways experience prolonged issues. 


* 
**Offline ticket inspection:** Staff in weak signal areas within the stadium must still be able to inspect tickets for audiences; data must not be lost when the connection returns, and a single ticket must not be allowed to enter the gates twice. 


* 
**One-way integration:** It's impossible to call the brand's guest management system API — we can only read the CSV sent on a fixed schedule. The data import flow must handle corrupted files, duplicate data, and must not disrupt the running system. 


* 
**Hard-to-enforce per-user ticket limits under high load:** When tens of thousands of people buy tickets simultaneously, it must be ensured that the limit on the number of tickets per account is accurately applied — preventing one person from exceeding the limit despite sending multiple concurrent requests. This is a similar problem to seat disputes but at a per-user scope rather than system-wide. 


* 
**Home page and concert details page overload:** The concert list page and individual concert details pages are read at a very high frequency (thousands of times/second during peak hours), but the data changes infrequently. If every request queries directly into the database, the system will not withstand the load. A reasonable caching strategy is needed to reduce database load while ensuring data is sufficiently updated (e.g., remaining tickets must closely reflect reality). 



---

## Tasks to Complete

### Part 1 — Blueprint

**1. System Design Document**

* Describe the overall architecture of the system, including main components, how they communicate, and the reasoning behind choosing that architecture. 


* The document needs to answer these questions: what components does the system consist of, how do the components communicate, and when one component fails, how are the rest affected. 



**2. C4 Diagram**

* Draw the top two levels of the C4 diagram:
* 
**Level 1 – System Context:** showcases TicketBox in the big picture — who uses the system, which external systems are integrated. 


* 
**Level 2 – Container:** breaks the system down into containers (e.g., web app, mobile app, backend API, database, message broker), specifying the proposed technologies and how containers communicate with each other. 





**3. High-Level Architecture Diagram**

* Draw an overall architecture diagram illustrating the data flow and dependencies between components, especially at integration points (payment gateways, AI models, CSV guest systems) and the offline ticket inspection flow. 



**4. Database Design**

* Identify the main types of data in the system, propose a suitable database type (SQL, NoSQL, or a combination), and explain the reasoning based on each data type's characteristics. 


* Design schemas for the most important entities.
* **5. Describe important business flows**
* Detail at least two of the following flows:
* Ticket purchasing flow (from clicking "Buy ticket" to receiving the e-ticket)
* Ticket inspection flow during network loss and resyncing
* CSV guest list import flow


* For each flow, present the processing steps, participating components, and how the system reacts when an error occurs midway. 



**6. Access Control Design**

* Design an authorization model for the system. 


* Identify user groups, their corresponding permissions, and explain how the system checks permissions at each access point (API endpoints, admin page, ticket inspection mobile app). 


* Teams can refer to the RBAC (Role-Based Access Control) model or propose another approach if there is a suitable reason. 



**7. System Protection Mechanism Design**

* For each technical issue below, present the solution chosen by the team, explain how it works, and why it is suitable for the problem. 


* Suggested techniques are provided, but teams can propose alternative solutions with convincing arguments:
* 
**Sudden load control:** How can the backend API avoid overloading when 80,000 people concurrently access to buy tickets in the opening minute?  (Hint: Rate Limiting — Fixed Window, Sliding Window, Token Bucket, Leaky Bucket)


* 
**Handling unstable payment gateways:** How should the system react when VNPAY/MoMo continuously fails without crashing the entire service?  (Hint: Circuit Breaker with Closed / Open / Half-Open states, combined with Graceful Degradation)


* 
**Preventing double charging:** How to ensure a ticket purchase transaction is executed exactly once even if the audience clicks multiple times or the network drops midway?  (Hint: Idempotency Key — key generation mechanism, storage location, duplicate checking method, expiration time)


* 
**Caching:** How can the concert list and details pages avoid overloading the database with thousands of requests/second while still accurately reflecting the remaining tickets?  (Hint: Cache-aside with Redis — define appropriate TTLs for each data type: infrequently changed concert info can have a long cache, remaining tickets need a short TTL or active invalidation upon a successful transaction)





### Part 2 — Implementation

A complete, runnable software that implements the entire system described in the Blueprint. 
The implementation must include:

* 
**Complete business features:** All functions described in the System Requirements section — view concerts, buy tickets, notifications, administration, ticket inspection, AI Artist Bio, CSV guest sync. 


* 
**Technical mechanisms:** All solutions designed in Blueprint sections 6 and 7 must be actually implemented in code, not just simulated or stubbed. 


* 
**Launch instructions:** A clear README, sufficient for the examiner to clone the repository and run the system without further questions. 


* 
**Sample data:** Seed data or initial data creation scripts — including sample concerts (Anh Trai Say Hi, Anh Trai Vuot Ngan Chong Gai, Em Xinh Say Hi, Chi Dep Dap Gio Re Song) with full ticket types, prices, and seating charts — so operations and testing can be done immediately after launching. 



### Reference: Blueprint Template

Reference template based on OpenSpec structure — a spec-driven development framework, consisting of three document layers: proposal (problem and reasons), design (technical solutions), specs (scenarios and constraints for each feature). Teams can add sections or adjust the structure if appropriate. 

```text
blueprint/
├── proposal.md          # Context, problem, goals
├── design.md            # Architecture, diagrams, technical decisions
└── specs/
    ├── auth.md          # Authorization specs
    ├── payment.md       # Payment flow and double-charging prevention specs
    ├── checkin.md       # Offline ticket inspection specs
    └── ...              # Other feature specs

```



---

### `proposal.md`

```markdown
# TicketBox — Project Proposal

## Problem
## Goals
## Users and Needs
## Scope
## Risks and Constraints

```



---

### `design.md`

```markdown
# TicketBox — Technical Design

## Overall Architecture
## C4 Diagram

### Level 1 — System Context
### Level 2 — Container
## High-Level Architecture Diagram
## Database Design
## Access Control Design
## System Protection Mechanism Design

### Sudden Load Control
### Unstable Payment Gateway Handling
### Double-Charging Prevention
### Caching
## Key Technical Decisions (ADR)

```



---

### `specs/[feature].md`

```markdown
# Spec: [Feature Name]

## Description
## Main Flow
## Error Scenarios
## Constraints
## Acceptance Criteria

```
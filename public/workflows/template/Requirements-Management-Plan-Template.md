# Organisation [Name]
## Department [Name]

**Requirements Management Plan**

**Date:** <Date>  
**Doc. Version:**  

***

**Template version:** 3.0.1  
This artefact template is aligned with the PM² Guide V3.0  
For the latest version of the templates visit: https://www.pm2alliance.eu/publications  

The PM² Alliance is committed to the improvement of the PM² Methodology and of its supporting artefact. Project management best practices and community contributions & corrections are incorporated in the PM² Alliance’s artefact templates.  
Join the PM² Alliance and visit the PM² Alliance GitHub to provide your feedback & contribution: https://github.com/pm2alliance  

***

### Document Control Information

| Settings | Value |
| :--- | :--- |
| **Document Title:** | Requirements Management Plan |
| **Project Title:** | |
| **Document Author:** | <Document Author> |
| **Project Owner:** | <Project Owner (PO)> |
| **Project Manager:** | <Project Manager (PM)> |
| **Doc. Version:** | |
| **Sensitivity:** | |
| **Date:** | |

***

### Document Approver(s) and Reviewer(s)

> **NOTE:** All Approvers are required. Records of each approver must be maintained. All Reviewers in the list are considered required unless explicitly listed as Optional.

| Name | Role | Action | Date |
| :--- | :--- | :--- | :--- |
| | | <Approve / Review> | |
| | | | |
| | | | |

***

### Document History

The Document Author is authorized to make the following types of changes to the document without requiring that the document be re-approved:
* Editorial, formatting, and spelling
* Clarification

To request a change to this document, contact the Document Author or Owner.  
Changes to this document are summarized in the following table in reverse chronological order (latest version first).

| Revision | Date | Created by | Short Description of Changes |
| :--- | :--- | :--- | :--- |
| | | | |
| | | | |
| | | | |

***

### Configuration Management: Document Location

The latest version of this controlled document is stored in `<location>`.

***

> **Notes for Templates:**  
> * **Text in `<orange>`:** has to be defined.  
> * **Text in `<blue>`/`*<italic>*`:** guidelines and how to use the Template. Should be deleted in the final version.  
> * **Text in `green`:** can be customised. Should be recoloured to black in the final version.  

***

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Requirements Management Objectives](#2-requirements-management-objectives)
3. [Requirements Management process](#3-requirements-management-process)
4. [The Requirements lifecycle](#4-the-requirements-lifecycle)
5. [Requirement Management Roles and Responsibilities](#5-requirement-management-roles-and-responsibilities)
6. [Tools and Techniques](#6-tools-and-techniques)
   * 6.1. [Requirements documentation](#61-requirements-documentation)
   * 6.2. [Requirements traceability matrix](#62-requirements-traceability-matrix)
7. [Requirements change management](#7-requirements-change-management)
8. [Related PM² Plans](#8-related-pm-plans)
9. [Appendix 1: References and Related Documents](#appendix-1-references-and-related-documents)

***

## 1. Introduction

* Define Requirements Management process, roles, responsibilities, standards, and tools for the project.

***

## 2. Requirements Management Objectives

* **Goal:** Gather, document, validate, and manage project requirements throughout the project lifecycle.
* **Deliverables:** Requirements Documentation, Requirements Traceability Matrix (RTM).
* **Integration:** Align and manage changes with the Project Change Management Plan.

***

## 3. Requirements Management process

*<Please tailor the requirements management process if necessary>*

* **Step 1: Specify:** Gather requirements from stakeholders and document in Requirements Documentation.
* **Step 2: Evaluate:** Assess feasibility, cost, scope alignment, priority (e.g., MoSCoW), and define acceptance criteria.
* **Step 3: Approve:** Formally agree on requirements and priorities (logged in Decision Log/Minutes).
* **Step 4: Monitor:** Track implementation progress and manage new/changed requirements via change control.
* **Step 5: Validate:** Verify deliverables against acceptance criteria with User Representatives.

***

## 4. The Requirements lifecycle

* **Stages:**
  * **Specified:** Documented.
  * **Proposed:** Evaluated, awaiting client approval.
  * **Approved:** Formally approved.
  * **Incorporated:** Added to Project Work Plan (PWP).
  * **Implemented:** Built and tested by the team.
  * **Validated:** Formally accepted by the client.
* **Special Statuses:**
  * **For Fixing:** Issue identified, requires resolution.
  * **Rejected:** Obsolete, out of scope, or duplicated.

***

## 5. Requirement Management Roles and Responsibilities 

* **Project Owner (PO):** Accountable for all requirements, approves/rejects documentation and priorities.
* **Project Steering Committee (PSC):** Informed on requirements status and change requests.
* **Business Manager (BM):** Identifies User Representatives (UR), assists in prioritizing and testing.
* **Solution Provider (SP):** Informed on requirements status.
* **Project Manager (PM):** Responsible for managing, monitoring, and reporting requirements.
* **Project Core Team (PCT):** Supports implementation and analysis.
* **Appropriate Governance Body (AGB):** Informed on status.
* **Other Stakeholders:** *<Please add other stakeholders if relevant.>*

| RAM (RASCI) | AGB | PSC | PO | BM | UR | SP | PM | PCT |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Requirements Management Plan** | I | I | A | C | C | I | R | S |
| **Manage Requirements** | I | I | A | C | C | I | R | S |

*\*AGB: Appropriate Governance Body.*  
The contact details of each of the above stakeholders are documented in the Project Stakeholder Matrix.

***

## 6. Tools and Techniques

* **Techniques:** Interviews, Brainstorming, Workshops, Observation, Prototyping, MoSCoW prioritization.
* **Tools:** Requirements documentation, Requirements Traceability Matrix (RTM).

***

### 6.1. Requirements documentation

*<Define the documentation structure to be used for requirements management>*

| Attribute | Description / Details |
| :--- | :--- |
| **ID** | Unique requirement identifier (numbered sequentially). |
| **Name** | Short name of the requirement. |
| **Category** | e.g. Business need, Feature, Functional, Technical, Quality, Performance, Security, etc. |
| **Type** | e.g. Epic, User story, Story board, Use Case, UI sketch, Business Process Model, etc. |
| **Requirement Description & Details** | Text description or diagrams/sketches. |
| **Acceptance Criteria** | Criteria used to test if the deliverable meets the requirement. |
| **Status** | e.g. Specified, Proposed, Approved, Incorporated, Implemented, Validated, For Fixing & Rejected. |
| **Requested by** | Stakeholder source of the requirement. |
| **Identification Date** | Date the requirement was raised. |

*The above is a suggested list of attributes. No template is provided.*

***

### 6.2. Requirements traceability matrix

*<Define the Traceability Matrix structure to be used for tracking relations between requirements and deliverables>*

| Attribute | Description / Details |
| :--- | :--- |
| **ID** | Unique identifier. |
| **Name** | Short and descriptive name. |
| **Status** | e.g. Specified, Proposed, Approved, Incorporated, Implemented, Validated, For Fixing & Rejected. |
| **Priority** | e.g. High, Medium, Low or Must-have, Should-have, Could-have, Won't-have. |
| **Size** | Estimated effort level (Big, Medium, Small). |
| **Comments** | Notes or reasons for rejection. |
| **Derived From** | Parent requirement ID (e.g. Business requirement). |
| **Related WBS code** | WBS element code producing the deliverable. |
| **Specification of documentation** | Reference document name and file location. |
| **Test Plan** | Test plan or acceptance criteria document location. |

*The above is a suggested list of attributes. No template is provided.*

***

## 7. Requirements change management

*<Customise the process that will be used to manage change to the requirements for this project.>*

* Log new or changed requirements using the **Change Request Form**.
* Process changes through the Requirements Management process and **Project Change Management Plan**.

***

## 8. Related PM² Plans

* **Project Handbook:** Establishes high-level project goals, standards, and escalation processes.
* **Project Change Management Plan:** Manages scope, budget, and timeline modifications.
* **Deliverable Acceptance Plan:** Outlines validation process and acceptance criteria.

***

## Appendix 1: References and Related Documents

*<Use this section to reference any relevant or additional information.>*

| ID | Reference or Related Document | Source or Link/Location |
| :--- | :--- | :--- |
| **1** | *<Example of a related document>*<br>04.Project_Handbook.XYZ.11-11-2017.V.1.0.docx | *<Example of a location>*<br>`< U:\METHODS\ProjectX\Documents\>` |
| **2** | | |
| | | |
| | | |
| | | |
| | | |

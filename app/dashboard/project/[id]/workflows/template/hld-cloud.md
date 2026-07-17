# HIGH-LEVEL CLOUD INFRASTRUCTURE DESIGN (HLD - CLOUD INFRASTRUCTURE)

| Project / System Name | [Project/System Name] |
| :--- | :--- |
| **Status** | Draft / Under Review / Approved |
| **Author** | [Cloud Architect / DevOps Engineer] |
| **Cloud Provider** | AWS / Azure / GCP / Hybrid / On-Prem |
| **Version** | v1.0.0 |
| **Date** | [YYYY-MM-DD] |

---

## 1. Networking & Topology
*Define the network layout, security boundaries, and traffic flow.*

*   **Infrastructure Topology Diagram:**
    *   *Keywords:* `VPC`, `Public Subnet`, `Private Subnet`, `NAT Gateway`, `Internet Gateway`, `Mermaid Diagram`.
    *   *Instruction:* Modify the Mermaid chart below to represent your network layout.
    ```mermaid
    graph TD
        Internet((Internet)) --> WAF[Cloud WAF]
        WAF --> ALB[Application Load Balancer]
        subgraph VPC [VPC: 10.0.0.0/16]
            subgraph PublicSubnets [Public Subnets - 10.0.1.0/24]
                ALB
                NAT[NAT Gateway]
            end
            subgraph PrivateSubnets [Private Subnets - 10.0.10.0/24]
                App[App Instance / EKS Worker Nodes]
            end
            subgraph IsolatedSubnets [Isolated Subnets - 10.0.20.0/24]
                DB[(Managed DB: RDS)]
            end
        end
        ALB --> App
        App --> DB
        App --> NAT
        NAT --> Internet
    ```
*   **Subnet Allocation & Security Zones:**
    *   **Public Subnet:** Hosts public load balancers (ALB), NAT Gateways, Bastion Hosts. Accessible from the internet.
    *   **Private Subnet:** Hosts App nodes and private services. No direct inbound internet access; outbound access via NAT Gateway.
    *   **Isolated Subnet:** Hosts database clusters and caches. No internet access (inbound/outbound); only internal connections from the Private Subnet.

## 2. Cloud Resources & Compute
*Define the specific managed cloud services selected for compute, storage, and identity management.*

*   **Compute Services:**
    *   *Keywords:* `Kubernetes (EKS/AKS/GKE)`, `VM Instance (EC2)`, `Serverless (ECS Fargate/Lambda)`.
    *   *Description:* Specify compute selection and instance sizes (e.g., using AWS EKS for containerized microservices).
*   **Storage & Database Services:**
    *   *Keywords:* `Managed DB (RDS PostgreSQL)`, `NoSQL (DynamoDB)`, `Object Storage (S3)`.
    *   *Description:* Define persistence types, replication, and encryption settings.
*   **Identity & Access Management (IAM):**
    *   *Keywords:* `IAM Roles`, `Least Privilege Principle`, `KMS (Key Management Service)`.
    *   *Description:* Restrict permissions for cloud services and manage encryption keys (e.g., using KMS for S3 bucket encryption).

## 3. Infrastructure as Code (IaC) & CI/CD
*Define the delivery pipeline and resource provisioning strategy.*

*   **Infrastructure as Code (IaC):**
    *   *Keywords:* `Terraform`, `Ansible`, `CloudFormation`.
    *   *Description:* Standardize infrastructure setup via declarative code modules.
*   **CI/CD Pipeline Workflow:**
    *   *Keywords:* `GitHub Actions`, `GitLab CI`, `ArgoCD (GitOps)`, `Container Registry (ECR/GCR)`.
    *   *Description:* Define steps for building docker images, running pipeline checks, pushing to registries, and deployment.

## 4. High Availability & Disaster Recovery (HA & DR)
*Detail system resiliency and data backup policies.*

*   **High Availability (HA):**
    *   *Keywords:* `Multi-AZ deployment`, `Auto Scaling Group (ASG)`, `Target Groups`.
*   **Disaster Recovery (DR) Targets:**
    *   *Keywords:* `RTO (Recovery Time Objective)`, `RPO (Recovery Point Objective)`.

| Metric | Target | Disaster Recovery Strategy |
| :--- | :--- | :--- |
| **RTO (Max Downtime)** | e.g., < 4 Hours | Multi-region secondary cluster, automated IaC environment spin-up |
| **RPO (Max Data Loss)** | e.g., < 1 Hour | Relational DB snapshots every hour, transactional replication |

## 5. Observability & Operations
*Design system health tracking, tracing, and alert delivery.*

*   **Metrics & Dashboards:**
    *   *Keywords:* `Prometheus`, `Grafana`, `AWS CloudWatch`, `Datadog`.
    *   *Description:* Collect CPU, Memory, Disk usage, and API response counts.
*   **Centralized Logging:**
    *   *Keywords:* `ELK Stack (Elasticsearch, Logstash, Kibana)`, `Loki`, `FluentBit`.
*   **Alerting & On-Call Escalation:**
    *   *Keywords:* `Slack notifications`, `PagerDuty`, `Opsgenie`.
    *   *Description:* Trigger alerting rules (e.g., alert on-call team if HTTP 5xx error rate > 2% or CPU > 85% for 5 mins).

# LLD-DB Design Template

## 1. Purpose and Scope

- Objective: Briefly state that this document provides the detailed database design for the specified module or feature. Explain which part of the system it covers (e.g., “User Management Database Schema”).
- Scope: Define what’s in and out of scope (e.g., specific features, tables, or modules). Link to higher-level requirements or use cases.
- Audience: List intended readers (e.g., database engineers, developers).

## 2. Database Overview

- Database Type: Specify the kind of database (e.g., _Relational SQL_, _NoSQL_, _Graph_, etc.) and rationale for choosing it.
- Data Domains: Summarize the main data entities or bounded contexts (e.g., _users_, _orders_, _inventory_) and how they relate to system functionality.
- Design Principles: State normalization level (3NF, denormalization, etc.) and any conventions used. Cite IEEE SDD _“data-driven design”_ guidance – this section describes structures and relationships of data objects.
- High-Level Data Model: Provide a brief description of how data will be organized (e.g., one database per service, shared schema, caching layers).

## 3. Entity-Relationship Diagram (ERD)

- Diagram: Include (or link to) an ERD showing all tables (entities), their attributes, primary/foreign keys, and relationships (one-to-one, one-to-many, many-to-many). Use standard notation.
- Key Entities: For each entity, give a short description (e.g., _“User – stores login and profile data.”_).
- Cardinality and Constraints: Note cardinalities and any important constraints (e.g., cascade deletes, uniqueness).

## 4. Table Schemas

- Schema Definition: For each table, list: table name, column names, data types, primary key, foreign keys, default values, and constraints (NOT NULL, UNIQUE, CHECK). Provide a brief description of each column’s purpose.
- Normalization: Explain how tables conform to normalization rules (or justify any intentional denormalization).
- Relationships: Describe how foreign keys link tables (e.g., _Order (order_id, user_id…): user_id is a FK referencing User.user_id_).
- Reference: Follow best practices by designing normalized schemas and documenting each table in detail.

## 5. Indexes and Performance Optimization

- Indexes: List indexes created on tables (single-column or composite), and justify each (e.g., which queries it accelerates). Indicate unique vs. non-unique indexes.
- Partitioning/Sharding: If used, describe partition keys or sharding strategy.
- Query Plan / Tuning: For critical queries (e.g., large joins or reports), outline expected execution plans or optimizations (e.g., covering indexes).
- Performance Goals: State any performance requirements (e.g., query < 100ms for 1M records).
- Reference: Include index design rationale and any performance benchmarking, as suggested for low-level design.

## 6. Stored Procedures, Triggers, and Views

- Stored Procedures/Functions: List any database procedures or functions, with their purpose and key logic. (E.g., _ValidateUserCredentials: checks password and updates last_login._)
- Triggers: Document database triggers (e.g., _AFTER INSERT on Orders updates Inventory_), including conditions and actions.
- Views: Describe any database views used for reporting or abstraction.
- Logic Notes: Provide brief pseudocode or SQL comments for complex logic if needed.

## 7. Sample Queries and Data Access Patterns

- Critical Queries: Provide example SQL queries or statements for major operations (e.g., retrieving user order history, updating status). Annotate them to highlight joins, filters, and logic.
- Data Access: Note how application code accesses the DB (e.g., through ORM, raw SQL). If using an ORM, explain table-to-object mappings.
- Security: Mention any query-level security (row-level filters, etc.).

## 8. Data Migration and ETL (if applicable)

- Migration Strategy: If migrating existing data, outline the ETL approach or scripts. Include sample transformation rules (e.g., migrating legacy user IDs).
- Seed Data: List initial or lookup tables data that must be populated (e.g., _UserRoles, Countries_).
- Constraints/Triggers: Ensure referential actions or data integrity checks for migration.

## 9. Security and Compliance

- Sensitive Data: Identify columns with sensitive information (e.g., PII) and how they are protected (e.g., encryption at rest, masking).
- Access Control: Specify how database permissions are granted (e.g., GRANT statements or roles). Define who can read/write specific tables.
- Auditing: If applicable, note any audit logs or change tracking.
- Regulatory: Address compliance (e.g., GDPR retention policies, encryption standards).

## 10. Backup and Recovery

- Backup Strategy: Describe backup frequency (full vs incremental), retention policy, and storage location.
- High Availability: Outline replication or clustering (e.g., master-slave, multi-AZ).
- Recovery Plan: Summarize steps to restore from backup (point-in-time recovery).

## 11. Appendices

- Data Dictionary: (Optional) A glossary of database terms, abbreviations, and domain-specific names.
- DDL Scripts: Reference or attach actual DDL SQL scripts for tables, indexes, etc.
- Revision History: Track document changes (version, date, author, summary).

> _Guidance:_ Ensure the LLD-DB document is a reference for developers/DBAs, with clear tables, diagrams, and explanation of data organization. It should enable building and querying the database without ambiguity.

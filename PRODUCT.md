# Product Truth: Student Records RESTful API & Registry Dashboard

## 1. Positioning & Purpose
- **Product**: Production-ready RESTful API and operational registry dashboard for managing academic database records.
- **Audience**: University registrars, academic advisors, faculty evaluators, and API developers needing predictable, schema-validated CRUD operations and high-visibility record management.
- **Surface Mode**: `Operate` (clinical precision, high-density data tables, zero frivolous motion or decorative fluff, instant feedback).

## 2. Core Functional Requirements
- **Create (POST)**: Create new student academic records with strict server-side validation (unique PRN, RFC 5322 email validation, department enum, semester bounds 1–8, CGPA range 0.00–10.00).
- **Read (GET)**: Retrieve records with query-level search (matching PRN, name, email), multi-criteria filtering (department, enrollment status), column sorting (name, CGPA, date), and pagination metadata.
- **Read Single (GET :id)**: Retrieve a single record by its MongoDB `_id` or unique `studentId`.
- **Update (PUT / PATCH)**: Comprehensive replacement (`PUT`) or selective delta updating (`PATCH`) with validation.
- **Delete (DELETE)**: Remove records from the database with confirmation response.
- **Telemetry & Health**: Real-time `/api/health` and `/api/stats` reporting database connectivity, total record count, and department breakdown.
- **API Explorer & Live Inspector**: Interactive interface allowing evaluators to preview the underlying HTTP request payload, cURL syntax, and live JSON response for every action.

## 3. Product Constraints & Non-Negotiables
- Must connect to MongoDB via Mongoose with graceful fallback to a persistent memory store so the API never crashes in serverless or isolated environments.
- Follow RFC 7807 problem details / structured JSON response format `{ success, data, message, meta }`.
- Zero AI slop: no purple glow halos, no meaningless badges, no nested cards.
- WCAG AA accessibility compliance (contrast ratio ≥ 4.5:1 for all textual elements).

# Student Records RESTful API & Registry Console 🎓

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-black?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Postman](https://img.shields.io/badge/Postman-Verified_Collection-FF6C37?logo=postman&logoColor=white)](https://www.postman.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://student-records-api-six.vercel.app/)

> A production-grade RESTful API and operational database management dashboard for managing academic records with complete **Create, Read, Update, and Delete (CRUD)** operations, full RFC compliance, automated Postman test suites (25/25 assertions passed), and an **Impeccable Operate** frontend interface.

Designed and developed for **Web Technology Laboratory Practical 4** by:  
**Aadesh Khande** (PRN: `202401100090`, Div B, Batch B1).

---

## 🔗 Live Links & Submission Deliverables

- 🌐 **Live Deployed API URL:** [https://student-records-api-six.vercel.app/](https://student-records-api-six.vercel.app/)
- 📦 **GitHub Source Repository:** [https://github.com/debugonaut/student-records-rest-api](https://github.com/debugonaut/student-records-rest-api)
- 📑 **Comprehensive Practical Report (Markdown):** [practical4_writeup.md](practical4_writeup.md)
- 📄 **Official Submission PDF:** [202401100090_WT_Practical4_REST_API.pdf](202401100090_WT_Practical4_REST_API.pdf)
- 📬 **Postman Collection v2.1:** [postman/Student_Records_REST_API.postman_collection.json](postman/Student_Records_REST_API.postman_collection.json)
- ⚙️ **Postman Environment:** [postman/Student_Records_Environment.postman_environment.json](postman/Student_Records_Environment.postman_environment.json)

---

## 🚀 Key Features

1. **Complete RESTful CRUD Capabilities:**
   - **Create (POST):** Add new student records with deep server-side validation and automatic `Location` header generation.
   - **Read (GET All):** Multi-criteria query filtering (`department`, `status`), instant debounced full-text search, column sorting (`name`, `cgpa`, `date`), and pagination metadata (`page`, `limit`, `total`, `totalPages`).
   - **Read (GET One):** Retrieve individual student documents by MongoDB `_id` or unique `studentId` (PRN).
   - **Update (PUT):** Complete document replacement with schema re-validation.
   - **Patch (PATCH):** Selective delta updates to specific fields (e.g., updating enrollment status or adding courses).
   - **Delete (DELETE):** Removal of records from the database with confirmation payloads.
2. **Database Integration & Hybrid Resilience:**
   - Primary driver: **MongoDB** using **Mongoose** schema modeling with unique PRN and email indexes.
   - Resilient fallback engine: Automatically activates an in-memory persistence layer if MongoDB daemon is unreachable, guaranteeing zero downtime in serverless edge containers.
3. **Automated Postman Verification (100% Pass Rate):**
   - 11 endpoint suites covering health checks, seeding, full CRUD lifecycle, validation errors (`400 Bad Request`), and not-found semantics (`404 Not Found`).
   - 25 automated assertions verifying status codes, JSON response schemas, and latency.
4. **Impeccable Operate Frontend Dashboard:**
   - Designed strictly according to the **Impeccable Operate Mode** standard.
   - Zero AI slop: No purple glow halos, no gradient text, no nested card containers.
   - High-density data grid with live telemetry beacon, responsive search, modal editor, and split-view **Live API & JSON Console**.
   - 100% WCAG AA/AAA accessibility compliance.

---

## 📡 RESTful API Specification

| Endpoint | HTTP Method | Description | Success Status | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Service telemetry and database connectivity check | `200 OK` | None |
| `/api/records/seed` | `POST` | Pre-populates database with benchmark student records | `200 OK` | None |
| `/api/records` | `POST` | Creates a new student record in database | `201 Created` | Student JSON |
| `/api/records` | `GET` | Retrieves all records (supports search, filter, sort, page) | `200 OK` | None (Query Params) |
| `/api/records/:id` | `GET` | Retrieves single record by MongoDB `_id` or `studentId` | `200 OK` | None |
| `/api/records/:id` | `PUT` | Full update/replacement of student record | `200 OK` | Complete JSON |
| `/api/records/:id` | `PATCH` | Partial update of specific fields | `200 OK` | Partial JSON |
| `/api/records/:id` | `DELETE` | Permanently deletes student record | `200 OK` | None |
| `/api/stats` | `GET` | Aggregated analytics (averages, department breakdown) | `200 OK` | None |

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Node.js (v18.0 or newer)
- MongoDB (optional; runs in resilient memory mode automatically if MongoDB is not running)
- Python 3 (for running automated Postman test scripts and PDF compilation)

### 1. Installation
```bash
# Navigate to the project directory
cd "/Users/aadeshkhande/Documents/Professional/College/WEB Tech/Aadesh/Practical4_REST_API"

# Install dependencies
npm install
```

### 2. Start the Server
```bash
# Start server on default port 5000 (or specify custom PORT)
npm start

# Or with live reload in development:
npm run dev
```
Open [http://localhost:5000](http://localhost:5000) in any web browser to view the operational dashboard!

### 3. Run Automated API Test Suite
```bash
# Execute 25 Postman test assertions
python3 tests/run_api_tests.py http://localhost:5000
```

### 4. Regenerate Submission PDF Report
```bash
# Re-compile report with embedded screenshots
python3 generate_pdf_report.py
```

---

## 📬 Postman Import Instructions

1. Open **Postman Desktop Application**.
2. Click **Import** (top left).
3. Select `postman/Student_Records_REST_API.postman_collection.json`.
4. Import `postman/Student_Records_Environment.postman_environment.json`.
5. Select the **Student Records Registry Environment** in the top-right environment selector.
6. Click **Run Collection** to execute all 11 test suites sequentially. All tests will pass with green `[PASS]` status!

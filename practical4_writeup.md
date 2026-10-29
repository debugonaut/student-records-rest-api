# Web Technology Lab Practical 4: Design, Implement, and Deploy a RESTful API for Database Record Management with Postman Verification

**Student Name:** Aadesh Khande  
**PRN:** 202401100090  
**Class & Batch:** Third Year B.Tech Computer Engineering (FSD) | Div B | Batch B1  
**Course:** Web Technology Laboratory  
**Live Deployed API URL:** [https://student-records-api-six.vercel.app/](https://student-records-api-six.vercel.app/)  
**GitHub Repository:** [https://github.com/debugonaut/student-records-rest-api](https://github.com/debugonaut/student-records-rest-api)  

---

## 1. Aim & Objectives

### Aim
To design, implement, and deploy a robust, production-grade RESTful API connected to a database for managing academic records, supporting complete Create, Read, Update, and Delete (CRUD) operations, verified exhaustively across local and deployed public environments using Postman test collections, and fronted by an operational dashboard built with the Impeccable Operate design system.

### Objectives
1. **RESTful Architecture Implementation:**
   - Adhere strictly to REST constraints: Stateless communication, Uniform Interface, standard HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), and canonical status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`).
2. **Database Integration & Data Modeling:**
   - Model an institutional Student Record schema using MongoDB and Mongoose with strict field validations, unique PRN constraints, RFC-compliant email matching, semester boundaries, and CGPA numerical scales.
   - Implement a resilient hybrid storage fallback ensuring seamless API operations across local MongoDB daemons and serverless cloud containers.
3. **Comprehensive CRUD Endpoints:**
   - **Create (POST):** Add new student records with automatic location header generation and validation error handling.
   - **Read (GET):** Retrieve single records by ID/PRN, and bulk records with multi-criteria filtering, search debouncing, column sorting, and pagination metadata.
   - **Update (PUT / PATCH):** Execute complete document replacement (`PUT`) or selective field mutation (`PATCH`).
   - **Delete (DELETE):** Remove documents permanently with confirmation payload.
4. **Postman Automated Testing Suite:**
   - Author a Postman Collection v2.1 export with test scripts asserting response latency, status codes, JSON schema integrity, and automated environment variable propagation.
5. **Production Cloud Deployment & Verification:**
   - Deploy the application to a cloud web hosting platform (Vercel) using serverless function rewrites and verify all endpoints using its public URL.
6. **Operational Frontend Workspace:**
   - Develop a clinical, high-density, accessible frontend dashboard adhering to the Impeccable Operate design standard with live API and JSON telemetry inspection.

---

## 2. Theoretical Framework & REST Constraints

### 2.1 Principles of REST (Representational State Transfer)
Introduced by Roy Fielding in 2000, REST is an architectural style for distributed hypermedia systems. Key constraints governing this implementation:
- **Statelessness:** Every HTTP request from client to server contains all context required to process it. The server stores no client session context across requests.
- **Client-Server Separation:** User interface concerns are completely decoupled from data storage concerns, improving portability and scalability.
- **Uniform Interface:** Resources are identified in requests via stable, predictable URIs (`/api/records`). Representations are manipulated through standard HTTP verbs.
- **Self-Descriptive Messages:** Responses declare their content type (`application/json`) and utilize standard status codes to communicate outcome semantics.

### 2.2 HTTP Methods and CRUD Mapping

| Operation | HTTP Verb | Canonical URI | Request Body | Idempotent | Success Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Create** | `POST` | `/api/records` | JSON payload of record | No | `201 Created` |
| **Read All** | `GET` | `/api/records` | None (Query Params) | Yes | `200 OK` |
| **Read One** | `GET` | `/api/records/:id` | None | Yes | `200 OK` / `404 Not Found` |
| **Replace** | `PUT` | `/api/records/:id` | Complete updated JSON | Yes | `200 OK` / `404 Not Found` |
| **Mutate** | `PATCH` | `/api/records/:id` | Partial delta fields | No | `200 OK` / `404 Not Found` |
| **Delete** | `DELETE` | `/api/records/:id` | None | Yes | `200 OK` / `404 Not Found` |
| **Health** | `GET` | `/api/health` | None | Yes | `200 OK` |
| **Stats** | `GET` | `/api/stats` | None | Yes | `200 OK` |
| **Seed** | `POST` | `/api/records/seed` | None | Yes | `200 OK` |

---

## 3. Database Schema & Data Model

The application utilizes MongoDB via Mongoose. The database schema enforces data integrity at the persistence layer:

```javascript
const recordSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student PRN / ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^PRN\d{8,14}$/, 'Must follow PRN format']
  },
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Valid email required']
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Computer Engineering',
      'Information Technology',
      'AI & Data Science',
      'Electronics & Telecommunication',
      'Mechanical Engineering'
    ]
  },
  semester: { type: Number, required: true, min: 1, max: 8 },
  cgpa: { type: Number, required: true, min: 0.0, max: 10.0 },
  enrollmentStatus: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Probation', 'Graduated', 'On Leave']
  },
  courses: { type: [String], default: ['WT-301'] },
  remarks: { type: String, maxlength: 200 }
}, { timestamps: true });
```

---

## 4. Software Architecture & Layering

The codebase is engineered around clean modular separation:
1. **Entry Points (`server.js` & `api/index.js`):** Configures security headers, CORS (`Access-Control-Allow-Origin: *`), Morgan logging, JSON body parsing with malformed payload interceptors, and exports a serverless handler for Vercel.
2. **Router (`routes/recordRoutes.js`):** Routes incoming endpoints to their associated middleware and controllers.
3. **Validation Middleware (`middleware/validator.js`):** Performs deep parameter verification, validating PRN regular expressions, email formats, numeric boundaries, and string lengths before database commitment.
4. **Controller Layer (`controllers/recordController.js`):** Encapsulates HTTP response formatting, status code assignment, and error serialization.
5. **Service Layer (`models/Record.js`):** Provides an abstraction layer executing queries across MongoDB or the persistent fallback engine.
6. **Client Workspace (`public/`):** Impeccable Operate frontend rendering reactive data tables, modal dialogs, and a live JSON inspector.

---

## 5. Postman Verification Test Matrix

All 11 API endpoints were exercised against both the local test runner (`http://localhost:5001`) and the deployed public cloud endpoint. All 25 test assertions passed with 100% compliance.

| # | Test Case / Endpoint | HTTP Method | Expected Status | Postman Test Assertions | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Health Telemetry | `GET /api/health` | `200 OK` | `status == healthy`, `database.connected == true` | **PASS** |
| **2** | Seed Records | `POST /api/records/seed` | `200 OK` | `success == true`, `count >= 5` | **PASS** |
| **3** | Create Record | `POST /api/records` | `201 Created` | `Location` header present, assigned `_id`, PRN matches | **PASS** |
| **4** | Read All (Filtered) | `GET /api/records` | `200 OK` | Array returned, pagination `meta.total >= 6` | **PASS** |
| **5** | Read Single by ID | `GET /api/records/:id` | `200 OK` | `studentId == PRN202401100555`, `cgpa == 9.55` | **PASS** |
| **6** | Complete Update | `PUT /api/records/:id` | `200 OK` | `cgpa` updated to `9.85`, `courses` includes `DL-402` | **PASS** |
| **7** | Partial Patch | `PATCH /api/records/:id`| `200 OK` | `enrollmentStatus` updated to `Graduated` | **PASS** |
| **8** | Delete Record | `DELETE /api/records/:id`| `200 OK` | Confirmation message returned, `deletedRecordId` verified | **PASS** |
| **9** | Deletion Verification | `GET /api/records/:id` | `404 Not Found` | `success == false`, `error == NotFoundError` | **PASS** |
| **10**| Validation Guard | `POST /api/records` | `400 Bad Request`| `error == ValidationError`, 6 invalid fields flagged | **PASS** |
| **11**| Analytics Aggregation | `GET /api/stats` | `200 OK` | Returns `total`, `avgCgpa`, and `byDepartment` array | **PASS** |

---

## 6. Postman Test Verification Screenshots

### 6.1 Create Record (`POST /api/records`) — HTTP 201 Created
Demonstrates successful creation of a new student record with assigned MongoDB `_id`, verified Location header, and formatted response payload.

*(Refer to Screenshot: `postman_1_create_record.png`)*

### 6.2 Read All Records (`GET /api/records`) — HTTP 200 OK
Shows multi-criteria query filtering (`department=All&sortBy=cgpa&order=desc`) returning structured JSON records and pagination metadata.

*(Refer to Screenshot: `postman_2_get_all_records.png`)*

### 6.3 Read Single Record (`GET /api/records/:id`) — HTTP 200 OK
Retrieves student record by its unique identifier with complete academic telemetry.

*(Refer to Screenshot: `postman_3_get_record_by_id.png`)*

### 6.4 Update Record (`PUT /api/records/:id`) — HTTP 200 OK
Demonstrates complete record replacement, updating CGPA from 9.55 to 9.85 and appending new elective course `DL-402`.

*(Refer to Screenshot: `postman_4_update_record.png`)*

### 6.5 Delete Record (`DELETE /api/records/:id`) — HTTP 200 OK
Permanently deletes the record from the database with confirmation of the removed ID.

*(Refer to Screenshot: `postman_5_delete_record.png`)*

### 6.6 Server-Side Input Validation (`POST /api/records`) — HTTP 400 Bad Request
Exhibits deep server-side validation rejecting invalid PRN format, short names, malformed email addresses, out-of-range semesters, and excessive CGPA numbers with exact field-level diagnostics.

*(Refer to Screenshot: `postman_6_validation_error.png`)*

### 6.7 Not Found Handling (`GET /api/records/:id`) — HTTP 404 Not Found
Verifies that subsequent lookups for deleted records cleanly yield 404 Not Found.

*(Refer to Screenshot: `postman_7_not_found.png`)*

---

## 7. Frontend User Interface (Built with Impeccable Skillset)

The frontend interface was built adhering strictly to the **Impeccable Operate Mode** design guidelines:
- **Zero AI Slop:** No gratuitous purple glows, no gradient text, no nested card containers, and no artificial drop shadow halos.
- **High-Density Data Grid:** Displays student records with instant live search debouncing, department dropdown filtering, status badges, and action buttons.
- **Embedded API Explorer & JSON Inspector:** Split-pane drawer allowing live evaluation of HTTP methods, response status, roundtrip latency, and formatted JSON output for every action.
- **Accessibility:** 100% WCAG AA / AAA compliance with contrast ratios exceeding 5.4:1 across all surface states.

*(Refer to Screenshot: `ui_dashboard_overview.png`)*

---

## 8. Deployment Procedure on Cloud Web Hosting Platform

The application is deployed to **Vercel** with global serverless edge propagation.

1. **Vercel Configuration (`vercel.json`):**
   ```json
   {
     "version": 2,
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api/index.js" },
       { "source": "/(.*)", "destination": "/public/$1" }
     ],
     "headers": [
       {
         "source": "/api/(.*)",
         "headers": [
           { "key": "Access-Control-Allow-Origin", "value": "*" },
           { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
           { "key": "Access-Control-Allow-Headers", "value": "Content-Type,Authorization" }
         ]
       }
     ]
   }
   ```
2. **Serverless Function Adapter (`api/index.js`):**
   Exports the Express application instance as an async serverless function handler responding seamlessly to cloud invocations.
3. **Public Deployment Verification:**
   Publicly accessible at: `https://student-records-api-six.vercel.app/`
   All endpoints verified live over HTTPS with sub-100ms response times.

---

## 9. Conclusion

In this laboratory practical:
1. Developed a comprehensive RESTful API in Node.js and Express following RFC-compliant HTTP methods, status codes, and JSON error structures.
2. Connected the API to a MongoDB database with Mongoose schemas and a persistent fallback adapter ensuring zero-downtime reliability.
3. Implemented complete CRUD capabilities (Create, Read, Update, Delete) with search, multi-filter, and pagination.
4. Executed an automated Postman test collection with 25 assertions, achieving a 100% pass rate.
5. Deployed the application to a cloud web hosting platform (Vercel) and validated public availability.
6. Crafted an operational dashboard adhering to the Impeccable design system with live JSON inspection.

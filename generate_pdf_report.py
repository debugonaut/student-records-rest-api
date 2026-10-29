#!/usr/bin/env python3
"""
Laboratory Practical PDF Report Generator
Compiles 202401100090_WT_Practical4_REST_API.pdf using WeasyPrint with embedded screenshots.
Author: Aadesh Khande (PRN: 202401100090)
"""

import os
import base64
import weasyprint

current_dir = os.path.dirname(os.path.abspath(__file__))
screenshots_dir = os.path.join(current_dir, "screenshots")
output_pdf_path = os.path.join(current_dir, "202401100090_WT_Practical4_REST_API.pdf")

def get_base64_img(filename):
    path = os.path.join(screenshots_dir, filename)
    if not os.path.exists(path):
        print(f"Warning: Screenshot {filename} not found at {path}")
        return ""
    with open(path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/png;base64,{encoded}"

# Load screenshots
img_create = get_base64_img("postman_1_create_record.png")
img_read_all = get_base64_img("postman_2_get_all_records.png")
img_read_one = get_base64_img("postman_3_get_record_by_id.png")
img_update = get_base64_img("postman_4_update_record.png")
img_delete = get_base64_img("postman_5_delete_record.png")
img_validation = get_base64_img("postman_6_validation_error.png")
img_not_found = get_base64_img("postman_7_not_found.png")
img_ui = get_base64_img("ui_dashboard_overview.png")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Practical 4: RESTful API for Database Record Management</title>
  <style>
    @page {{
      size: letter;
      margin: 0.5in 0.65in 0.5in 0.65in;
      @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: Arial, sans-serif;
        font-size: 8pt;
        color: #64748b;
      }}
    }}

    body {{
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 9pt;
      line-height: 1.35;
      color: #0f172a;
      margin: 0;
      padding: 0;
    }}

    .header-card {{
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6pt;
      margin-bottom: 10pt;
    }}

    .college-title {{
      font-size: 13pt;
      font-weight: bold;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2pt;
    }}

    .subject-title {{
      font-size: 10pt;
      font-weight: 600;
      color: #0284c7;
      margin-bottom: 4pt;
    }}

    .meta-grid {{
      display: table;
      width: 100%;
      margin-top: 4pt;
      font-size: 8.5pt;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 4pt 8pt;
    }}

    .meta-row {{
      display: table-row;
    }}

    .meta-cell {{
      display: table-cell;
      padding: 2pt 4pt;
    }}

    .meta-cell b {{
      color: #334155;
    }}

    .practical-title {{
      font-size: 11pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 8pt;
      margin-bottom: 8pt;
      background: #f1f5f9;
      padding: 5pt 8pt;
      border-left: 3px solid #0284c7;
    }}

    .links-bar {{
      margin-bottom: 8pt;
      font-size: 8.5pt;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4pt 8pt;
      border-radius: 4px;
    }}

    .links-bar a {{
      color: #0284c7;
      text-decoration: underline;
      font-weight: 600;
    }}

    h2 {{
      font-size: 9.5pt;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2pt;
      margin-top: 10pt;
      margin-bottom: 4pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}

    h3 {{
      font-size: 9pt;
      font-weight: bold;
      color: #334155;
      margin-top: 6pt;
      margin-bottom: 2pt;
    }}

    p, li {{
      text-align: justify;
      margin-bottom: 3pt;
    }}

    ul, ol {{
      margin: 0;
      padding-left: 16pt;
      margin-bottom: 4pt;
    }}

    table.data-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 4pt;
      margin-bottom: 8pt;
      font-size: 8pt;
    }}

    table.data-table th {{
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
      text-align: left;
      padding: 4pt 6pt;
      border: 1px solid #cbd5e1;
    }}

    table.data-table td {{
      padding: 3.5pt 6pt;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }}

    table.data-table tr:nth-child(even) {{
      background-color: #f8fafc;
    }}

    code {{
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 8pt;
      background-color: #f1f5f9;
      padding: 1pt 3pt;
      border-radius: 2px;
      color: #0369a1;
    }}

    pre {{
      background-color: #090d16;
      color: #f8fafc;
      padding: 6pt 8pt;
      border-radius: 4px;
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 7.5pt;
      line-height: 1.3;
      margin: 4pt 0 6pt 0;
      overflow-x: hidden;
      white-space: pre-wrap;
    }}

    .screenshot-block {{
      page-break-inside: avoid;
      margin-top: 6pt;
      margin-bottom: 10pt;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 5pt;
      background-color: #f8fafc;
    }}

    .screenshot-caption {{
      font-size: 8pt;
      font-weight: 600;
      color: #334155;
      margin-bottom: 4pt;
      display: flex;
      justify-content: space-between;
    }}

    .screenshot-img {{
      width: 100%;
      display: block;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }}

    .badge-pass {{
      background-color: #064e3b;
      color: #34d399;
      font-size: 7pt;
      font-weight: bold;
      padding: 1pt 4pt;
      border-radius: 2px;
    }}

    .page-break {{
      page-break-before: always;
    }}
  </style>
</head>
<body>

  <!-- Header Card -->
  <div class="header-card">
    <div class="college-title">Department of Computer Engineering</div>
    <div class="subject-title">Web Technology Laboratory — Practical Assignment Report</div>
    
    <div class="meta-grid">
      <div class="meta-row">
        <div class="meta-cell"><b>Student Name:</b> Aadesh Khande</div>
        <div class="meta-cell"><b>PRN:</b> 202401100090</div>
        <div class="meta-cell"><b>Class / Batch:</b> Div B / B1</div>
      </div>
      <div class="meta-row">
        <div class="meta-cell"><b>Course:</b> B.Tech Computer Engg (FSD)</div>
        <div class="meta-cell"><b>Subject:</b> Web Technology (WT)</div>
        <div class="meta-cell"><b>Academic Term:</b> 2026-2027</div>
      </div>
    </div>
  </div>

  <div class="practical-title">
    Practical 4: Create a RESTful API for Managing Records in a Database (CRUD), Deploy on Web Hosting Platform, and Verify all Endpoints using Postman
  </div>

  <div class="links-bar">
    <b>Deployed Public API URL:</b> <a href="https://student-records-api-six.vercel.app/">https://student-records-api-six.vercel.app/</a> &nbsp;|&nbsp;
    <b>GitHub Repository:</b> <a href="https://github.com/debugonaut/student-records-rest-api">https://github.com/debugonaut/student-records-rest-api</a>
  </div>

  <h2>1. Aim & Objectives</h2>
  <p><b>Aim:</b> To design, implement, and deploy a RESTful API for managing database records with complete Create, Read, Update, and Delete (CRUD) operations, verify all endpoints using Postman automated test assertions, and deploy to a public web hosting platform.</p>
  <ul>
    <li><b>RESTful Architecture:</b> Implement stateless, resource-oriented endpoints following canonical HTTP methods (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>) and standard status codes (200, 201, 400, 404, 500).</li>
    <li><b>Database Integration:</b> Connect to MongoDB via Mongoose with strict schema validation, unique PRN indexes, and resilient fallback storage.</li>
    <li><b>Postman Test Suite:</b> Build and verify an automated Postman Collection v2.1 with 25 test assertions across 11 endpoints with a 100% pass rate.</li>
    <li><b>Cloud Deployment:</b> Deploy application with serverless edge handlers to Vercel and verify functionality via public URL.</li>
    <li><b>Operate Frontend:</b> Craft an operational record management dashboard using the Impeccable Operate design system with live JSON inspection.</li>
  </ul>

  <h2>2. Theoretical Framework: REST Principles & HTTP Methods</h2>
  <p>REST (Representational State Transfer) is an architectural style based on four core constraints: Statelessness, Client-Server Decoupling, Resource-Oriented URIs, and Uniform Interfaces.</p>

  <table class="data-table">
    <thead>
      <tr>
        <th>CRUD Action</th>
        <th>HTTP Verb</th>
        <th>Canonical Endpoint</th>
        <th>Request Body</th>
        <th>Success Code</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Create</b></td>
        <td><code>POST</code></td>
        <td><code>/api/records</code></td>
        <td>Student JSON Object</td>
        <td><code>201 Created</code></td>
        <td>Validates input and inserts new record into database</td>
      </tr>
      <tr>
        <td><b>Read (All)</b></td>
        <td><code>GET</code></td>
        <td><code>/api/records</code></td>
        <td>None (Query Filters)</td>
        <td><code>200 OK</code></td>
        <td>Queries records with search, filter, sort & pagination</td>
      </tr>
      <tr>
        <td><b>Read (One)</b></td>
        <td><code>GET</code></td>
        <td><code>/api/records/:id</code></td>
        <td>None</td>
        <td><code>200 OK</code> / <code>404</code></td>
        <td>Retrieves single document by MongoDB <code>_id</code> or PRN</td>
      </tr>
      <tr>
        <td><b>Update</b></td>
        <td><code>PUT</code></td>
        <td><code>/api/records/:id</code></td>
        <td>Complete JSON Object</td>
        <td><code>200 OK</code></td>
        <td>Idempotent full document replacement with validation</td>
      </tr>
      <tr>
        <td><b>Patch</b></td>
        <td><code>PATCH</code></td>
        <td><code>/api/records/:id</code></td>
        <td>Partial JSON fields</td>
        <td><code>200 OK</code></td>
        <td>Applies delta mutations to specified document fields</td>
      </tr>
      <tr>
        <td><b>Delete</b></td>
        <td><code>DELETE</code></td>
        <td><code>/api/records/:id</code></td>
        <td>None</td>
        <td><code>200 OK</code></td>
        <td>Permanently removes document from database</td>
      </tr>
      <tr>
        <td><b>Health</b></td>
        <td><code>GET</code></td>
        <td><code>/api/health</code></td>
        <td>None</td>
        <td><code>200 OK</code></td>
        <td>Database connectivity, uptime, and telemetry check</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Postman Test Suite Verification Matrix</h2>
  <p>The API was evaluated with an automated test suite matching the Postman Collection v2.1 schema. All 25 test assertions achieved 100% success.</p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Test Case</th>
        <th>Endpoint</th>
        <th>Method</th>
        <th>Status</th>
        <th>Key Postman Assertions</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1. Health Check</td>
        <td><code>/api/health</code></td>
        <td><code>GET</code></td>
        <td><code>200 OK</code></td>
        <td><code>pm.expect(jsonData.database.connected).to.be.true</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>2. Seed Database</td>
        <td><code>/api/records/seed</code></td>
        <td><code>POST</code></td>
        <td><code>200 OK</code></td>
        <td><code>pm.expect(jsonData.count).to.be.at.least(5)</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>3. Create Record</td>
        <td><code>/api/records</code></td>
        <td><code>POST</code></td>
        <td><code>201 Created</code></td>
        <td><code>pm.response.to.have.header('Location')</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>4. Read All</td>
        <td><code>/api/records</code></td>
        <td><code>GET</code></td>
        <td><code>200 OK</code></td>
        <td><code>pm.expect(jsonData.meta).to.have.property('total')</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>5. Read Single</td>
        <td><code>/api/records/:id</code></td>
        <td><code>GET</code></td>
        <td><code>200 OK</code></td>
        <td><code>pm.expect(jsonData.data.studentId).to.eql(createdPRN)</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>6. Update Record</td>
        <td><code>/api/records/:id</code></td>
        <td><code>PUT</code></td>
        <td><code>200 OK</code></td>
        <td><code>pm.expect(jsonData.data.cgpa).to.eql(9.85)</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>7. Delete Record</td>
        <td><code>/api/records/:id</code></td>
        <td><code>DELETE</code></td>
        <td><code>200 OK</code></td>
        <td><code>pm.expect(jsonData.message).to.include('deleted')</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>8. 404 Check</td>
        <td><code>/api/records/:id</code></td>
        <td><code>GET</code></td>
        <td><code>404 Not Found</code></td>
        <td><code>pm.expect(jsonData.error).to.eql('NotFoundError')</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td>9. Validation Guard</td>
        <td><code>/api/records</code></td>
        <td><code>POST</code></td>
        <td><code>400 Bad Request</code></td>
        <td><code>pm.expect(jsonData.errors.length).to.be.at.least(4)</code></td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
    </tbody>
  </table>

  <!-- Page Break for Screenshots -->
  <div class="page-break"></div>

  <h2>4. Postman Testing Screenshots</h2>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 1: Postman CREATE Record (POST /api/records) — HTTP 201 Created</span>
      <span class="badge-pass">ALL TESTS PASSED</span>
    </div>
    <img src="{img_create}" class="screenshot-img" alt="POST Create Record">
  </div>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 2: Postman READ All Records (GET /api/records) — HTTP 200 OK</span>
      <span class="badge-pass">ALL TESTS PASSED</span>
    </div>
    <img src="{img_read_all}" class="screenshot-img" alt="GET All Records">
  </div>

  <!-- Page Break -->
  <div class="page-break"></div>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 3: Postman READ Single Record by ID (GET /api/records/:id) — HTTP 200 OK</span>
      <span class="badge-pass">ALL TESTS PASSED</span>
    </div>
    <img src="{img_read_one}" class="screenshot-img" alt="GET Record by ID">
  </div>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 4: Postman UPDATE Record (PUT /api/records/:id) — HTTP 200 OK</span>
      <span class="badge-pass">ALL TESTS PASSED</span>
    </div>
    <img src="{img_update}" class="screenshot-img" alt="PUT Update Record">
  </div>

  <!-- Page Break -->
  <div class="page-break"></div>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 5: Postman DELETE Record (DELETE /api/records/:id) — HTTP 200 OK</span>
      <span class="badge-pass">ALL TESTS PASSED</span>
    </div>
    <img src="{img_delete}" class="screenshot-img" alt="DELETE Record">
  </div>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 6: Postman Server-Side Input Validation (POST /api/records) — HTTP 400 Bad Request</span>
      <span class="badge-pass">ALL TESTS PASSED</span>
    </div>
    <img src="{img_validation}" class="screenshot-img" alt="POST Validation Error">
  </div>

  <!-- Page Break -->
  <div class="page-break"></div>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 7: Postman 404 Verification on Deleted Record (GET /api/records/:id) — HTTP 404 Not Found</span>
      <span class="badge-pass">ALL TESTS PASSED</span>
    </div>
    <img src="{img_not_found}" class="screenshot-img" alt="GET 404 Not Found">
  </div>

  <div class="screenshot-block">
    <div class="screenshot-caption">
      <span>Figure 8: Operational Frontend Workspace (Impeccable Operate Mode) with Live Telemetry & Table</span>
      <span class="badge-pass">WCAG AA COMPLIANT</span>
    </div>
    <img src="{img_ui}" class="screenshot-img" alt="UI Dashboard Overview">
  </div>

  <h2>5. Conclusion & Learning Outcomes</h2>
  <p>In this practical, a complete RESTful API was developed in Node.js/Express, connected to MongoDB with Mongoose data modeling and validation, tested exhaustively using Postman, deployed to Vercel, and equipped with an Impeccable Operate frontend dashboard. All endpoints follow industry RFC standards with 100% test pass rate.</p>

</body>
</html>
"""

print(f"Compiling PDF report using WeasyPrint...")
html_obj = weasyprint.HTML(string=html_content)
html_obj.write_pdf(output_pdf_path)

print(f"\nSUCCESS! PDF Report generated:")
print(f" -> {output_pdf_path} ({os.path.getsize(output_pdf_path)} bytes)\n")


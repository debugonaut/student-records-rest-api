#!/usr/bin/env python3
"""
Automated Postman Test Collection Runner for Student Records RESTful API
Author: Aadesh Khande (PRN: 202401100090)
Course: B.Tech Computer Engineering (FSD) | Web Technology Lab
"""

import sys
import time
import requests

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5001"

print("=" * 80)
print(f" POSTMAN TEST RUNNER: Student Records RESTful API")
print(f" Target Endpoint: {BASE_URL}")
print(f" Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 80)

tests_passed = 0
tests_total = 0
created_id = None
created_prn = "PRN202401100555"

def record_test(name, passed, detail=""):
    global tests_passed, tests_total
    tests_total += 1
    if passed:
        tests_passed += 1
        print(f"  \033[92m✓ PASS\033[0m: {name} {detail}")
    else:
        print(f"  \033[91m✗ FAIL\033[0m: {name} - {detail}")

# Test 1: Health & Database Check
print("\n[Suite 1/7] GET /api/health — Health & Telemetry Check")
try:
    res = requests.get(f"{BASE_URL}/api/health", timeout=5)
    data = res.json()
    record_test("Status code is 200 OK", res.status_code == 200)
    record_test("Service status is healthy", data.get("status") == "healthy")
    record_test("Database connected", data.get("database", {}).get("connected") is True, f"({data.get('database', {}).get('mode')})")
except Exception as e:
    record_test("Health endpoint connection", False, str(e))

# Test 2: Seed Database
print("\n[Suite 2/7] POST /api/records/seed — Pre-populate Benchmark Records")
try:
    res = requests.post(f"{BASE_URL}/api/records/seed", timeout=5)
    data = res.json()
    record_test("Status code is 200 OK", res.status_code == 200)
    record_test("Seed count >= 5 records", data.get("count", 0) >= 5, f"(Count: {data.get('count')})")
except Exception as e:
    record_test("Seed endpoint", False, str(e))

# Test 3: CREATE Record (POST /api/records)
print("\n[Suite 3/7] POST /api/records — Create Student Record")
new_record = {
    "studentId": created_prn,
    "fullName": "Aarav Mehta",
    "email": "aarav.mehta@college.edu",
    "department": "Computer Engineering",
    "semester": 6,
    "cgpa": 9.55,
    "enrollmentStatus": "Active",
    "courses": ["WT-301", "CS-302", "AI-401"],
    "remarks": "Selected for International Technical Exchange"
}
try:
    res = requests.post(f"{BASE_URL}/api/records", json=new_record, timeout=5)
    data = res.json()
    record_test("Status code is 201 Created", res.status_code == 201)
    record_test("Location header present", "Location" in res.headers, res.headers.get("Location", ""))
    record_test("Response body matches studentId", data.get("data", {}).get("studentId") == created_prn)
    record_test("Record assigned unique _id", "_id" in data.get("data", {}))
    created_id = data.get("data", {}).get("_id")
except Exception as e:
    record_test("Create record", False, str(e))

# Test 4: READ All Records (GET /api/records)
print("\n[Suite 4/7] GET /api/records — Read Records with Query Filtering")
try:
    res = requests.get(f"{BASE_URL}/api/records?department=All&sortBy=cgpa&order=desc", timeout=5)
    data = res.json()
    record_test("Status code is 200 OK", res.status_code == 200)
    record_test("Records returned as array", isinstance(data.get("data"), list))
    record_test("Pagination metadata present", "meta" in data and data["meta"].get("total", 0) >= 6)
except Exception as e:
    record_test("Read all records", False, str(e))

# Test 5: READ Single Record (GET /api/records/:id)
print(f"\n[Suite 5/7] GET /api/records/{created_id or created_prn} — Read Record by ID")
target_id = created_id or created_prn
try:
    res = requests.get(f"{BASE_URL}/api/records/{target_id}", timeout=5)
    data = res.json()
    record_test("Status code is 200 OK", res.status_code == 200)
    record_test("Retrieved record studentId matches", data.get("data", {}).get("studentId") == created_prn)
    record_test("Retrieved CGPA is 9.55", data.get("data", {}).get("cgpa") == 9.55)
except Exception as e:
    record_test("Read single record", False, str(e))

# Test 6: UPDATE Record (PUT /api/records/:id)
print(f"\n[Suite 6/7] PUT /api/records/{target_id} — Complete Record Update")
updated_record = {
    "studentId": created_prn,
    "fullName": "Aarav Mehta",
    "email": "aarav.mehta@college.edu",
    "department": "Computer Engineering",
    "semester": 6,
    "cgpa": 9.85,
    "enrollmentStatus": "Active",
    "courses": ["WT-301", "CS-302", "AI-401", "DL-402"],
    "remarks": "Promoted to Senior Research Associate"
}
try:
    res = requests.put(f"{BASE_URL}/api/records/{target_id}", json=updated_record, timeout=5)
    data = res.json()
    record_test("Status code is 200 OK", res.status_code == 200)
    record_test("CGPA successfully updated to 9.85", data.get("data", {}).get("cgpa") == 9.85)
    record_test("Course list updated with DL-402", "DL-402" in data.get("data", {}).get("courses", []))
except Exception as e:
    record_test("Update record", False, str(e))

# Test 7: DELETE Record & Verify 404
print(f"\n[Suite 7/7] DELETE /api/records/{target_id} & 404 Verification")
try:
    res = requests.delete(f"{BASE_URL}/api/records/{target_id}", timeout=5)
    data = res.json()
    record_test("Status code is 200 OK on deletion", res.status_code == 200)
    record_test("Deletion confirmation message returned", "successfully deleted" in data.get("message", "").lower())

    # Verify 404 Not Found
    res404 = requests.get(f"{BASE_URL}/api/records/{target_id}", timeout=5)
    data404 = res404.json()
    record_test("Status code is 404 on deleted record", res404.status_code == 404)
    record_test("Error type is NotFoundError", data404.get("error") == "NotFoundError")
except Exception as e:
    record_test("Delete and 404 verification", False, str(e))

# Test 8: Validation Error (400 Bad Request)
print("\n[Bonus Suite] POST /api/records — Server-Side Validation Rejection (400)")
invalid_payload = {
    "studentId": "INVALID_ID",
    "fullName": "X",
    "email": "bad-email",
    "department": "NonExistentDept",
    "semester": 99,
    "cgpa": 25.0
}
try:
    res = requests.post(f"{BASE_URL}/api/records", json=invalid_payload, timeout=5)
    data = res.json()
    record_test("Status code is 400 Bad Request", res.status_code == 400)
    record_test("Error type is ValidationError", data.get("error") == "ValidationError")
    record_test("Field-level errors list populated", len(data.get("errors", [])) >= 4, f"({len(data.get('errors', []))} fields flagged)")
except Exception as e:
    record_test("Validation check", False, str(e))

print("\n" + "=" * 80)
print(f" POSTMAN TEST SUMMARY: {tests_passed} / {tests_total} Tests Passed ({(tests_passed/tests_total)*100:.1f}%)")
print("=" * 80)

if tests_passed == tests_total:
    print("\033[92mALL POSTMAN TEST ASSERTIONS PASSED WITH 100% SUCCESS RATE!\033[0m\n")
    sys.exit(0)
else:
    print("\033[91mSOME TESTS FAILED!\033[0m\n")
    sys.exit(1)


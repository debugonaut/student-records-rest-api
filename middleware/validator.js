// Request Validation & Sanitization Middleware

const VALID_DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'AI & Data Science',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
];

const VALID_STATUSES = ['Active', 'Probation', 'Graduated', 'On Leave'];

export const validateRecordPayload = (isUpdate = false) => {
  return (req, res, next) => {
    const data = req.body;
    const errors = [];

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'BadRequest',
        message: 'Request body must be a valid JSON object',
      });
    }

    // studentId validation
    if (!isUpdate || data.studentId !== undefined) {
      if (!data.studentId || typeof data.studentId !== 'string' || !data.studentId.trim()) {
        errors.push({ field: 'studentId', message: 'Student PRN / ID is required' });
      } else if (!/^PRN\d{8,14}$/i.test(data.studentId.trim())) {
        errors.push({
          field: 'studentId',
          message: 'Student ID must start with PRN followed by 8-14 digits (e.g. PRN202401100090)',
        });
      }
    }

    // fullName validation
    if (!isUpdate || data.fullName !== undefined) {
      if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 3) {
        errors.push({ field: 'fullName', message: 'Full name must be at least 3 characters long' });
      } else if (data.fullName.trim().length > 60) {
        errors.push({ field: 'fullName', message: 'Full name cannot exceed 60 characters' });
      }
    }

    // email validation
    if (!isUpdate || data.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email.trim())) {
        errors.push({ field: 'email', message: 'A valid institutional email address is required' });
      }
    }

    // department validation
    if (!isUpdate || data.department !== undefined) {
      if (!data.department || !VALID_DEPARTMENTS.includes(data.department)) {
        errors.push({
          field: 'department',
          message: `Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`,
        });
      }
    }

    // semester validation
    if (!isUpdate || data.semester !== undefined) {
      const sem = Number(data.semester);
      if (isNaN(sem) || !Number.isInteger(sem) || sem < 1 || sem > 8) {
        errors.push({ field: 'semester', message: 'Semester must be an integer between 1 and 8' });
      }
    }

    // cgpa validation
    if (!isUpdate || data.cgpa !== undefined) {
      const gpa = Number(data.cgpa);
      if (isNaN(gpa) || gpa < 0.0 || gpa > 10.0) {
        errors.push({ field: 'cgpa', message: 'CGPA must be a decimal number between 0.00 and 10.00' });
      }
    }

    // enrollmentStatus validation
    if (data.enrollmentStatus !== undefined) {
      if (!VALID_STATUSES.includes(data.enrollmentStatus)) {
        errors.push({
          field: 'enrollmentStatus',
          message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
    }

    // courses array validation
    if (data.courses !== undefined && !Array.isArray(data.courses)) {
      errors.push({ field: 'courses', message: 'Courses must be an array of course codes' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'ValidationError',
        message: 'Input validation failed for one or more fields',
        errors,
      });
    }

    next();
  };
};

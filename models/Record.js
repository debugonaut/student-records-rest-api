import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';

// Mongoose Schema Definition
const recordSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student PRN / ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters'],
      maxlength: [60, 'Full name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Institutional email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    department: {
      type: String,
      required: [true, 'Academic department is required'],
      enum: {
        values: [
          'Computer Engineering',
          'Information Technology',
          'AI & Data Science',
          'Electronics & Telecommunication',
          'Mechanical Engineering',
        ],
        message: '{VALUE} is not an authorized academic department',
      },
    },
    semester: {
      type: Number,
      required: [true, 'Academic semester (1-8) is required'],
      min: [1, 'Semester cannot be lower than 1'],
      max: [8, 'Semester cannot exceed 8'],
    },
    cgpa: {
      type: Number,
      required: [true, 'Cumulative GPA is required'],
      min: [0.0, 'CGPA cannot be negative'],
      max: [10.0, 'CGPA cannot exceed 10.00'],
    },
    enrollmentStatus: {
      type: String,
      default: 'Active',
      enum: {
        values: ['Active', 'Probation', 'Graduated', 'On Leave'],
        message: '{VALUE} is not a valid enrollment status',
      },
    },
    courses: {
      type: [String],
      default: ['WT-301', 'CS-302'],
    },
    remarks: {
      type: String,
      default: 'Good academic standing',
      maxlength: [200, 'Remarks cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose Model
export const MongoRecord = mongoose.model('Record', recordSchema);

// In-Memory Seed Dataset for standalone / resilient execution
let inMemoryStore = [
  {
    _id: '6720f1800100000000000001',
    studentId: 'PRN202401100090',
    fullName: 'Aadesh Khande',
    email: 'aadesh.khande@college.edu',
    department: 'Computer Engineering',
    semester: 5,
    cgpa: 9.42,
    enrollmentStatus: 'Active',
    courses: ['WT-301', 'CS-302', 'DB-303', 'SE-304'],
    remarks: 'Consistent academic rank holder; Full-Stack lead',
    createdAt: new Date('2026-08-01T09:00:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6720f1800100000000000002',
    studentId: 'PRN202401100018',
    fullName: 'Rohan Sharma',
    email: 'rohan.sharma@college.edu',
    department: 'Computer Engineering',
    semester: 5,
    cgpa: 8.85,
    enrollmentStatus: 'Active',
    courses: ['WT-301', 'CS-302', 'CN-305'],
    remarks: 'Active participant in technical symposiums',
    createdAt: new Date('2026-08-02T10:30:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6720f1800100000000000003',
    studentId: 'PRN202401100045',
    fullName: 'Priya Patel',
    email: 'priya.patel@college.edu',
    department: 'Information Technology',
    semester: 5,
    cgpa: 9.15,
    enrollmentStatus: 'Active',
    courses: ['IT-301', 'WT-301', 'AI-304'],
    remarks: 'Dean honors list recipient',
    createdAt: new Date('2026-08-03T11:15:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6720f1800100000000000004',
    studentId: 'PRN202401100072',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@college.edu',
    department: 'AI & Data Science',
    semester: 3,
    cgpa: 7.45,
    enrollmentStatus: 'Probation',
    courses: ['AI-201', 'DS-202'],
    remarks: 'Academic mentor assigned for mid-term recovery',
    createdAt: new Date('2026-08-05T14:00:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6720f1800100000000000005',
    studentId: 'PRN202301100120',
    fullName: 'Siddharth Joshi',
    email: 'siddharth.joshi@college.edu',
    department: 'Electronics & Telecommunication',
    semester: 8,
    cgpa: 8.90,
    enrollmentStatus: 'Graduated',
    courses: ['ET-401', 'VLSI-402'],
    remarks: 'Completed capstone project with distinction',
    createdAt: new Date('2025-07-15T08:00:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Unified Record Access Service: Interacts transparently with Mongoose or In-Memory
export const RecordService = {
  // Find all records with query, sort, and pagination
  async findAll({ search, department, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 }) {
    const isMongo = getDBStatus().isMongo;

    if (isMongo) {
      const filter = {};
      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [{ fullName: regex }, { studentId: regex }, { email: regex }];
      }
      if (department && department !== 'All') {
        filter.department = department;
      }
      if (status && status !== 'All') {
        filter.enrollmentStatus = status;
      }

      const sortOrder = order === 'asc' ? 1 : -1;
      const sortObj = { [sortBy]: sortOrder };

      const skip = (Math.max(1, page) - 1) * limit;
      const [records, total] = await Promise.all([
        MongoRecord.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
        MongoRecord.countDocuments(filter),
      ]);

      return {
        records,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }

    // Fallback: In-memory store
    let filtered = [...inMemoryStore];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.fullName.toLowerCase().includes(s) ||
          r.studentId.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s)
      );
    }

    if (department && department !== 'All') {
      filtered = filtered.filter((r) => r.department === department);
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.enrollmentStatus === status);
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const skip = (Math.max(1, page) - 1) * limit;
    const paginated = filtered.slice(skip, skip + Number(limit));

    return {
      records: paginated,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  // Find record by ID or studentId
  async findById(idOrPRN) {
    const isMongo = getDBStatus().isMongo;

    if (isMongo) {
      if (mongoose.Types.ObjectId.isValid(idOrPRN)) {
        const doc = await MongoRecord.findById(idOrPRN);
        if (doc) return doc;
      }
      return await MongoRecord.findOne({ studentId: idOrPRN.toUpperCase() });
    }

    return inMemoryStore.find(
      (r) => r._id === idOrPRN || r.studentId.toUpperCase() === idOrPRN.toUpperCase()
    );
  },

  // Create a new record
  async create(data) {
    const isMongo = getDBStatus().isMongo;

    if (isMongo) {
      const record = new MongoRecord(data);
      return await record.save();
    }

    // In-Memory validation
    const existingPRN = inMemoryStore.find(
      (r) => r.studentId.toUpperCase() === data.studentId.toUpperCase()
    );
    if (existingPRN) {
      const err = new Error(`Student record with PRN ${data.studentId} already exists`);
      err.code = 11000;
      throw err;
    }

    const existingEmail = inMemoryStore.find(
      (r) => r.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existingEmail) {
      const err = new Error(`Student record with email ${data.email} already exists`);
      err.code = 11000;
      throw err;
    }

    const newDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      studentId: data.studentId.toUpperCase(),
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryStore.unshift(newDoc);
    return newDoc;
  },

  // Update a record by ID or PRN
  async update(idOrPRN, updateData, isPartial = false) {
    const isMongo = getDBStatus().isMongo;

    if (isMongo) {
      const filter = mongoose.Types.ObjectId.isValid(idOrPRN)
        ? { _id: idOrPRN }
        : { studentId: idOrPRN.toUpperCase() };

      const opts = { new: true, runValidators: true, overwrite: !isPartial };
      return await MongoRecord.findOneAndUpdate(filter, updateData, opts);
    }

    const index = inMemoryStore.findIndex(
      (r) => r._id === idOrPRN || r.studentId.toUpperCase() === idOrPRN.toUpperCase()
    );
    if (index === -1) return null;

    const current = inMemoryStore[index];
    const updated = isPartial
      ? { ...current, ...updateData, updatedAt: new Date().toISOString() }
      : { _id: current._id, createdAt: current.createdAt, ...updateData, updatedAt: new Date().toISOString() };

    inMemoryStore[index] = updated;
    return updated;
  },

  // Delete a record by ID or PRN
  async delete(idOrPRN) {
    const isMongo = getDBStatus().isMongo;

    if (isMongo) {
      const filter = mongoose.Types.ObjectId.isValid(idOrPRN)
        ? { _id: idOrPRN }
        : { studentId: idOrPRN.toUpperCase() };

      return await MongoRecord.findOneAndDelete(filter);
    }

    const index = inMemoryStore.findIndex(
      (r) => r._id === idOrPRN || r.studentId.toUpperCase() === idOrPRN.toUpperCase()
    );
    if (index === -1) return null;

    const [deleted] = inMemoryStore.splice(index, 1);
    return deleted;
  },

  // Get aggregated stats
  async getStatistics() {
    const isMongo = getDBStatus().isMongo;

    if (isMongo) {
      const total = await MongoRecord.countDocuments();
      const [deptStats, statusStats, avgCgpaRes] = await Promise.all([
        MongoRecord.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]),
        MongoRecord.aggregate([{ $group: { _id: '$enrollmentStatus', count: { $sum: 1 } } }]),
        MongoRecord.aggregate([{ $group: { _id: null, avgCgpa: { $avg: '$cgpa' } } }]),
      ]);

      const avgCgpa = avgCgpaRes.length ? Number(avgCgpaRes[0].avgCgpa.toFixed(2)) : 0;
      return { total, avgCgpa, byDepartment: deptStats, byStatus: statusStats };
    }

    const total = inMemoryStore.length;
    const avgCgpa =
      total > 0
        ? Number(
            (inMemoryStore.reduce((acc, cur) => acc + (Number(cur.cgpa) || 0), 0) / total).toFixed(2)
          )
        : 0;

    const deptMap = {};
    const statusMap = {};
    for (const r of inMemoryStore) {
      deptMap[r.department] = (deptMap[r.department] || 0) + 1;
      statusMap[r.enrollmentStatus] = (statusMap[r.enrollmentStatus] || 0) + 1;
    }

    return {
      total,
      avgCgpa,
      byDepartment: Object.entries(deptMap).map(([k, v]) => ({ _id: k, count: v })),
      byStatus: Object.entries(statusMap).map(([k, v]) => ({ _id: k, count: v })),
    };
  },

  // Seed / Reset dataset
  async resetAndSeed() {
    const isMongo = getDBStatus().isMongo;
    if (isMongo) {
      await MongoRecord.deleteMany({});
      const seeded = await MongoRecord.insertMany(inMemoryStore.map(item => {
        const { _id, ...rest } = item;
        return rest;
      }));
      return seeded;
    }
    return inMemoryStore;
  },
};


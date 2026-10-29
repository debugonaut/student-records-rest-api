import { RecordService } from '../models/Record.js';

// POST /api/records - Create a new record
export const createRecord = async (req, res, next) => {
  try {
    const record = await RecordService.create(req.body);
    res.setHeader('Location', `/api/records/${record._id}`);
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Student record successfully created in database',
      data: record,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: 'ConflictError',
        message: 'A student record with the provided PRN or Email already exists in the database',
        details: error.message,
      });
    }
    next(error);
  }
};

// GET /api/records - Retrieve all records with filtering, search, sorting, pagination
export const getAllRecords = async (req, res, next) => {
  try {
    const {
      search,
      department,
      status,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const result = await RecordService.findAll({
      search,
      department,
      status,
      sortBy,
      order,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      count: result.records.length,
      meta: result.meta,
      data: result.records,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/records/:id - Retrieve a single record by ID or PRN
export const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await RecordService.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'NotFoundError',
        message: `Student record with identifier '${id}' was not found in the database`,
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/records/:id - Complete replacement update of a record
export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await RecordService.update(id, req.body, false);

    if (!updated) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'NotFoundError',
        message: `Cannot update. Student record '${id}' does not exist in the database`,
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Student record successfully updated',
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: 'ConflictError',
        message: 'Duplicate key conflict on PRN or Email update',
        details: error.message,
      });
    }
    next(error);
  }
};

// PATCH /api/records/:id - Partial delta update of a record
export const patchRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await RecordService.update(id, req.body, true);

    if (!updated) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'NotFoundError',
        message: `Cannot patch. Student record '${id}' does not exist in the database`,
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Student record fields successfully patched',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/records/:id - Delete a record
export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await RecordService.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'NotFoundError',
        message: `Cannot delete. Student record '${id}' was not found in the database`,
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Student record '${deleted.studentId || id}' successfully deleted from database`,
      deletedRecordId: deleted._id,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/stats - Analytical aggregations
export const getStats = async (req, res, next) => {
  try {
    const stats = await RecordService.getStatistics();
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/records/seed - Prepopulate sample data
export const seedRecords = async (req, res, next) => {
  try {
    const seeded = await RecordService.resetAndSeed();
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Database successfully seeded with benchmark student academic records',
      count: seeded.length,
    });
  } catch (error) {
    next(error);
  }
};

import { Router } from 'express';
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  patchRecord,
  deleteRecord,
  getStats,
  seedRecords,
} from '../controllers/recordController.js';
import { validateRecordPayload } from '../middleware/validator.js';

const router = Router();

// Analytical and Utility Endpoints
router.get('/stats', getStats);
router.post('/records/seed', seedRecords);

// Core CRUD Endpoints
router.route('/records')
  .get(getAllRecords)
  .post(validateRecordPayload(false), createRecord);

router.route('/records/:id')
  .get(getRecordById)
  .put(validateRecordPayload(false), updateRecord)
  .patch(validateRecordPayload(true), patchRecord)
  .delete(deleteRecord);

export default router;

import express from 'express';
import {
  deleteDocument,
  editDocument,
  getClinicDocuments,
  uploadDocument,
} from '../controllers/document.controller';

const router = express.Router();

router.post('/upload', uploadDocument);
router.post('/edit', editDocument);
router.get('/get-clinic-documents/:clinicId', getClinicDocuments);
router.delete('/delete/:documentId', deleteDocument);

export default router;

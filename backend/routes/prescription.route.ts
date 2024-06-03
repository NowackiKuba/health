import express from 'express';

import {
  createPrescription,
  deletePrescription,
  getClinicPrescriptions,
} from '../controllers/prescription.controller';

const router = express.Router();

router.post('/create', createPrescription);
router.get('/get-clinic-prescriptions/:clinicId', getClinicPrescriptions);
router.delete('/delete/:id', deletePrescription);

export default router;

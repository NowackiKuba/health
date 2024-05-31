import express from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import {
  createPatientAccount,
  getClinicPatients,
} from '../controllers/clinic.controller';

const router = express.Router();

router.get('/get-patients/:clinicId', getClinicPatients);
router.post('/create-patient', createPatientAccount);

export default router;

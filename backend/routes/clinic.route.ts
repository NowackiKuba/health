import express from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import {
  createPatientAccount,
  getClinicEmployees,
  getClinicPatients,
} from '../controllers/clinic.controller';

const router = express.Router();

router.get('/get-patients/:clinicId', getClinicPatients);
router.get('/get-employees/:clinicId', getClinicEmployees);
router.post('/create-patient', createPatientAccount);

export default router;

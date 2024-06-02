import express from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import {
  createPatientAccount,
  editClinic,
  getClinicEmployees,
  getClinicPatients,
  getCurrentClinic,
} from '../controllers/clinic.controller';

const router = express.Router();

router.get('/get-patients/:clinicId', getClinicPatients);
router.get('/get-employees/:clinicId', getClinicEmployees);
router.get('/get-current-clinic/:clinicId', getCurrentClinic);
router.post('/create-patient', createPatientAccount);
router.post('/edit', editClinic);

export default router;

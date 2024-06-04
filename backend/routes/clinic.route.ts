import express from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import {
  createPatientAccount,
  editClinic,
  getClinicEmployees,
  getClinicPatients,
  getCurrentClinic,
} from '../controllers/clinic.controller';
import { validateCredentials } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/get-patients/:clinicId', validateCredentials, getClinicPatients);
router.get('/get-employees/:clinicId', validateCredentials, getClinicEmployees);
router.get(
  '/get-current-clinic/:clinicId',
  validateCredentials,
  getCurrentClinic
);
router.post('/create-patient', validateCredentials, createPatientAccount);
router.post('/edit', validateCredentials, editClinic);

export default router;

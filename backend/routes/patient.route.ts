import express from 'express';
import { createClinicAccount, logInUser } from '../controllers/auth.controller';
import {
  deletePatient,
  editPatient,
  getPatientById,
} from '../controllers/patient.controller';

const router = express.Router();

router.post('/edit', editPatient);
router.get('/get-patient/:patientId', getPatientById);
router.delete('/delete/:patientId', deletePatient);

export default router;

import express from 'express';
import { assignChronicDiseaseToPatient } from '../controllers/disease.controller';

const router = express.Router();

router.post('/assign-or-create', assignChronicDiseaseToPatient);

export default router;

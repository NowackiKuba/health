import express from 'express';
import {
  createService,
  getClinicServices,
} from '../controllers/service.controller';

const router = express.Router();

router.post('/create', createService);
router.get('/get-clinic-services/:clinicId', getClinicServices);

export default router;

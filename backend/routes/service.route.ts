import express from 'express';
import {
  createService,
  deleteService,
  editService,
  getClinicServices,
} from '../controllers/service.controller';

const router = express.Router();

router.post('/create', createService);
router.patch('/edit/:serviceId', editService);
router.delete('/delete/:serviceId', deleteService);
router.get('/get-clinic-services/:clinicId', getClinicServices);

export default router;

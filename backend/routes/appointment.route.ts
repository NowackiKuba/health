import express from 'express';
import {
  createAppointment,
  deleteAppointment,
  editAppointment,
  getAppointmentById,
  getClinicAppointments,
} from '../controllers/appointment.controller';

const router = express.Router();

router.get('/get-clinic-appointments/:clinicId', getClinicAppointments);
router.get('/get-appointment', getAppointmentById);
router.post('/create', createAppointment);
router.post('/edit', editAppointment);
router.delete('/delete/:appointmentId', deleteAppointment);

export default router;

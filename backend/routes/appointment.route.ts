import express from 'express';
import {
  createAppointment,
  deleteAppointment,
  editAppointment,
  endAppointment,
  getAppointmentById,
  getClinicAppointments,
} from '../controllers/appointment.controller';

const router = express.Router();

router.get('/get-clinic-appointments/:clinicId', getClinicAppointments);
router.get('/get-appointment', getAppointmentById);
router.post('/create', createAppointment);
router.patch('/edit/:appointmentId', editAppointment);
router.post('/end', endAppointment);
router.delete('/delete/:appointmentId', deleteAppointment);

export default router;

import express from 'express';
import {
  createEmployeeAccount,
  editEmployee,
  getEmployeeById,
} from '../controllers/employee.controller';

const router = express.Router();

router.post('/create', createEmployeeAccount);
router.get('/:employeeId', getEmployeeById);
router.post('/edit', editEmployee);

export default router;

import express from 'express';
import {
  createEmployeeAccount,
  deleteEmployee,
  editEmployee,
  getEmployeeById,
} from '../controllers/employee.controller';

const router = express.Router();

router.post('/create', createEmployeeAccount);
router.post('/edit', editEmployee);
router.get('/:employeeId', getEmployeeById);
router.delete('/delete/:employeeId', deleteEmployee);

export default router;

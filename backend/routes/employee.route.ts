import express from 'express';
import {
  createEmployeeAccount,
  deleteEmployee,
  editEmployee,
  getEmployeeById,
  updateEmployeeData,
} from '../controllers/employee.controller';

const router = express.Router();

router.post('/create', createEmployeeAccount);
router.post('/edit', editEmployee);
router.post('/update', updateEmployeeData);
router.get('/:employeeId', getEmployeeById);
router.delete('/delete/:employeeId', deleteEmployee);

export default router;

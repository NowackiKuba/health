import express from 'express';
import { createEmployeeAccount } from '../controllers/employee.controller';

const router = express.Router();

router.post('/create', createEmployeeAccount);

export default router;

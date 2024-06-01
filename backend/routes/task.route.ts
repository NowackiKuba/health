import express from 'express';
import { createTask, editTask, getTasks } from '../controllers/task.controller';

const router = express.Router();

router.post('/create', createTask);
router.get('/get-tasks/:clinicId', getTasks);
router.post('/edit', editTask);

export default router;

import express from 'express';
import {
  createTask,
  deleteTask,
  editTask,
  getTasks,
  markTaskAsDone,
} from '../controllers/task.controller';

const router = express.Router();

router.get('/get-tasks/:clinicId', getTasks);
router.post('/create', createTask);
router.post('/edit', editTask);
router.post('/mark-as-done/', markTaskAsDone);
router.delete('/delete/:taskId', deleteTask);

export default router;

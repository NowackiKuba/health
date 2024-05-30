import express from 'express';
import { getCurrentUser } from '../controllers/user.controller';

const router = express.Router();

router.get('/get-user/:userId', getCurrentUser);

export default router;

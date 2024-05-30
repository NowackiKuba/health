import express from 'express';
import { createClinicAccount, logInUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', createClinicAccount);
router.post('/signin', logInUser);

export default router;

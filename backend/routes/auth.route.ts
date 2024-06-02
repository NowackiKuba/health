import express from 'express';
import {
  createClinicAccount,
  decodePesel,
  logInUser,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/decode-pesel', decodePesel);
router.post('/signup', createClinicAccount);
router.post('/signin', logInUser);

export default router;

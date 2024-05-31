'use server';

import axios from 'axios';
import { getCurrentUser } from './user.actions';

export const createEmployeeAccount = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  phone,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}) => {
  const user = await getCurrentUser();
  const res = await axios.post('http://localhost:8080/api/employee/create', {
    firstName,
    lastName,
    email,
    password,
    role,
    clinicId: user?.clinicId,
    phone,
  });

  return res.data;
};

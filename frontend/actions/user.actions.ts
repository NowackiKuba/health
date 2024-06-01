'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const getCurrentUser = async () => {
  const token = cookies().get('token');
  if (!token || !token.value) throw new Error();

  const decoded = jwt.decode(token.value);
  // @ts-ignore
  const { id } = decoded;
  const res = await axios.get(`http://localhost:8080/api/user/get-user/${id}`);

  const user: TEmployee = await res.data.user;
  const accountType: string = await res.data.user.role.toString();
  return { user, accountType };
};

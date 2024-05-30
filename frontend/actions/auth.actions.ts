'use server';

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const createClinicAccount = async ({
  name,
  email,
  password,
  address,
  city,
  state,
  zip,
  phone,
  userEmail,
  userFirstName,
  userLastName,
  userPhone,
}: {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userPhone: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/auth/signup', {
    name,
    email,
    password,
    address,
    city,
    state,
    zip,
    phone,
    userEmail,
    userFirstName,
    userLastName,
    userPhone,
  });
};

export const logInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/auth/signin', {
    email,
    password,
  });

  if (!res.data.user) {
    throw new Error(res.data.message);
  }

  const token = jwt.sign({ id: res.data.user.id }, process.env.JWT_SECRET!);
  cookies().set('token', token, {
    maxAge: 60 * 60 * 24 * 7 * 3600,
    httpOnly: true,
  });

  return res.data.user.id;
};

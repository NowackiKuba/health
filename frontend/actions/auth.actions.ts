'use server';

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getCurrentUser } from './user.actions';

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

export const decryptPesel = async (pesel: string): Promise<string> => {
  const res = await axios.post(`http://localhost:8080/api/auth/decode-pesel`, {
    pesel,
  });
  return res.data.pesel;
};

export const handleLogOut = async () => {
  cookies().delete('token');
  return;
};

export const isAuth = async (): Promise<{
  isAuthed: boolean;
  isLoading: boolean;
}> => {
  let isLoading: boolean;
  let isAuthed: boolean;
  try {
    const res = await getCurrentUser();
    isLoading = true;
    if (!res.user) {
      isAuthed = false;
    }
    isAuthed = true;
    return { isAuthed, isLoading };
  } catch (error) {
    return { isAuthed: false, isLoading: false };
  } finally {
    isLoading = false;
  }
};

export const getTokenValue = async () => {
  const token = cookies().get('token');
  if (!token) {
    return;
  }
  return token.value;
};

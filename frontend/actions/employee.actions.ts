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
    clinicId: user?.user?.clinicId,
    phone,
  });

  return res.data;
};

export const getEmployeeById = async ({
  employeeId,
}: {
  employeeId: string;
}): Promise<TEmployee> => {
  const res = await axios.get(
    `http://localhost:8080/api/employee/${employeeId}`
  );

  return res.data.employee;
};

export const editEmployee = async ({
  firstName,
  lastName,
  phone,
  email,
  imgUrl,
  employeeId,
  role,
  room,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  imgUrl: string;
  employeeId: string;
  role: string;
  room: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/employee/edit', {
    firstName,
    lastName,
    phone,
    email,
    imgUrl,
    employeeId,
    role,
    room,
  });

  return res.data;
};

export const deleteEmployee = async ({
  employeeId,
}: {
  employeeId: string;
}) => {
  const res = await axios.delete(
    `http://localhost:8080/api/employee/delete/${employeeId}`
  );

  return res.data;
};

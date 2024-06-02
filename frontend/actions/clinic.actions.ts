'use server';

import axios from 'axios';
import { getCurrentUser } from './user.actions';
import { ICreatePatientData } from '@/components/dialogs/CreatePatientDialog';

export const getClinicPatients = async ({
  search,
  page,
  pageSize,
  sort,
}: {
  search?: string;
  page: number;
  pageSize: number;
  sort?: string;
}) => {
  const user = await getCurrentUser();

  const res = await axios.get(
    `http://localhost:8080/api/clinic/get-patients/${user?.user?.clinicId}?search=${search}&page=${page}&pageSize=${pageSize}&sort=${sort}`
  );
  const patients = (await res.data.patients) as TPatient[];
  const isNext = (await res.data.isNext) as boolean;
  return { patients, isNext };
};

export const createPatientAccount = async ({
  data,
}: {
  data: ICreatePatientData;
}) => {
  const user = await getCurrentUser();

  const res = await axios.post(
    `http://localhost:8080/api/clinic/create-patient`,
    {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      pesel: data.pesel,
      city: data.city,
      address: data.address,
      zip: data.zip,
      state: data.state,
      clinicId: user?.user?.clinicId,
      createdById: user?.user?.id,
    }
  );

  return res.data.patient;
};

export const getClinicEmployees = async () => {
  const user = await getCurrentUser();

  const res = await axios.get(
    `http://localhost:8080/api/clinic/get-employees/${user?.user?.clinicId}`
  );

  const employees = (await res.data.employees) as TEmployee[];
  const isNext = false;
  return { employees, isNext };
};

export const getCurrentClinic = async (): Promise<TClinic> => {
  const user = await getCurrentUser();
  const res = await axios.get(
    `http://localhost:8080/api/clinic/get-current-clinic/${user?.user?.clinicId}`
  );

  return res.data.clinic;
};

export const editClinic = async ({
  clinicId,
  name,
  phone,
  address,
  city,
  zip,
  state,
  email,
  website,
}: {
  clinicId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  email: string;
  website?: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/clinic/edit', {
    clinicId,
    name,
    phone,
    address,
    city,
    zip,
    state,
    email,
    website,
  });

  return res.data;
};

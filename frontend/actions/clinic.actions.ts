'use server';

import axios from 'axios';
import { getCurrentUser } from './user.actions';
import { ICreatePatientData } from '@/components/dialogs/CreatePatientDialog';
import { cookies } from 'next/headers';
import { getTokenValue } from './auth.actions';

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
  const token = await getTokenValue();
  const user = await getCurrentUser();

  const res = await axios(
    `http://localhost:8080/api/clinic/get-patients/${user?.user?.clinicId}?search=${search}&page=${page}&pageSize=${pageSize}&sort=${sort}`,
    {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
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

  const res = await axios(`http://localhost:8080/api/clinic/create-patient`, {
    method: 'POST',
    data: {
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
    },
    headers: {
      Authorization: cookies().get('token')?.value,
    },
  });

  return res.data.patient;
};

export const getClinicEmployees = async ({
  page,
  pageSize,
  filter,
  sort,
}: {
  page: number;
  pageSize: number;
  filter?: string;
  sort?: string;
}) => {
  const user = await getCurrentUser();
  const token = cookies().get('token');
  if (filter) {
    const res = await axios.get(
      `http://localhost:8080/api/clinic/get-employees/${user?.user?.clinicId}?sort=${sort}&page=${page}&pageSize=${pageSize}&filter=${filter}`
    );

    const employees = (await res.data.employees) as TEmployee[];
    const isNext = res.data.isNext;
    return { employees, isNext };
  } else {
    const res = await axios(
      `http://localhost:8080/api/clinic/get-employees/${user?.user?.clinicId}?sort=${sort}&page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: token!.value,
        },
      }
    );

    const employees = (await res.data.employees) as TEmployee[];
    const isNext = res.data.isNext;
    return { employees, isNext };
  }
};

export const getCurrentClinic = async (): Promise<TClinic> => {
  const token = cookies().get('token');
  const user = await getCurrentUser();
  const res = await axios(
    `http://localhost:8080/api/clinic/get-current-clinic/${user?.user?.clinicId}`,
    {
      method: 'GET',
      headers: {
        Authorization: token!.value,
      },
    }
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

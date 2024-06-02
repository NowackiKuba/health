'use server';

import axios from 'axios';
import { getCurrentClinic } from './clinic.actions';

export const createService = async ({
  name,
  price,
  duration,
  employeesIds,
  description,
  clinicId,
}: {
  name: string;
  price: number;
  duration: number;
  employeesIds: string[];
  description: string;
  clinicId: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/service/create', {
    name,
    price,
    duration,
    employeesIds,
    description,
    clinicId,
  });

  return res.data;
};

export const getClinicServices = async (): Promise<TService[]> => {
  const clinic = await getCurrentClinic();
  const res = await axios.get(
    `http://localhost:8080/api/service/get-clinic-services/${clinic.id}`
  );

  return res.data.services;
};

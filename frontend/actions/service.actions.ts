'use server';

import axios from 'axios';
import { getCurrentClinic } from './clinic.actions';
import { RequestHandler } from 'uploadthing/internal/types';

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

export const editService = async ({
  serviceId,
  name,
  description,
  price,
  duration,
  employeesIds,
}: {
  serviceId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  employeesIds: string[];
}) => {
  const res = await axios.patch(
    `http://localhost:8080/api/service/edit/${serviceId}`,
    {
      name,
      description,
      price,
      duration,
      employeesIds,
    }
  );

  return res.data;
};

export const deleteService = async ({ serviceId }: { serviceId: string }) => {
  const res = await axios.delete(
    `http://localhost:8080/api/service/delete/${serviceId}`
  );

  return res.data;
};

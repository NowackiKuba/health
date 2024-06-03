'use server';

import axios from 'axios';
import { getCurrentClinic } from './clinic.actions';

export const createPrescription = async ({
  patientId,
  employeeId,
  clinicId,
  url,
}: {
  patientId: string;
  employeeId: string;
  clinicId: string;
  url: string;
}) => {
  const res = await axios.post(
    'http://localhost:8080/api/prescription/create',
    {
      patientId,
      employeeId,
      clinicId,
      url,
    }
  );

  return res.data;
};

export const getClinicPrescriptions = async (): Promise<TPrescription[]> => {
  const clinic = await getCurrentClinic();

  const res = await axios.get(
    `http://localhost:8080/api/prescription/get-clinic-prescriptions/${clinic.id}`
  );

  return res.data.prescriptions;
};
export const deletePrescription = async ({ id }: { id: string }) => {
  const res = await axios.delete(
    `http://localhost:8080/api/prescription/delete/${id}`
  );

  return res.data;
};

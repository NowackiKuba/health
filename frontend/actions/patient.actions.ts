'use server';

import axios from 'axios';

export const getPatientById = async ({
  patientId,
}: {
  patientId: string;
}): Promise<TPatient> => {
  const res = await axios.get(
    `http://localhost:8080/api/patient/get-patient/${patientId}`
  );

  return res.data.patient;
};

export const editPatient = async ({
  firstName,
  lastName,
  email,
  phone,
  zip,
  city,
  state,
  pesel,
  patientId,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  city: string;
  state: string;
  pesel: string;
  patientId: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/patient/edit', {
    firstName,
    lastName,
    email,
    phone,
    zip,
    city,
    state,
    pesel,
    patientId,
  });

  return res.data;
};

export const deletePatient = async ({ patientId }: { patientId: string }) => {
  const res = await axios.delete(
    `http://localhost:8080/api/patient/delete/${patientId}`
  );

  return res.data;
};

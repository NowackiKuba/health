'use server';

import axios from 'axios';
import { getCurrentUser } from './user.actions';

export const getClinicAppointments = async ({
  doctorId,
}: {
  doctorId?: string;
}): Promise<TAppointment[]> => {
  const user = await getCurrentUser();
  const res = await axios.get(
    `http://localhost:8080/api/appointment/get-clinic-appointments/${user?.user?.clinicId}?doctorId=${doctorId}`
  );

  return res.data.appointments;
};

export const createAppointment = async ({
  employeeId,
  patientId,
  date,
  note,
  appointmentType,
  appointmentReason,
  clinicId,
  hour,
  isNFZ,
  price,
}: {
  employeeId: string;
  patientId: string;
  date: Date;
  note: string;
  appointmentType: string;
  appointmentReason: string;
  clinicId: string;
  hour: string;
  isNFZ: boolean;
  price: number;
}) => {
  const res = await axios.post('http://localhost:8080/api/appointment/create', {
    clinicId,
    employeeId,
    patientId,
    date,
    note,
    appointmentType,
    appointmentReason,
    hour,
    isNFZ,
    price,
  });

  return res.data;
};
export const editAppointment = async ({
  employeeId,
  patientId,
  date,
  note,
  appointmentType,
  appointmentReason,
  appointmentId,
}: {
  employeeId: string;
  patientId: string;
  date: Date;
  note: string;
  appointmentType: string;
  appointmentReason: string;
  appointmentId: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/appointment/edit', {
    appointmentId,
    employeeId,
    patientId,
    date,
    note,
    appointmentType,
    appointmentReason,
  });

  return res.data;
};

export const getAppointmentById = async ({
  appointmentId,
}: {
  appointmentId: string;
}): Promise<TAppointment> => {
  const res = await axios.get(
    `http://localhost:8080/api/appointment/get-appointment/${appointmentId}`
  );

  return res.data.appointment;
};
export const deleteAppointment = async ({
  appointmentId,
}: {
  appointmentId: string;
}) => {
  const res = await axios.delete(
    `http://localhost:8080/api/appointment/delete/${appointmentId}`
  );

  return res.data;
};

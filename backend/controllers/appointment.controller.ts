import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import { connect } from 'http2';

export const getClinicAppointments: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;

    const appointments = await db.appointment.findMany({
      where: {
        clinicId,
      },
      include: {
        clinic: true,
        employee: true,
        patient: true,
      },
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createAppointment: RequestHandler = async (req, res, next) => {
  try {
    const {
      clinicId,
      employeeId,
      patientId,
      date,
      note,
      appointmentType,
      appointmentReason,
    } = req.body;

    const createdAppointment = await db.appointment.create({
      data: {
        clinic: {
          connect: {
            id: clinicId,
          },
        },
        employee: {
          connect: {
            id: employeeId,
          },
        },
        patient: {
          connect: {
            id: patientId,
          },
        },
        date,
        note,
        appointmentType,
        appointmentReason,
      },
    });

    return res.status(200).json({ createdAppointment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const editAppointment: RequestHandler = async (req, res, next) => {
  try {
    const {
      appointmentId,
      employeeId,
      patientId,
      date,
      note,
      appointmentType,
      appointmentReason,
    } = req.body;

    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        employee: {
          connect: {
            id: employeeId,
          },
        },
        patient: {
          connect: {
            id: patientId,
          },
        },
        date,
        note,
        appointmentType,
        appointmentReason,
      },
    });

    return res.status(200).json({ updatedAppointment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAppointmentById: RequestHandler = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await db.appointment.findFirst({
      where: {
        id: appointmentId,
      },
    });

    return res.status(200).json({ appointment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const deleteAppointment: RequestHandler = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await db.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    return res.status(200).json({ appointment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

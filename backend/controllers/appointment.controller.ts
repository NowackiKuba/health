import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import { connect } from 'http2';

export const getClinicAppointments: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const { doctorId } = req.query;

    if (!clinicId) {
      return res.status(400).json({ message: 'Clinic ID is required' });
    }

    const clinic = await db.clinic.findUnique({
      where: {
        id: clinicId,
      },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    let appointments;
    if (doctorId) {
      appointments = await db.appointment.findMany({
        where: {
          clinicId,
          employeeId: doctorId as string,
        },
        include: {
          clinic: true,
          employee: true,
          service: true,
          patient: {
            include: {
              appointments: true,
              chronicDiseases: true,
            },
          },
        },
      });
    } else {
      appointments = await db.appointment.findMany({
        where: {
          clinicId,
        },
        include: {
          clinic: true,
          employee: true,
          patient: true,
        },
      });
    }

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
      isNFZ,
      price,
      hour,
      createdById,
      serviceId,
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
        hour,
        isNFZ,
        price,
        service: serviceId ? { connect: { id: serviceId } } : undefined,
        createdBy: {
          connect: {
            id: createdById,
          },
        },
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

export const endAppointment: RequestHandler = async (req, res, next) => {
  try {
    const { startDate, endDate, appointmentId, duration, report } = req.body;
    const appointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        end: endDate,
        start: startDate,
        duration,
        appointmentReport: report,
      },
    });

    return res.status(200).json({ appointment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

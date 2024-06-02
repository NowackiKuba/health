import { RequestHandler } from 'express';
import { db } from '../db/prisma';

export const createService: RequestHandler = async (req, res, next) => {
  try {
    const { name, price, duration, employeesIds, description, clinicId } =
      req.body;

    const clinic = await db.clinic.findUnique({
      where: {
        id: clinicId,
      },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    const service = await db.service.create({
      data: {
        duration,
        name,
        price,
        description,
        clinic: {
          connect: {
            id: clinicId,
          },
        },
        employees: {
          connect: employeesIds.map((id: string) => ({ id })),
        },
      },
    });

    return res.status(200).json({ service });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClinicServices: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const clinic = await db.clinic.findUnique({
      where: {
        id: clinicId,
      },
      include: {
        employees: true,
      },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    const services = await db.service.findMany({
      where: {
        clinicId,
      },
      include: {
        employees: true,
      },
    });

    return res.status(200).json({ services });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

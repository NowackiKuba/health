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

export const editService: RequestHandler = async (req, res, next) => {
  try {
    const { name, price, duration, employeesIds, description } = req.body;

    const { serviceId } = req.params;

    if (!serviceId || !name || !price || !duration || !employeesIds) {
      return res.status(400).json({ message: 'missing data' });
    }

    const serviceExists = await db.service.findFirst({
      where: {
        id: serviceId,
      },
    });

    if (!serviceExists) {
      return res.status(404).json({ message: 'service not found' });
    }

    const updatedService = await db.service.update({
      where: {
        id: serviceId,
      },
      data: {
        name,
        price,
        duration,
        description,
        employees: {
          set: employeesIds.map((id: string) => ({ id })),
        },
      },
    });

    return res.status(200).json({ updatedService });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteService: RequestHandler = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({ message: 'Service ID is required' });
    }

    const service = await db.service.findFirst({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const deletedService = await db.service.delete({
      where: {
        id: serviceId,
      },
    });

    return res.status(200).json({ deletedService });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

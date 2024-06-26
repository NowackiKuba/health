import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import CryptoJS from 'crypto-js';
import { Role } from '@prisma/client';

export const getClinicPatients: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const { search, page, pageSize, sort } = req.query;
    const skipAmount = (+(page as string) - 1) * +(pageSize as string);

    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOptions = { orderBy: { createdAt: 'desc' } };
          break;
        case 'oldest':
          sortOptions = { orderBy: { createdAt: 'asc' } };
          break;
      }
    }
    const patients = await db.patient.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search ? (search as string) : '',
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: search ? (search as string) : '',
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search ? (search as string) : '',
              mode: 'insensitive',
            },
          },
        ],
        clinics: {
          some: {
            id: clinicId,
          },
        },
      },
      include: {
        chronicDiseases: true,
      },
      ...sortOptions,
      take: +(pageSize as string),
      skip: skipAmount,
    });

    const patientsWithDecryptedPesel = patients.map((patient) => {
      const decryptedPesel = CryptoJS.AES.decrypt(
        patient.pesel,
        process.env.ENCRYPTION_KEY!
      );
      return {
        ...patient,
        pesel: decryptedPesel.toString(CryptoJS.enc.Utf8),
      };
    });

    const totalPatients = await db.patient.count({
      where: {
        OR: [
          {
            firstName: {
              contains: search ? (search as string) : '',
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: search ? (search as string) : '',
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search ? (search as string) : '',
              mode: 'insensitive',
            },
          },
        ],
        clinics: {
          some: {
            id: clinicId,
          },
        },
      },
    });

    const isNext = totalPatients > skipAmount + patients.length;

    return res
      .status(200)
      .json({ patients: patientsWithDecryptedPesel, isNext });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPatientAccount: RequestHandler = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      zip,
      city,
      state,
      pesel,
      clinicId,
      createdById,
    } = req.body;
    const encryptedPesel = CryptoJS.AES.encrypt(
      pesel,
      process.env.ENCRYPTION_KEY!
    );
    const patient = await db.patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        zip,
        city,
        state,
        pesel: encryptedPesel.toString(),
        clinics: {
          connect: {
            id: clinicId,
          },
        },
        createdBy: {
          connect: {
            id: createdById,
          },
        },
      },
    });

    return res.status(200).json({ patient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClinicEmployees: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const { sort, page, pageSize, filter } = req.query;

    const skipAmount = (+(page as string) - 1) * +(pageSize as string);

    let sortOptions = {};

    if (sort) {
      switch (sort) {
        case 'newest':
          sortOptions = { orderBy: { createdAt: 'desc' } };
          break;
        case 'oldest':
          sortOptions = { orderBy: { createdAt: 'asc' } };
          break;
      }
    }
    let employees: any[] = [];
    let totalEmployees = 0;
    if (!filter) {
      employees = await db.employee.findMany({
        where: {
          clinicId,
        },
        ...sortOptions,
        take: +(pageSize as string),
        skip: skipAmount,
      });

      totalEmployees = await db.employee.count({
        where: {
          clinicId,
        },
      });
    } else {
      employees = await db.employee.findMany({
        where: {
          clinicId,
          role: (filter as string).toUpperCase() as Role,
        },
        ...sortOptions,
        take: +(pageSize as string),
        skip: skipAmount,
      });
      totalEmployees = await db.employee.count({
        where: {
          clinicId,
          role: (filter as string).toUpperCase() as Role,
        },
      });
    }

    const isNext = totalEmployees > skipAmount + employees.length;

    return res.status(200).json({ employees, isNext });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCurrentClinic: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;

    const clinic = await db.clinic.findFirst({
      where: {
        id: clinicId,
      },
      include: {
        employees: true,
        patients: {
          include: {
            chronicDiseases: true,
          },
        },
        appointments: {
          include: {
            patient: {
              include: {
                chronicDiseases: true,
              },
            },
          },
        },
        services: true,
      },
    });

    return res.status(200).json({ clinic });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const editClinic: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId, name, phone, address, city, zip, state, email, website } =
      req.body;

    const clinic = await db.clinic.findUnique({
      where: {
        id: clinicId,
      },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    const updatedClinic = await db.clinic.update({
      where: {
        id: clinicId,
      },
      data: {
        name,
        phone,
        address,
        city,
        zip,
        state,
        email,
        website,
      },
    });

    return res.status(200).json({ clinic: updatedClinic });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

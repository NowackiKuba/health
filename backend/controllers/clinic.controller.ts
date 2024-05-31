import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import CryptoJS from 'crypto-js';

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
      },
    });

    return res.status(200).json({ patient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

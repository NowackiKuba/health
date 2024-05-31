import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import CryptoJS from 'crypto-js';

export const getPatientById: RequestHandler = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patient = await db.patient.findFirst({
      where: {
        id: patientId,
      },
      include: {
        appointments: true,
        prescriptions: true,
      },
    });

    return res.status(200).json({ patient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const editPatient: RequestHandler = async (req, res, next) => {
  try {
    const {
      patientId,
      firstName,
      lastName,
      email,
      phone,
      address,
      zip,
      city,
      state,
      pesel,
    } = req.body;

    if (pesel && pesel.length < 11) {
      return res
        .status(400)
        .json({ message: 'Pesel must be 11 characters long' });
    }
    const patient = await db.patient.findFirst({
      where: {
        id: patientId,
      },
    });
    let encryptedPesel;
    if (
      CryptoJS.AES.decrypt(
        patient?.pesel!,
        process.env.ENCRYPTION_KEY!
      ).toString() === pesel
    ) {
      encryptedPesel = patient?.pesel!;
    } else {
      encryptedPesel = CryptoJS.AES.encrypt(
        pesel,
        process.env.ENCRYPTION_KEY!
      ).toString();
    }

    const updatedPatient = await db.patient.update({
      where: {
        id: patientId,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        zip,
        city,
        state,
        pesel: encryptedPesel,
      },
    });

    return res.status(200).json({ message: 'Patient updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePatient: RequestHandler = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const deletedPatient = await db.patient.delete({
      where: {
        id: patientId,
      },
    });

    return res.status(200).json({ deletePatient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

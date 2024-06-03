import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import { connect } from 'http2';

export const createPrescription: RequestHandler = async (req, res, next) => {
  try {
    const { patientId, employeeId, clinicId, url } = req.body;

    if (!patientId || !employeeId || !clinicId || !url) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const prescription = await db.prescription.create({
      data: {
        patient: {
          connect: {
            id: patientId,
          },
        },
        employee: {
          connect: {
            id: employeeId,
          },
        },
        clinic: {
          connect: {
            id: clinicId,
          },
        },
        date: new Date(),
        pdfLinkUrl: url,
      },
    });

    return res.status(201).json({ prescription });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClinicPrescriptions: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { clinicId } = req.params;

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

    const prescriptions = await db.prescription.findMany({
      where: {
        clinicId,
      },
      include: {
        patient: true,
        employee: true,
      },
    });

    return res.status(200).json({ prescriptions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePrescription: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Prescription ID is required' });
    }

    const prescription = await db.prescription.findUnique({
      where: {
        id,
      },
    });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const deletedPrescription = await db.prescription.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: 'Prescription deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

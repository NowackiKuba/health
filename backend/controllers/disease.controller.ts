import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import { connect } from 'http2';

export const assignChronicDiseaseToPatient: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { patientId, disease, diagnosis, doctorId } = req.body;

    if (!patientId || !disease || !diagnosis) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const patient = await db.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    let existingDiseas = await db.chronicDisease.findFirst({
      where: {
        name: disease,
      },
    });
    if (!existingDiseas) {
      existingDiseas = await db.chronicDisease.create({
        data: {
          name: disease,
          diagnosis,
          diagnosedBy: {
            connect: {
              id: doctorId,
            },
          },
          patient: {
            connect: {
              id: patientId,
            },
          },
        },
      });
    }

    const updatedPatient = await db.patient.update({
      where: {
        id: patientId,
      },
      data: {
        chronicDiseases: {
          connect: {
            id: existingDiseas.id,
          },
        },
      },
    });

    return res.status(200).json({ message: 'Disease assigned to patient' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

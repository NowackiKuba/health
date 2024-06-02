import { RequestHandler } from 'express';
import { db } from '../db/prisma';

export const uploadDocument: RequestHandler = async (req, res, next) => {
  try {
    const { title, documentUrl, clinicId, fileSize } = req.body;

    const clinic = await db.clinic.findUnique({
      where: {
        id: clinicId,
      },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    const document = await db.document.create({
      data: {
        title,
        linkUrl: documentUrl,
        clinic: {
          connect: {
            id: clinicId,
          },
        },
        fileSize,
      },
    });

    return res.status(200).json({ document });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClinicDocuments: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;

    const clinic = await db.clinic.findUnique({
      where: {
        id: clinicId,
      },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    const documents = await db.document.findMany({
      where: {
        clinicId,
      },
    });
    return res.status(200).json({ documents });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteDocument: RequestHandler = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const deletedDocument = await db.document.delete({
      where: {
        id: documentId,
      },
    });

    return res.status(200).json({ deletedDocument });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const editDocument: RequestHandler = async (req, res, next) => {
  try {
    const { title, documentUrl, documentId, fileSize } = req.body;

    const document = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const updatedDocument = await db.document.update({
      where: {
        id: documentId,
      },
      data: {
        title,
        linkUrl:
          document.linkUrl === documentUrl ? document.linkUrl : documentUrl,
        fileSize,
      },
    });

    return res.status(200).json({ updatedDocument });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

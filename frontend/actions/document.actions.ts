'use server';

import axios from 'axios';
import { getCurrentClinic } from './clinic.actions';
import { getCurrentUser } from './user.actions';

export const uploadDocument = async ({
  clinicId,
  title,
  documentUrl,
  fileSize,
}: {
  clinicId: string;
  title: string;
  documentUrl: string;
  fileSize: number;
}) => {
  const res = await axios.post('http://localhost:8080/api/document/upload', {
    clinicId,
    title,
    documentUrl,
    fileSize,
  });

  return res.data;
};

export const getClinicDocuments = async (): Promise<TDocument[]> => {
  //   const clinic = await getCurrentClinic();
  const data = await getCurrentUser();
  const res = await axios.get(
    `http://localhost:8080/api/document/get-clinic-documents/${data?.user?.clinic.id}`
  );

  return res.data.documents;
};

export const deleteDocument = async (documentId: string) => {
  const res = await axios.delete(
    `http://localhost:8080/api/document/delete/${documentId}`
  );

  return res.data;
};

export const editDocument = async ({
  documentId,
  title,
  documentUrl,
  fileSize,
}: {
  documentId: string;
  title: string;
  documentUrl: string;
  fileSize: number;
}) => {
  const res = await axios.post('http://localhost:8080/api/document/edit', {
    title,
    documentUrl,
    documentId,
    fileSize,
  });

  return res.data;
};

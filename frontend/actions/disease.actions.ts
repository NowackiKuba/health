import axios from 'axios';

export const assignChronicDiseaseToPatient = async ({
  patientId,
  disease,
  diagnosis,
  doctorId,
}: {
  patientId: string;
  disease: string;
  diagnosis: string;
  doctorId: string;
}) => {
  const res = await axios.post(
    'http://localhost:8080/api/disease/assign-or-create',
    {
      patientId,
      disease,
      diagnosis,
      doctorId,
    }
  );

  return res.data;
};

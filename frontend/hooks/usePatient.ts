'use client';

import { getPatientById } from '@/actions/patient.actions';
import { useQuery } from '@tanstack/react-query';

export const usePatient = ({ patientId }: { patientId: string }) => {
  const { data: patient, isLoading } = useQuery({
    queryKey: ['getPatient', { patientId }],
    queryFn: async () => getPatientById({ patientId }),
  });

  return { patient, isLoading };
};

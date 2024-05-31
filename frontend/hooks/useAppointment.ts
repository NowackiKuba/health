'use client';

import { getAppointmentById } from '@/actions/appointment.action';
import { useQuery } from '@tanstack/react-query';

export const useAppointment = ({
  appointmentId,
}: {
  appointmentId: string;
}) => {
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['getAppointmentById', { appointmentId }],
    queryFn: async () => getAppointmentById({ appointmentId }),
  });

  return { appointment, isLoading };
};

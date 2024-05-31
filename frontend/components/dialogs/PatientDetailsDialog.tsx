import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { usePatient } from '@/hooks/usePatient';
import { Ghost, Mail, MapPin, Smartphone } from 'lucide-react';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  patientId: string;
}

const PatientDetailsDialog = ({ open, setOpen, patientId }: Props) => {
  const { patient, isLoading } = usePatient({ patientId });
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full'>
        <div className='flex flex-col items-start px-4 justify-start w-full bg-secondary py-4 rounded-xl '>
          <div className='flex items-center rounded-full justify-center h-24 w-24 bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 text-3xl font-bold'>
            {patient?.firstName[0]}
            {patient?.lastName[0]}
          </div>
          <p className='text-xl font-semibold mt-1.5'>
            {patient?.firstName} {patient?.lastName}
          </p>
          <div className='flex flex-col items-start justify-start gap-1 mt-2'>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 dark:text-gray-600 text-gray-400' />
              <p className='dark:text-gray-600 text-gray-400'>
                {patient?.email}
              </p>
            </div>
            {patient?.phone && (
              <div className='flex items-center gap-2'>
                <Smartphone className='h-4 w-4 dark:text-gray-600 text-gray-400' />
                <p className='dark:text-gray-600 text-gray-400'>
                  {patient?.phone}
                </p>
              </div>
            )}
            {patient?.zip &&
              patient?.address &&
              patient?.city &&
              patient?.state && (
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 dark:text-gray-600 text-gray-400' />
                  <p className='dark:text-gray-600 text-gray-400'>
                    {patient?.address}, {patient?.city}, {patient?.state},{' '}
                    {patient?.zip}
                  </p>
                </div>
              )}
          </div>
        </div>
        <div className='flex flex-col items-start px-4 justify-start w-full bg-secondary py-4 rounded-xl'>
          <p className='text-lg font-semibold max-w-full truncate'>
            {patient?.firstName} {patient?.lastName}&apos;s Appointments
          </p>
          {patient?.appointments.length ? null : (
            <div className='flex flex-col items-center justify-center gap-1.5 w-full mt-4'>
              <Ghost className='h-14 w-14 dark:text-gray-600 text-gray-400' />
              <p className='text-base font-[500] dark:text-gray-600 text-gray-400'>
                No Appointments
              </p>
            </div>
          )}
        </div>
        <div className='flex flex-col items-start px-4 justify-start w-full bg-secondary py-4 rounded-xl'>
          <p className='text-lg font-semibold max-w-full truncate'>
            {patient?.firstName} {patient?.lastName}&apos;s Prescriptions
          </p>
          {patient?.prescriptions.length ? null : (
            <div className='flex flex-col items-center justify-center gap-1.5 w-full mt-4'>
              <Ghost className='h-14 w-14 dark:text-gray-600 text-gray-400' />
              <p className='text-base font-[500] dark:text-gray-600 text-gray-400'>
                No Prescriptions
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsDialog;

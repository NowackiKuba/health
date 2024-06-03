import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { usePatient } from '@/hooks/usePatient';
import { Ghost, Mail, MapPin, ReceiptText, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';
import { TbCalendarPause, TbCalendarUp } from 'react-icons/tb';
import { MdSchedule } from 'react-icons/md';
import { format } from 'date-fns';
import Link from 'next/link';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  patientId: string;
}

const PatientDetailsDialog = ({ open, setOpen, patientId }: Props) => {
  const { patient, isLoading } = usePatient({ patientId });
  const [appointmentView, setAppointmentView] = useState<'upcoming' | 'past'>(
    'upcoming'
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full xl:max-h-[750px] overflow-y-auto'>
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
          <div className='flex items-center justify-between w-full'>
            <p className='text-lg font-semibold max-w-full truncate'>
              {patient?.firstName} {patient?.lastName}&apos;s Appointments
            </p>
            <div className='flex items-center gap-1'>
              <Button
                onClick={() => setAppointmentView('upcoming')}
                size={'icon'}
                variant={
                  appointmentView === 'upcoming' ? 'default' : 'primary-outline'
                }
              >
                <TbCalendarUp />
              </Button>
              <Button
                onClick={() => setAppointmentView('past')}
                size={'icon'}
                variant={
                  appointmentView === 'past' ? 'default' : 'primary-outline'
                }
              >
                <TbCalendarPause />
              </Button>
            </div>
          </div>
          <div className='flex flex-col gap-1 mt-2 max-h-[400px] overflow-y-auto w-full'>
            {patient?.appointments?.map((appointment) => (
              <div
                key={appointment.id}
                className={`items-center p-2 rounded-xl gap-2 w-full bg-background 
                  ${
                    appointmentView === 'past'
                      ? format(appointment.date, 'dd.MM.yyyy') <
                          format(new Date(), 'dd.MM.yyyy') &&
                        appointment.hour < format(new Date(), 'HH:mm')
                        ? 'flex'
                        : 'hidden'
                      : format(appointment.date, 'dd.MM.yyyy') >=
                          format(new Date(), 'dd.MM.yyyy') &&
                        appointment.hour >= format(new Date(), 'HH:mm')
                      ? 'flex'
                      : 'hidden'
                  }
                `}
              >
                <div className='h-14 w-14 rounded-md flex  bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 items-center justify-center'>
                  <MdSchedule className='h-7 w-7' />
                </div>
                <div className='flex flex-col'>
                  <p className='font-[500]'>{appointment?.appointmentReason}</p>
                  <p>
                    {format(new Date(appointment?.date), 'dd.MM.yyyy')}{' '}
                    {appointment?.hour}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
          {patient?.prescriptions?.map((p) => (
            <Link
              href={p.pdfLinkUrl}
              target='_blank'
              className='bg-background p-2 cursor-pointer w-full flex items-center gap-2 rounded-xl'
              key={p.id}
            >
              <div
                key={p.id}
                className='h-14 w-14 rounded-md flex  bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 items-center justify-center'
              >
                <ReceiptText className='h-7 w-7' />
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsDialog;

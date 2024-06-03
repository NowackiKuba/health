import { useAppointment } from '@/hooks/useAppointment';
import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { BiHealth } from 'react-icons/bi';
import { format } from 'date-fns';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  appointment: TAppointment;
}

const AppointmentDetailsDialog = ({ open, setOpen, appointment }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-3 w-full'>
        <div className='flex flex-col items-start justify-start w-full gap-2 px-4 py-2 bg-secondary rounded-xl'>
          <div className='flex items-center rounded-full justify-center h-24 w-24 bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 '>
            <BiHealth className='h-12 w-12' />
          </div>
          <p className='text-xl font-semibold first-letter:uppercase'>
            {appointment?.appointmentType?.toLowerCase()} Appointment
          </p>
          <div className='mt-2 flex flex-col gap-1 w-full'>
            {appointment?.date && (
              <div className='flex items-center gap-2 w-full text-sm'>
                <p className='font-semibold'>Date:</p>
                <p>{format(appointment?.date, 'dd.MM.yyyy, HH:mm')}</p>
              </div>
            )}
            <div className='flex items-center gap-2 w-full text-sm'>
              <p className='font-semibold'>Reason: </p>
              <p>{appointment?.appointmentReason}</p>
            </div>
            <div className='flex items-center gap-2 w-full text-sm'>
              <p className='font-semibold'>Assigned To: </p>
              <p>
                {appointment?.employee?.firstName}{' '}
                {appointment?.employee?.lastName}
              </p>
            </div>
            <div className='flex items-center gap-2 w-full text-sm'>
              <p className='font-semibold'>Note: </p>
              <p>{appointment?.note}</p>
            </div>
            <div className='flex items-center gap-2 w-full text-sm'>
              <p className='font-semibold'>Patient: </p>
              <p>
                {appointment?.patient?.firstName}{' '}
                {appointment?.patient?.lastName}
              </p>
            </div>
            <div className='flex items-center gap-2 w-full text-sm'>
              <p className='font-semibold'>NFZ: </p>
              <p>{appointment?.isNFZ ? 'Yes' : 'No'}</p>
            </div>
            <div className='flex items-center gap-2 w-full text-sm'>
              <p className='font-semibold'>Price: </p>
              <p>{appointment?.isNFZ ? 'N/A' : `${appointment?.price} PLN`}</p>
            </div>
            {appointment?.service && (
              <div className='flex items-center gap-2 w-full text-sm'>
                <p className='font-semibold'>Service: </p>
                <p>{appointment?.service?.name}</p>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col items-start justify-start w-full gap-2 px-4 py-2 bg-secondary rounded-xl'>
          <div className='flex items-center rounded-full justify-center h-24 w-24 bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 text-3xl font-bold'>
            {appointment?.patient?.firstName[0]}
            {appointment?.patient?.lastName[0]}
          </div>
          <p className='text-xl font-semibold'>
            {appointment?.patient?.firstName} {appointment?.patient?.lastName}
          </p>
          <div className='flex flex-col gap-1 w-full'>
            {appointment?.patient?.dateOfBirth && (
              <div className='flex items-center gap-2 w-full text-sm'>
                <p className='font-semibold'>Date of Birth</p>
                <p>{format(appointment?.patient?.dateOfBirth, 'dd.MM.yyyy')}</p>
              </div>
            )}
            <div className='flex items-center gap-2 w-full text-sm'>
              <p className='font-semibold min-w-[130px]'>Chronic Diseases</p>
              <div className='flex items-center w-full gap-2 flex-wrap'>
                {!appointment?.patient?.chronicDiseases ? (
                  <p>No Data</p>
                ) : (
                  <>
                    {appointment?.patient?.chronicDiseases?.map((disease) => (
                      <p
                        key={disease.id}
                        className='text-xs bg-red-500/10 dark:bg-red-500/20 dark:text-red-200 text-red-500 px-2 py-1 dark:border-red-700 border-red-500 rounded-sm'
                      >
                        {disease.name}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;

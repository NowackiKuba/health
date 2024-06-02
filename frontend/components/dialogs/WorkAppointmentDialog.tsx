import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { format, set } from 'date-fns';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { decryptPesel } from '@/actions/auth.actions';
import { MdHealthAndSafety, MdMedication } from 'react-icons/md';
import { ClipboardPlus, Hospital, ReceiptText } from 'lucide-react';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appointment: TAppointment;
}

const WorkAppointmentDialog = ({ open, setOpen, appointment }: Props) => {
  const [decryptedPesel, setDecryptedPesel] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [seconds, setSeconds] = useState<number>(0);
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const handleStartAppointment = () => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    setCurrentInterval(timer);
  };

  useEffect(() => {
    // Czyszczenie interwału przy odmontowywaniu komponentu
    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, [currentInterval]);

  const handleStopAppointment = () => {
    clearInterval(currentInterval!);
    setEndDate(new Date(seconds * 1000));
    setCurrentInterval(null);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!appointment?.patient?.pesel) return;
    const decryptPesel = async () => {
      const res = await axios.post(
        'http://localhost:8080/api/auth/decode-pesel',
        { pesel: appointment?.patient?.pesel }
      );
      setDecryptedPesel(res.data.pesel);
    };
    decryptPesel();
  }, [appointment]);

  console.log(appointment?.patient?.pesel);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false);
        }
      }}
    >
      <DialogContent className='flex flex-col items-start justify-start gap-6 w-full max-w-4xl'>
        <div className='flex flex-col gap-6 w-full max-h-[700px] overflow-y-auto'>
          <div className='flex flex-col gap-3 w-full'>
            <p className='text-2xl font-semibold'>Appointment Details</p>
            <div className='flex flex-col gap-1 w-full'>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Patient: </p>
                <p>
                  {appointment?.patient?.firstName}{' '}
                  {appointment?.patient?.lastName}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Reason: </p>
                <p>{appointment?.appointmentReason}</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Type: </p>
                <p>{appointment?.appointmentType}</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Note: </p>
                <p>{appointment?.note || 'No Note'}</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <p className='text-2xl font-semibold'>Patient Details</p>
            <div className='flex flex-col gap-1 w-full'>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Full Name: </p>
                <p>
                  {appointment?.patient?.firstName}{' '}
                  {appointment?.patient?.lastName}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Pesel: </p>
                <p>{decryptedPesel}</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Type: </p>
                <p>{appointment?.appointmentType}</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-[600]'>Note: </p>
                <p>{appointment?.note || 'No Note'}</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <p className='text-2xl font-semibold'>
              Patient Appointment History
            </p>
            <div className='flex flex-col gap-1 w-full'>
              {appointment?.patient?.appointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`${
                    format(appointment?.date, 'dd.MM.yyyy') >
                    format(new Date(), 'dd.MM.yyyy')
                      ? 'hidden'
                      : 'flex'
                  } items-center gap-1.5 w-full bg-secondary rounded-xl p-2`}
                >
                  <div className='h-16 w-16 rounded-xl flex items-center justify-center bg-primary/10 text-primary dark:bg-primary/10 dark:text-green-200'>
                    <MdHealthAndSafety className='h-8 w-8' />
                  </div>
                  <div className='flex flex-col w-full'>
                    <p className='text-lg font-[500]'>
                      {appointment?.appointmentReason}
                    </p>
                    <p>
                      {format(appointment?.date, 'dd.MM.yyyy')},{' '}
                      {appointment?.hour}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <p className='text-2xl font-semibold'>Actions</p>

            <div className='flex items-center gap-2 w-full flex-wrap'>
              <div className='h-40 w-40 gap-1 rounded-xl cursor-pointer group border border-border flex flex-col items-center justify-center'>
                <div className='h-20 w-20  rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 duration-100 ease-linear'>
                  <ClipboardPlus className=' h-10 w-10 text-primary dark:text-green-200' />
                </div>
                <p className='duration-100 ease-linear text-primary dark:text-green-200'>
                  Add Report
                </p>
              </div>
              <div className='h-40 w-40 gap-1 rounded-xl cursor-pointer group border border-border flex flex-col items-center justify-center'>
                <div className='h-20 w-20  rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 duration-100 ease-linear'>
                  <ReceiptText className=' h-10 w-10 text-primary dark:text-green-200' />
                </div>
                <p className='duration-100 ease-linear text-primary dark:text-green-200'>
                  Add Prescription
                </p>
              </div>
              <div className='h-40 w-40 gap-1 rounded-xl cursor-pointer group border border-border flex flex-col items-center justify-center'>
                <div className='h-20 w-20  rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 duration-100 ease-linear'>
                  <Hospital className=' h-10 w-10 text-primary dark:text-green-200' />
                </div>
                <p className='duration-100 text-center ease-linear text-primary dark:text-green-200'>
                  Hospital Referral
                </p>
              </div>
              <div className='h-40 w-40 gap-1 rounded-xl cursor-pointer group border border-border flex flex-col items-center justify-center'>
                <div className='h-20 w-20  rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 duration-100 ease-linear'>
                  <MdMedication className=' h-10 w-10 text-primary dark:text-green-200' />
                </div>
                <p className='duration-100 text-center ease-linear text-primary dark:text-green-200'>
                  Medical Equipment
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            onClick={() => setOpen(false)}
            variant={'primary-outline'}
            className='w-full'
          >
            Cancel
          </Button>
          {currentInterval === null ? (
            <Button className='w-full' onClick={() => handleStartAppointment()}>
              Start Appointment
            </Button>
          ) : (
            <Button
              className='w-full flex items-center gap-2'
              onClick={() => {
                handleStopAppointment();
              }}
            >
              <p>Stop</p>
              {formatTime(seconds)}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkAppointmentDialog;

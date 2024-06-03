'use client';
import { useUser } from '@/hooks/useUser';
import { format } from 'date-fns';
import { ChevronRight, Ghost } from 'lucide-react';
import React from 'react';
import { MdSchedule } from 'react-icons/md';

const DashboardPage = () => {
  const { user, isLoading, accountType } = useUser();
  const today = new Date();
  let todayAppointments: TAppointment[] = [];
  let todayTasks: TTask[] = [];

  user?.appointments?.forEach((a) => {
    if (format(a.date, 'dd.MM.yyyy') === format(today, 'dd.MM.yyyy')) {
      todayAppointments.push(a);
    }
  });

  todayAppointments.sort((a, b) => a.date.getTime() - b.date.getTime());
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className='w-full flex flex-col gap-2 xl:max-h-[calc(100vh-170px)] overflow-y-auto'>
      <p className='text-2xl font-semibold'>
        {format(new Date(), 'dd.MM.yyyy')}, {user?.firstName} {user?.lastName}
      </p>
      <div className='flex items-center gap-4 w-full overflow-y-auto'>
        {accountType?.toString().toLowerCase() === 'doctor' ? (
          <div className='bg-secondary min-h-80 rounded-xl p-3 w-2/5 flex flex-col gap-2'>
            <p className='text-lg font-semibold'>Today&apos;s Appointments</p>
            {todayAppointments?.length ? (
              <div className='flex flex-col gap-1 w-full'>
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className='flex items-center cursor-pointer group justify-between w-full rounded-xl bg-background p-1.5'
                  >
                    <div className='w-full flex items-center gap-1.5'>
                      <div className='h-14 w-14 bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 rounded-lg flex items-center justify-center'>
                        <MdSchedule className='h-7 w-7' />
                      </div>
                      <div className='flex flex-col'>
                        <p className='font-semibold'>
                          {appointment.patient?.firstName}{' '}
                          {appointment.patient?.lastName} -{' '}
                          {appointment.appointmentReason}
                        </p>
                        <p className='text-gray-400 dark:text-gray-600 text-sm'>
                          {format(appointment.date, 'dd.MM.yyyy')}{' '}
                          {appointment.hour}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className='h-7 w-7 group-hover:translate-x-1 duration-100 ease-linear' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col mt-2 pb-6 items-center justify-center gap-1'>
                <Ghost className='h-20 w-20 text-gray-400 dark:text-gray-600' />
                <p className='text-base font-semibold text-gray-400 dark:text-gray-600'>
                  No Appointments
                </p>
              </div>
            )}
          </div>
        ) : null}
        <div className='flex flex-col bg-secondary rounded-xl p-3 min-h-80 w-3/5 overflow-y-auto'>
          <p className='text-lg font-semibold'>Today&apos;s Tasks</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

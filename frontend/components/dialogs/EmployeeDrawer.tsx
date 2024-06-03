'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Drawer, DrawerContent } from '../ui/drawer';
import { useEmployee } from '@/hooks/useEmployee';
import { format } from 'date-fns';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  employeeId: string;
}

const EmployeeDrawer = ({ open, setOpen, employeeId }: Props) => {
  const { employee, isLoading } = useEmployee({ employeeId });
  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DrawerContent className='flex items-start justify-start w-full'>
        <div className='px-4 w-full flex items-center gap-2 border-b py-2'>
          <div className='h-20 w-20 px-8 rounded-full bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 flex items-center justify-center text-2xl font-bold'>
            {employee?.firstName[0]}
            {employee?.lastName[0]}
          </div>
          <div className='flex flex-col w-full'>
            <p className='sm:text-2xl font-semibold'>
              {employee?.firstName} {employee?.lastName}
            </p>
            <div className='flex items-center text-gray-400 dark:text-gray-600 gap-1 w-full sm:text-sm'>
              <p>{employee?.email}</p>
              <p>&middot;</p>
              <p className='first-letter:uppercase'>
                {employee?.role.toString().toLowerCase()}
              </p>
              <p>&middot;</p>
              <p>{employee?.phone}</p>
            </div>
          </div>
        </div>
        {employee?.role.toString().toLowerCase() === 'doctor' && (
          <div className='px-4 w-full flex flex-col gap-2 border-b py-2'>
            <p className='text-xl font-semibold'>Employee Appointments</p>
            <div className='flex flex-col items-start justify-start gap-1 w-full'>
              {employee?.appointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className='flex flex-col items-start gap-1 w-full bg-secondary rounded-xl p-2 '
                >
                  <p className='text-lg font-semibold'>
                    {appointment?.patient?.firstName}{' '}
                    {appointment?.patient?.lastName} -{' '}
                    {appointment?.appointmentReason}
                  </p>
                  <div className='flex items-center gap-1 w-full'>
                    <p className='text-sm text-gray-400 dark:text-gray-600'>
                      {format(appointment?.date, 'dd.MM.yyyy')},{' '}
                      {appointment.hour}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default EmployeeDrawer;

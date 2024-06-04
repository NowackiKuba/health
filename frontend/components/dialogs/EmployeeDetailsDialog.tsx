import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useEmployee } from '@/hooks/useEmployee';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  employeeId: string;
}

const EmployeeDetailsDialog = ({ open, setOpen, employeeId }: Props) => {
  const { employee, isLoading } = useEmployee({ employeeId });
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-2 w-full'>
        <div className='flex flex-col items-start justify-start w-full px-4 py-2 bg-secondary rounded-xl'>
          <Avatar className='h-28 w-28'>
            <AvatarImage
              src={employee?.imgUrl || ''}
              className='h-28 w-28 rounded-full object-cover'
            />
            <AvatarFallback className='h-28 w-28'>
              <div className='h-28 w-28 rounded-full flex items-center justify-center font-bold text-4xl bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200'>
                {employee?.firstName[0]}
                {employee?.lastName[0]}
              </div>
            </AvatarFallback>
          </Avatar>
          <p className='text-2xl font-semibold mt-2'>
            {employee?.firstName} {employee?.lastName}
          </p>
          <div className='flex flex-col gap-1 w-full text-sm text-gray-400'>
            <div className='flex items-center gap-2 `'>
              <p className='font-semibold'>Email:</p>
              <p>{employee?.email}</p>
            </div>
            <div className='flex items-center gap-2 `'>
              <p className='font-semibold'>Phone: </p>
              <p>{employee?.phone || 'No Data'}</p>
            </div>
            <div className='flex items-center gap-2 `'>
              <p className='font-semibold'>Room: </p>
              <p>{employee?.room || 'No Data'}</p>
            </div>
            <div className='flex items-center gap-2 `'>
              <p className='font-semibold'>Role: </p>
              <p className='first-letter:uppercase'>
                {employee?.role.toString().toLowerCase() || 'No Data'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;

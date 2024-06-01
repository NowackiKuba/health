import React, {
  Dispatch,
  DispatchWithoutAction,
  SetStateAction,
  useState,
} from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/actions/appointment.action';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';
import { getCurrentClinic } from '@/actions/clinic.actions';
import CreatePatientDialog from './CreatePatientDialog';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  patientId?: string;
  doctorId?: string;
}

const CreateAppointmentDialog = ({
  open,
  setOpen,
  patientId,
  doctorId,
}: Props) => {
  const [isOpenCreatePatient, setIsOpenCreatePatient] =
    useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    doctorId ? doctorId : ''
  );
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>(
    patientId ? patientId : ''
  );

  const { data: clinic } = useQuery({
    queryKey: ['getCurrentClinic'],
    queryFn: async () => await getCurrentClinic(),
  });

  const queryClient = useQueryClient();
  const { mutate: handleCreateAppointment, isPending: isCreating } =
    useMutation({
      mutationKey: ['createAppointment'],
      mutationFn: createAppointment,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['getClinicAppointments'],
          refetchType: 'all',
        });
        setOpen(false);
        toast({
          title: 'Successfully created appointment',
          duration: 1500,
        });
      },
      onError: () => {
        toast({
          title: 'Something went wrong while creating appointment',
          description: 'Please try again later',
          duration: 1500,
          variant: 'destructive',
        });
      },
    });
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col items-start justify-start w-full gap-5'>
        <p className='text-xl font-semibold'>Create Appointment</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Appointment Type</Label>
          <Select onValueChange={(e) => setAppointmentType(e)}>
            <SelectTrigger>
              <SelectValue placeholder='Select appointment type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ONLINE'>Online</SelectItem>
              <SelectItem value='IN_PERSON'>In Clinic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Appointment Reason</Label>
          <Input onChange={(e) => setAppointmentReason(e.target.value)} />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input type='time' onChange={(e) => setHour(e.target.value)} />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Doctors</Label>
          <Select
            defaultValue={doctorId}
            onValueChange={(e) => setSelectedDoctorId(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Doctor' />
            </SelectTrigger>
            <SelectContent>
              {clinic?.employees.map((doctor) => (
                <SelectItem
                  key={doctor.id}
                  value={doctor?.id}
                  className={`${
                    doctor?.role.toString().toLowerCase() !== 'doctor'
                      ? 'hidden'
                      : 'flex'
                  }`}
                >
                  {doctor?.firstName} {doctor?.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Patients</Label>
          <Select
            defaultValue={doctorId}
            onValueChange={(e) => setSelectedPatient(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Patient' />
            </SelectTrigger>
            <SelectContent>
              {clinic?.patients?.map((patient) => (
                <SelectItem key={patient.id} value={patient?.id}>
                  {patient?.firstName} {patient?.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className='text-xs'>
            Patient don&apos;t have an account?{' '}
            <span
              className='text-primary underline cursor-pointer'
              onClick={() => setIsOpenCreatePatient(true)}
            >
              Create Patient Account
            </span>
          </p>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Note (optional)</Label>
          <Textarea
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            className='resize-none'
          />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            variant={'primary-outline'}
            onClick={() => setOpen(false)}
            className='w-full'
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const today = new Date(
                new Date().setHours(+hour.split(':')[0], +hour.split(':')[1])
              );

              handleCreateAppointment({
                appointmentReason,
                appointmentType,
                date: today,
                employeeId: selectedDoctorId,
                note,
                patientId: selectedPatient,
                clinicId: clinic?.id!,
              });
            }}
            className='w-full'
            disabled={isCreating}
          >
            <ButtonLoading
              isLoading={isCreating}
              buttonText='Create Appointment'
            />
          </Button>
        </div>
      </DialogContent>
      <CreatePatientDialog
        open={isOpenCreatePatient}
        setOpen={setIsOpenCreatePatient}
      />
    </Dialog>
  );
};

export default CreateAppointmentDialog;

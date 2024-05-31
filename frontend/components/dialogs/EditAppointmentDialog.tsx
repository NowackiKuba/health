import React, {
  Dispatch,
  DispatchWithoutAction,
  SetStateAction,
  useEffect,
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
import { format, set } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAppointment,
  editAppointment,
} from '@/actions/appointment.action';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';
import { getCurrentClinic } from '@/actions/clinic.actions';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  appointment: TAppointment;
}

const EditAppointmentDialog = ({ open, setOpen, appointment }: Props) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  useEffect(() => {
    if (!appointment) return;
    setSelectedDoctorId(appointment.employeeId);
    setDate(appointment.date);
    setHour(new Date(appointment.date).toTimeString().split(' ')[0]);
    setNote(appointment.note);
    setAppointmentType(appointment.appointmentType);
    setAppointmentReason(appointment.appointmentReason);
    setSelectedPatient(appointment.patientId);
  }, [appointment]);
  console.log('hour', hour);
  const queryClient = useQueryClient();
  const { mutate: handleEditAppointment, isPending: isEditing } = useMutation({
    mutationKey: ['editAppointment'],
    mutationFn: editAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getClinicAppointments'],
        refetchType: 'all',
      });
      setOpen(false);
      toast({
        title: 'Successfully updated appointment',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong while updating appointment',
        description: 'Please try again later',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  const { data: clinic } = useQuery({
    queryKey: ['getCurrentClinic'],
    queryFn: async () => await getCurrentClinic(),
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
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Appointment Type</Label>
          <Select
            defaultValue={appointmentType}
            onValueChange={(e) => setAppointmentType(e)}
          >
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
          <Input
            onChange={(e) => setAppointmentReason(e.target.value)}
            defaultValue={appointmentReason}
          />
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
          <Input
            type='time'
            onChange={(e) => setHour(e.target.value)}
            defaultValue={hour}
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Doctors</Label>
          <Select
            defaultValue={selectedDoctorId}
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
            defaultValue={selectedPatient}
            onValueChange={(e) => setSelectedPatient(e)}
          >
            <SelectTrigger defaultValue={selectedPatient}>
              <SelectValue
                placeholder='Select Patient'
                defaultValue={selectedPatient}
              />
            </SelectTrigger>
            <SelectContent defaultValue={selectedPatient}>
              {clinic?.patients?.map((patient) => (
                <SelectItem key={patient.id} value={patient?.id}>
                  {patient?.firstName} {patient?.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Note (optional)</Label>
          <Textarea
            defaultValue={note}
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
            Anuluj
          </Button>
          <Button
            onClick={() => {
              const today = new Date(
                new Date().setHours(+hour.split(':')[0], +hour.split(':')[1])
              );

              handleEditAppointment({
                appointmentReason,
                appointmentType,
                date: today,
                employeeId: selectedDoctorId,
                note,
                patientId: selectedPatient,
                appointmentId: appointment.id,
              });
            }}
            className='w-full'
            disabled={isEditing}
          >
            <ButtonLoading
              isLoading={isEditing}
              buttonText='Edit Appointment'
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;

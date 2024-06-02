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
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/actions/appointment.action';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';
import { getCurrentClinic } from '@/actions/clinic.actions';
import CreatePatientDialog from './CreatePatientDialog';
import axios from 'axios';
import SelectAppointmentDateDialog from './SelectAppointmentDateDialog';
import { Checkbox } from '../ui/checkbox';
import useClinic from '@/hooks/useClinic';

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
  const [selectedDoctor, setSelectedDoctor] = useState<TEmployee>();
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [selectedSerivce, setSelectedService] = useState<TService | undefined>(
    undefined
  );
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [isNFZ, setIsNFZ] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [selectedPatient, setSelectedPatient] = useState<string>(
    patientId ? patientId : ''
  );

  const { clinic, isLoading } = useClinic();
  const [isOpenDate, setIsOpenDate] = useState<boolean>(false);
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

  useEffect(() => {
    if (!selectedDoctorId) return;
    const fetchDoctor = async () => {
      const res = await axios.get(
        `http://localhost:8080/api/employee/${selectedDoctorId}`
      );
      setSelectedDoctor(res.data.employee);
    };
    fetchDoctor();
  }, [selectedDoctorId]);

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
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Doctors</Label>
          <Select
            disabled={doctorId ? true : false}
            defaultValue={doctorId}
            onValueChange={async (e) => {
              setSelectedDoctorId(e);
              const res = await axios.get(
                `http://localhost:8080/api/employee/${e}`
              );
              setSelectedDoctor(res.data.employee);
            }}
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
        {selectedDoctor && (
          <div
            onClick={() => setIsOpenDate(true)}
            className='border w-full rounded-md flex items-center gap-2 py-2 text-sm px-4 text-gray-500 cursor-pointer'
          >
            {hour && date ? (
              <>
                <CalendarIcon className='h-4 w-4' />
                <p>
                  {format(date, 'dd.MM')}, {hour}
                </p>
              </>
            ) : (
              <>
                <CalendarIcon className='h-4 w-4' />
                <p>Select Date</p>
              </>
            )}
          </div>
        )}
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Patients</Label>
          <Select
            disabled={patientId ? true : false}
            defaultValue={patientId}
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
          <Label>Price</Label>
          <Input
            onChange={(e) => setPrice(+e.target.value)}
            defaultValue={price}
            value={price}
          />
          <div className='flex items-center gap-2 text-sm'>
            <Checkbox
              checked={isNFZ}
              onCheckedChange={() => {
                setIsNFZ((prev) => !prev);
                if (!isNFZ) {
                  setPrice(0);
                } else {
                  setPrice((prev) => prev);
                }
              }}
            />
            <p>NFZ Appointment</p>
          </div>
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
              handleCreateAppointment({
                appointmentReason,
                appointmentType,
                date: date!,
                employeeId: selectedDoctorId,
                note,
                patientId: selectedPatient,
                clinicId: clinic?.id!,
                hour,
                isNFZ,
                price,
                serviceId: selectedSerivce?.id,
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
      <SelectAppointmentDateDialog
        employeeId={selectedDoctorId}
        open={isOpenDate}
        setOpen={setIsOpenDate}
        setSelectedHour={setHour}
        selectedHour={hour}
        setSelectedDate={setDate}
        selectedDate={date!}
        services={clinic?.services!}
        setSelectedService={setSelectedService}
        selectedService={selectedSerivce}
      />
    </Dialog>
  );
};

export default CreateAppointmentDialog;

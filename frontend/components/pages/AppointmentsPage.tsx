'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  CalendarClock,
  CalendarPlus,
  CalendarRange,
  ChevronDown,
  CircleCheck,
  CirclePlus,
  CircleX,
  Edit,
  Eye,
  Loader2,
  Settings,
  Trash,
} from 'lucide-react';
import Searchbar from '../Searchbar';
import QuerySelector from '../QuerySelector';
import { useQuery } from '@tanstack/react-query';
import { getClinicAppointments } from '@/actions/appointment.action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { getCurrentClinic } from '@/actions/clinic.actions';
import { formUrlQuery, removeKeysFromQuery } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import CreateAppointmentDialog from '../dialogs/CreateAppointmentDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { format } from 'date-fns';
import EditAppointmentDialog from '../dialogs/EditAppointmentDialog';
import AppointmentDetailsDialog from '../dialogs/AppointmentDetailsDialog';
import { TbCalendarStats } from 'react-icons/tb';
import { MdWork } from 'react-icons/md';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import WorkAppointmentDialog from '../dialogs/WorkAppointmentDialog';

const AppointmentsPage = () => {
  const { data: clinic, isLoading: isLoadingClinic } = useQuery({
    queryKey: ['getClinic'],
    queryFn: async () => await getCurrentClinic(),
  });
  const searchParams = useSearchParams();
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['getAppointments', { doctorId: searchParams?.get('doctorId') }],
    queryFn: async () =>
      await getClinicAppointments({
        doctorId: searchParams?.get('doctorId')
          ? searchParams?.get('doctorId')!
          : '',
      }),
  });
  const router = useRouter();
  const [view, setView] = useState<'history' | 'upcoming'>('upcoming');
  const [activeDoctor, setActiveDoctor] = useState<string>('');
  const [activePatient, setActivePatient] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] =
    useState<TAppointment>();
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenWorkView, setIsOpenWorkView] = useState<boolean>(false);
  const handleSelect = (item: string, type: 'doctor' | 'patient') => {
    if (type === 'doctor') {
      if (activeDoctor === item) {
        setActiveDoctor('');
        const newUrl = removeKeysFromQuery({
          keysToRemove: ['doctor'],
          params: searchParams.toString(),
        });
        router.push(newUrl, { scroll: false });
      } else {
        setActiveDoctor(item);
        const newUrl = formUrlQuery({
          key: 'doctor',
          value: item,
          params: searchParams.toString(),
        });
        router.push(newUrl, { scroll: false });
      }
    } else {
      if (activePatient === item) {
        setActivePatient('');
        const newUrl = removeKeysFromQuery({
          keysToRemove: ['patient'],
          params: searchParams.toString(),
        });
      } else {
        setActivePatient(item);
        const newUrl = formUrlQuery({
          key: 'patient',
          value: item,
          params: searchParams.toString(),
        });
        router.push(newUrl, { scroll: false });
      }
    }
  };
  console.log(appointments);

  if (isLoading || isLoadingClinic) {
    return <p>loading</p>;
  }
  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-semibold'>Appointments</p>
        <div className='flex items-center gap-2'>
          <Button
            className='flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Create Appointment</p>
          </Button>
          <Button
            variant={'primary-outline'}
            className='flex items-center gap-2'
          >
            <p>Actions</p>
            <ChevronDown className='h-5 w-5' />
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-2 w-full'>
          <Searchbar
            placeholder='Search for appointments'
            iconPosition='left'
            route='/dashboard/appointments'
            otherClasses='xl:max-w-[400px] w-full'
          />
          <Select defaultValue={searchParams?.get('doctorId')!}>
            <SelectTrigger className='max-w-[220px]'>
              <SelectValue placeholder='Select Doctor' />
            </SelectTrigger>
            <SelectContent>
              {clinic?.employees.map((employee) => (
                <SelectItem
                  key={employee.id}
                  value={employee.id}
                  className={`${
                    employee?.role?.toString().toLowerCase() !== 'doctor'
                      ? 'hidden'
                      : 'flex'
                  }`}
                >
                  {employee?.firstName} {employee?.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className='max-w-[220px]'>
              <SelectValue placeholder='Select Patient' />
            </SelectTrigger>
            <SelectContent>
              {clinic?.patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient?.firstName} {patient?.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <QuerySelector
            placeholder='Sort'
            queryKey='sort'
            otherClasses='xl:max-w-[220px]'
            options={[
              { key: 'newest', value: 'Newest' },
              { key: 'oldest', value: 'Oldest' },
            ]}
          />
        </div>
        <div className='flex items-center gap-2 '>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size={'icon'}
                  variant={view === 'upcoming' ? 'default' : 'primary-outline'}
                  onClick={() => setView('upcoming')}
                >
                  <CalendarClock className='h-5 w-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upcoming Appointments</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size={'icon'}
                  variant={view === 'history' ? 'default' : 'primary-outline'}
                  onClick={() => setView('history')}
                >
                  <CalendarRange className='h-5 w-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Appointments History</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className='w-full'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>NFZ</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className='text-end'>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments?.map((appointment) => (
              <TableRow
                key={appointment.id}
                className={`w-full ${
                  view === 'history'
                    ? format(appointment?.date, 'dd.MM.yyyy') <=
                      format(new Date(), 'dd.MM.yyyy')
                      ? ''
                      : 'hidden'
                    : format(appointment?.date, 'dd.MM.yyyy') >=
                      format(new Date(), 'dd.MM.yyyy')
                    ? ''
                    : 'hidden'
                } `}
              >
                <TableCell>{appointment.appointmentType.toString()}</TableCell>
                <TableCell>{appointment.appointmentReason}</TableCell>
                <TableCell>
                  {format(appointment.date, 'dd.MM.yyyy')}, {appointment?.hour}
                </TableCell>
                <TableCell className='max-w-[200px] truncate'>
                  {appointment?.isNFZ ? (
                    <CircleCheck className='h-5 w-5 text-green-500' />
                  ) : (
                    <CircleX className='h-5 w-5 text-red-500' />
                  )}
                </TableCell>
                <TableCell>
                  {appointment?.patient?.firstName}{' '}
                  {appointment?.patient?.lastName}
                </TableCell>
                <TableCell>
                  {appointment?.isNFZ ? 'N/A' : appointment?.price}
                </TableCell>
                <TableCell className='flex justify-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'ghost'} size={'icon'}>
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        disabled={view === 'history'}
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsOpenEdit(true);
                        }}
                        className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                      >
                        <Edit className='h-4 w-4' />
                        <p>Edit Appointment</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsOpenDetails(true);
                        }}
                        className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                      >
                        <Eye className='h-4 w-4' />
                        <p>See Details</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={
                          format(appointment.date, 'dd.MM.yyyy') >
                            format(new Date(), 'dd.MM.yyyy') ||
                          view === 'history'
                        }
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsOpenWorkView(true);
                        }}
                        className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                      >
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger className='flex items-center gap-2'>
                              <MdWork className='h-4 w-4' />
                              <p>Work View</p>
                            </TooltipTrigger>
                            <TooltipContent>
                              Open work view to start or end appointment, give
                              prescription and more
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='flex cursor-pointer hover:text-current items-center gap-2 text-sm text-red-500'
                        //   onClick={() =>
                        //     deletePatientMutation({ patientId: patient.id })
                        //   }
                        //   disabled={isDeleting}
                      >
                        {/* {isDeleting ? ( */}
                        {/* <Loader2 className='h-4 w-4 animate-spin' /> */}
                        {/* ) : ( */}
                        <Trash className='h-4 w-4' />
                        {/* )} */}
                        <p>Delete Appointment</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CreateAppointmentDialog
        open={isOpenCreate}
        setOpen={setIsOpenCreate}
        doctorId={
          searchParams?.get('doctorId')
            ? searchParams?.get('doctorId')!
            : undefined
        }
      />
      <EditAppointmentDialog
        appointment={selectedAppointment!}
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
      />
      <AppointmentDetailsDialog
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        appointment={selectedAppointment!}
      />
      <WorkAppointmentDialog
        open={isOpenWorkView}
        setOpen={setIsOpenWorkView}
        appointment={selectedAppointment!}
      />
    </div>
  );
};

export default AppointmentsPage;

'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Edit,
  Eye,
  Ghost,
  Loader2,
  Settings,
  Trash,
} from 'lucide-react';
import Searchbar from '../Searchbar';
import QuerySelector from '../QuerySelector';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClinicPatients } from '@/actions/clinic.actions';
import CreatePatientDialog from '../dialogs/CreatePatientDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useSearchParams } from 'next/navigation';
import Pagination from '../Pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import EditPatientDialog from '../dialogs/EditPatientDialog';
import PatientDetailsDialog from '../dialogs/PatientDetailsDialog';
import { deletePatient } from '@/actions/patient.actions';
import { toast } from '../ui/use-toast';
import { FcExport, FcImport } from 'react-icons/fc';
import { useUser } from '@/hooks/useUser';
import CreateAppointmentDialog from '../dialogs/CreateAppointmentDialog';
import AssignChronicDiseasToPatientDialog from '../dialogs/AssignChronicDiseasToPatientDialog';
import { FaDisease } from 'react-icons/fa';

const PatientsPage = () => {
  const searchParams = useSearchParams();
  const [isOpenCreateAppointment, setIsOpenCreateAppointment] =
    useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [isOpenChronicDisease, setIsOpenChronicDisease] =
    useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { user, isLoading: isLoadingUser } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: [
      'getPatients',
      { search: searchParams?.get('q') },
      { page: searchParams?.get('page') },
      { sort: searchParams?.get('sort') },
    ],
    queryFn: async () =>
      getClinicPatients({
        search: searchParams?.get('q') ? searchParams?.get('q')! : '',
        pageSize: 8,
        page: searchParams?.get('page') ? +searchParams?.get('page')! : 1,
        sort: searchParams?.get('sort') ? searchParams?.get('sort')! : '',
      }),
  });
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deletePatientMutation, isPending: isDeleting } = useMutation({
    mutationKey: ['deletePatient'],
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'getPatients',
          { search: searchParams?.get('q') },
          { page: searchParams?.get('page') },
          { sort: searchParams?.get('sort') },
        ],
        refetchType: 'all',
      });
      toast({
        title: 'Patient Successfully Deleted',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error Deleting Patient',
        description: 'An error occurred while deleting the patient',
        variant: 'destructive',
        duration: 1500,
      });
    },
  });

  if (isLoading) {
    return <p>...loading</p>;
  }
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-3xl font-semibold'>Patients</p>
        <div className='flex items-center justify-center gap-2'>
          <Button
            className='hidden sm:flex items-center gap-1'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Add Patient</p>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'primary-outline'}
                className='flex items-center gap-1'
              >
                <p>Actions</p>
                <ChevronDown className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className='sm:hidden flex items-center gap-2 text-sm'
                onClick={() => setIsOpenCreate(true)}
              >
                <CirclePlus className='h-5 w-5' />
                <p>Create Patient</p>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex items-center gap-2 text-sm'>
                <FcImport className='h-5 w-5' />
                <p>Import from CSV</p>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex items-center gap-2 text-sm'>
                <FcExport className='h-5 w-5' />
                <p>Export to CSV</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex items-center justify-between w-full'>
        <div className='flex md:flex-row flex-col items-center gap-2 w-full'>
          <Searchbar
            iconPosition='left'
            placeholder='Search for patients'
            route='/dashboard/patients'
            otherClasses='xl:max-w-[380px] w-full'
          />
          <QuerySelector
            options={[
              { key: 'newest', value: 'Newest' },
              { key: 'oldest', value: 'Oldest' },
            ]}
            placeholder='Sort'
            queryKey='sort'
            otherClasses='xl:max-w-[220px] lg:max-w-[250px] md:max-w-[300px]'
          />
        </div>
      </div>
      <div className='md:flex hidden items-center w-full gap-2 flex-wrap'>
        {!data?.patients || !data?.patients?.length ? (
          <div className='flex flex-col mt-12 w-full items-center justify-center gap-2'>
            <Ghost className='h-20 w-20 dark:text-gray-600 text-gray-400' />
            <p className='font-semibold dark:text-gray-600 text-gray-400'>
              No Patients
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>PESEL number</TableHead>
                <TableHead>Chronic Diseases</TableHead>
                <TableHead className='text-end'>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.patients?.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone || 'No Data'}</TableCell>
                  <TableCell>***********</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1 flex-wrap max-w-[250px]'>
                      {!patient?.chronicDiseases?.length ? (
                        <p>No Data</p>
                      ) : (
                        <>
                          {patient?.chronicDiseases?.map((disease) => (
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
                          onClick={() => {
                            setSelectedPatientId(patient.id);
                            setIsOpenEdit(true);
                          }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <Edit className='h-4 w-4' />
                          <p>Edit Patient</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPatientId(patient.id);
                            setIsOpenDetails(true);
                          }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <Eye className='h-4 w-4' />
                          <p>See Details</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPatientId(patient.id);
                            setIsOpenChronicDisease(true);
                          }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <FaDisease className='h-4 w-4' />
                          <p>Assign Chronic Disease</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPatientId(patient.id);
                            setIsOpenCreateAppointment(true);
                          }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <CalendarPlus className='h-4 w-4' />
                          <p>Create Appointment</p>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm text-red-500'
                          onClick={() =>
                            deletePatientMutation({ patientId: patient.id })
                          }
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Trash className='h-4 w-4' />
                          )}
                          <p>Delete Patient</p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className='flex md:hidden sm:flex-row flex-col flex-wrap sm:items-center items-start justify-start gap-1 w-full'>
        {!data?.patients || !data?.patients?.length ? (
          <div className='flex flex-col mt-12 w-full items-center justify-center gap-2'>
            <Ghost className='h-20 w-20 dark:text-gray-600 text-gray-400' />
            <p className='font-semibold dark:text-gray-600 text-gray-400'>
              No Patients
            </p>
          </div>
        ) : (
          <>
            {data?.patients?.map((patient) => (
              <div
                onClick={() => {
                  setSelectedPatientId(patient.id);
                  setIsOpenDetails(true);
                }}
                key={patient.id}
                className='flex p-2 sm:items-start items-center sm:flex-col flex-row justify-between sm:justify-start gap-2 w-full sm:w-[calc(50vw-10px)] bg-secondary rounded-xl'
              >
                <div className='flex items-center sm:items-start gap-1'>
                  <div className='sm:h-24 h-16 w-16 sm:w-24 bg-primary/10 font-semibold text-primary dark:bg-green-500/20 dark:text-green-200 flex items-center justify-center rounded-xl text-3xl sm:text-2xl'>
                    {patient.firstName[0]}
                    {patient?.lastName[0]}
                  </div>
                  <div className='hidden sm:flex flex-wrap items-center gap-2 ml-2 mt-1'>
                    {patient?.chronicDiseases?.map((disease) => (
                      <p
                        key={disease.id}
                        className='px-2 py-1 rounded-sm dark:bg-red-500/20 dark:text-red-200 border border-red-500 bg-red-500/10 text-red-500 text-sm'
                      >
                        {disease.name}
                      </p>
                    ))}
                  </div>
                  <div className='flex flex-col'>
                    <p className='sm:hidden flex text-xl font-semibold'>
                      {patient?.firstName} {patient?.lastName}
                    </p>
                  </div>
                </div>
                <div className='sm:flex hidden flex-col gap-1 w-full'>
                  <p className='font-semibold text-2xl'>
                    {patient?.firstName} {patient?.lastName}
                  </p>
                </div>
                <ChevronRight className='sm:hidden flex' />
              </div>
            ))}
          </>
        )}
      </div>
      <div className='flex items-center justify-start w-full'>
        <Pagination
          isNext={data?.isNext || false}
          pageNumber={
            searchParams?.get('page') ? +searchParams?.get('page')! : 1
          }
        />
      </div>
      <CreatePatientDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
      <EditPatientDialog
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        patientId={selectedPatientId}
      />
      <PatientDetailsDialog
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        patientId={selectedPatientId}
      />
      <CreateAppointmentDialog
        open={isOpenCreateAppointment}
        setOpen={setIsOpenCreateAppointment}
        patientId={selectedPatientId}
      />
      <AssignChronicDiseasToPatientDialog
        open={isOpenChronicDisease}
        setOpen={setIsOpenChronicDisease}
        patientId={selectedPatientId}
        doctorId={user?.id!}
      />
    </div>
  );
};

export default PatientsPage;

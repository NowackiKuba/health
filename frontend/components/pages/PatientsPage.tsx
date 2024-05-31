'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  CalendarPlus,
  ChevronDown,
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

const PatientsPage = () => {
  const searchParams = useSearchParams();

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { user, isLoading: isLoadingUser } = useUser();
  const [clinicDoctors, setClinicDoctors] = useState<TEmployee[]>([]);
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
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-3xl font-semibold'>Patients</p>
        <div className='flex items-center justify-center gap-2'>
          <Button
            className='flex items-center gap-1'
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
      <div className='flex items-center w-full gap-2 flex-wrap'>
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
                            // setIsOpenDetails(true);
                            setClinicDoctors(
                              user?.clinic?.employees.filter(
                                (employee) =>
                                  employee.role.toString().toLowerCase() ===
                                  'doctor'
                              ) || []
                            );
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
    </div>
  );
};

export default PatientsPage;

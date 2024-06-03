'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  CalendarPlus,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Edit,
  Eye,
  Ghost,
  Loader2,
  Settings,
  Trash,
} from 'lucide-react';
import CreateEmployeeDialog from '../dialogs/CreateEmployeeDialog';
import { MdAddTask } from 'react-icons/md';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClinicEmployees } from '@/actions/clinic.actions';
import EditEmployeeDialog from '../dialogs/EditEmployeeDialog';
import EmployeeDetailsDialog from '../dialogs/EmployeeDetailsDialog';
import CreateAppointmentDialog from '../dialogs/CreateAppointmentDialog';
import { deleteEmployee } from '@/actions/employee.actions';
import { toast } from '../ui/use-toast';
import CreateTaskDialog from '../dialogs/CreateTaskDialog';
import Searchbar from '../Searchbar';
import QuerySelector from '../QuerySelector';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '../Pagination';
import { removeKeysFromQuery } from '@/utils';
import { FcExport, FcImport } from 'react-icons/fc';
import EmployeeDrawer from '../dialogs/EmployeeDrawer';

const EmployeesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [isOpenDetailsDrawer, setIsOpenDetailsDrawer] =
    useState<boolean>(false);
  const [isOpenCreateAppointment, setIsOpenCreateAppointment] =
    useState<boolean>(false);
  const [isOpenCreateTask, setIsOpenCreateTask] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const { data, isLoading } = useQuery({
    queryKey: [
      'getClinicEmployees',
      { page: searchParams?.get('page') },
      { sort: searchParams?.get('sort') },
      { filter: searchParams?.get('filter') },
    ],
    queryFn: async () =>
      await getClinicEmployees({
        page: searchParams?.get('page') ? +searchParams?.get('page')! : 1,
        pageSize: 10,
        filter: searchParams?.get('filter')
          ? searchParams?.get('filter')!
          : undefined,
        sort: searchParams?.get('sort') ? searchParams?.get('sort')! : '',
      }),
  });

  const queryClient = useQueryClient();
  const { mutate: deleteEmployeeMutation, isPending: isDeleting } = useMutation(
    {
      mutationKey: ['deleteEmployee'],
      mutationFn: deleteEmployee,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['getClinicEmployees'],
          refetchType: 'all',
        });
        toast({
          title: 'Employee Successfully Deleted',
          duration: 1500,
        });
      },
      onError: () => {
        toast({
          title: 'Error Deleting Employee',
          description: 'An error occurred while deleting an employee',
          variant: 'destructive',
          duration: 1500,
        });
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-3xl font-semibold'>Employees</p>
        <div className='flex items-center justify-center gap-2'>
          <Button
            className='hidden md:flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Create Employee Account</p>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'primary-outline'}
                className='flex items-center gap-2'
              >
                <p>Actions</p>
                <ChevronDown className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className='md:hidden flex items-center gap-2 cursor-pointer'
                onClick={() => setIsOpenCreate(true)}
              >
                <CirclePlus className='h-5 w-5' />
                <p>Create Employee</p>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                <FcImport className='h-5 w-5' />
                <p>Import from CSV</p>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                <FcExport className='h-5 w-5' />
                <p>Export to CSV</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex items-center justify-between w-full'>
        <div className='flex lg:flex-row flex-col items-center gap-2 w-full'>
          <Searchbar
            placeholder='Search for employees'
            iconPosition='left'
            route='/dashboard/emloyees'
            otherClasses='xl:max-w-[400px]'
          />
          <div className='flex items-center gap-2 w-full'>
            <QuerySelector
              options={[
                { key: 'doctor', value: 'Doctors' },
                { key: 'receptionist', value: 'Receptionists' },
                { key: 'admin', value: 'Admins' },
              ]}
              placeholder='Filter'
              queryKey='filter'
              otherClasses='xl:max-w-[220px]'
            />
            <QuerySelector
              options={[
                { key: 'newest', value: 'Newest' },
                { key: 'oldest', value: 'Oldest' },
              ]}
              placeholder='Sort'
              queryKey='sort'
              otherClasses='xl:max-w-[220px]'
            />
            {(searchParams?.get('filter') || searchParams?.get('sort')) && (
              <Button
                variant={'destructive-ghost'}
                className='flex items-center gap-2'
                onClick={() => {
                  const newUrl = removeKeysFromQuery({
                    keysToRemove: ['sort', 'filter'],
                    params: searchParams.toString(),
                  });
                  router.push(newUrl, { scroll: false });
                }}
              >
                <Trash />
                <p>Remove Filters</p>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='md:flex hidden items-center w-full gap-2 flex-wrap'>
        {!data?.employees || !data?.employees?.length ? (
          <div className='flex flex-col mt-12 w-full items-center justify-center gap-2'>
            <Ghost className='h-20 w-20 dark:text-gray-600 text-gray-400' />
            <p className='font-semibold dark:text-gray-600 text-gray-400'>
              No Employees
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
                <TableHead>Role</TableHead>
                <TableHead className='text-end'>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.employees?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone || 'No Data'}</TableCell>
                  <TableCell className='first-letter:uppercase'>
                    {employee?.role.toString().toLowerCase()}
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
                            setSelectedEmployeeId(employee.id);
                            setIsOpenEdit(true);
                          }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <Edit className='h-4 w-4' />
                          <p>Edit Employee</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedEmployeeId(employee.id);
                            setIsOpenDetails(true);
                          }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <Eye className='h-4 w-4' />
                          <p>See Details</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedEmployeeId(employee.id);
                            setIsOpenCreateTask(true);
                          }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <MdAddTask className='h-4 w-4' />
                          <p>Add Task</p>
                        </DropdownMenuItem>
                        {employee?.role?.toString().toLowerCase() ==
                          'doctor' && (
                          <DropdownMenuItem
                            onClick={() => {
                              setIsOpenCreateAppointment(true);

                              setSelectedDoctorId(employee.id);
                            }}
                            className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                          >
                            <CalendarPlus className='h-4 w-4' />
                            <p>Create Appointment</p>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm text-red-500'
                          onClick={() =>
                            deleteEmployeeMutation({ employeeId: employee?.id })
                          }
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Trash className='h-4 w-4' />
                          )}

                          <p>Delete Employee</p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className='flex justify-start w-full'>
          <Pagination
            isNext={data?.isNext ? data.isNext : false}
            pageNumber={
              searchParams?.get('page') ? +searchParams?.get('page')! : 1
            }
          />
        </div>
      </div>
      <div className='flex md:hidden  sm:flex-row flex-col flex-wrap sm:items-center items-start sm:gap-2 gap-1 w-full'>
        {data?.employees?.map((employee) => (
          <div
            onClick={() => {
              setIsOpenDetailsDrawer(true);
              setSelectedEmployeeId(employee.id);
            }}
            key={employee.id}
            className='sm:w-[calc(50vw-12px)] flex  flex-row justify-between items-center w-full bg-secondary p-2 rounded-xl'
          >
            <div className='flex-row flex items-center  gap-1'>
              <div className='sm:h-16 sm:w-16 h-12 w-12 rounded-full bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200 flex items-center justify-center sm:text-2xl sm:font-bold'>
                {employee?.firstName[0]}
                {employee?.lastName[0]}
              </div>
              <div className='sm:flex flex-col gap-1'>
                <p className='font-semibold'>
                  {employee?.firstName} {employee?.lastName}
                </p>
                <p className='text-sm first-letter:uppercase'>
                  {employee?.role.toString().toLowerCase()}
                </p>
              </div>
            </div>
            <ChevronRight className='h-8 w-8 flex' />
          </div>
        ))}
        <div className='flex justify-center w-full'>
          <Pagination
            isNext={data?.isNext ? data.isNext : false}
            pageNumber={
              searchParams?.get('page') ? +searchParams?.get('page')! : 1
            }
          />
        </div>
      </div>
      <CreateEmployeeDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
      <EditEmployeeDialog
        open={isOpenEdit}
        employeeId={selectedEmployeeId}
        setOpen={setIsOpenEdit}
      />
      <EmployeeDetailsDialog
        employeeId={selectedEmployeeId}
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
      />
      <CreateAppointmentDialog
        open={isOpenCreateAppointment}
        setOpen={setIsOpenCreateAppointment}
        doctorId={selectedDoctorId}
      />
      <CreateTaskDialog
        open={isOpenCreateTask}
        setOpen={setIsOpenCreateTask}
        employeeId={selectedEmployeeId}
      />
      <EmployeeDrawer
        employeeId={selectedEmployeeId}
        open={isOpenDetailsDrawer}
        setOpen={setIsOpenDetailsDrawer}
      />
    </div>
  );
};

export default EmployeesPage;

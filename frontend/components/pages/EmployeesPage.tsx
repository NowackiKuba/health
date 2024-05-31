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
  Settings,
} from 'lucide-react';
import CreateEmployeeDialog from '../dialogs/CreateEmployeeDialog';
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
import { useQuery } from '@tanstack/react-query';
import { getClinicEmployees } from '@/actions/clinic.actions';

const EmployeesPage = () => {
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const { data, isLoading } = useQuery({
    queryKey: ['getClinicEmployees'],
    queryFn: async () => await getClinicEmployees(),
  });
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-3xl font-semibold'>Employees</p>
        <div className='flex items-center justify-center gap-2'>
          <Button
            className='flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Create Employee Account</p>
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
      <div className='flex items-center w-full gap-2 flex-wrap'>
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
                          //   onClick={() => {
                          //     setSelectedPatientId(patient.id);
                          //     setIsOpenEdit(true);
                          //   }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <Edit className='h-4 w-4' />
                          <p>Edit Employee</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          //   onClick={() => {
                          //     setSelectedPatientId(patient.id);
                          //     setIsOpenDetails(true);
                          //   }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <Eye className='h-4 w-4' />
                          <p>See Details</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          //   onClick={() => {
                          //     setSelectedPatientId(patient.id);
                          //     // setIsOpenDetails(true);
                          //     setClinicDoctors(
                          //       user?.clinic?.employees.filter(
                          //         (employee) =>
                          //           employee.role.toString().toLowerCase() ===
                          //           'doctor'
                          //       ) || []
                          //     );
                          //   }}
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                        >
                          <CalendarPlus className='h-4 w-4' />
                          <p>Create Appointment</p>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='flex cursor-pointer hover:text-current items-center gap-2 text-sm text-red-500'
                          //   onClick={() =>
                          //     deletePatientMutation({ patientId: patient.id })
                          //   }
                          //   disabled={isDeleting}
                        >
                          {/* {isDeleting ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Trash className='h-4 w-4' />
                          )} */}
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
      </div>
      <CreateEmployeeDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default EmployeesPage;

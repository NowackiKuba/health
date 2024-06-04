'use client';
import React from 'react';
import Searchbar from '../Searchbar';
import QuerySelector from '../QuerySelector';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deletePrescription,
  getClinicPrescriptions,
} from '@/actions/prescription.action';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  ReceiptText,
  Settings,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '../ui/use-toast';
import { FcExport, FcImport } from 'react-icons/fc';

const PrescriptionsPage = () => {
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['getClinicPrescriptions'],
    queryFn: async () => await getClinicPrescriptions(),
  });

  const queryClient = useQueryClient();
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationKey: ['deletePrescription'],
    mutationFn: deletePrescription,
    onSuccess: () => {
      toast({
        title: 'Successfully deleted prescription',
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ['getClinicPrescriptions'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to delete prescription',
        duration: 1500,
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return;
  }
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Prescriptions</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant={'primary-outline'}
              className='flex items-center gap-2'
            >
              <p>Actions</p>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
              <FcImport className='h-4 w-4' />
              <p>Import to CSV</p>
            </DropdownMenuItem>
            <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
              <FcExport className='h-4 w-4' />
              <p>Export from CSV</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex md:flex-row flex-col items-center w-full gap-2'>
        <Searchbar
          otherClasses='xl:max-w-[400px]'
          route='/dashboard/prescriptions'
          iconPosition='left'
          placeholder='Search for Prescriptions...'
        />
        <QuerySelector
          placeholder='Sort'
          queryKey='sort'
          options={[
            { key: 'newest', value: 'Newset' },
            { key: 'oldest', value: 'Oldest' },
          ]}
          otherClasses='xl:max-w-[220px]'
        />
      </div>
      <div className='w-full md:flex hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='max-w-[150px]'>ID</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Issued By</TableHead>
              <TableHead>Issued For</TableHead>
              <TableHead className='text-end'>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className='max-w-[150px] truncate'>{p.id}</TableCell>
                <TableCell>
                  {format(p.createdAt, 'dd.MM.yyyy, HH:mm')}
                </TableCell>
                <TableCell>
                  {p.employee.firstName} {p.employee.lastName}
                </TableCell>
                <TableCell>
                  {p.patient.firstName} {p.patient.lastName}
                </TableCell>
                <TableCell className='justify-end flex'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={'icon'} variant={'primary-outline'}>
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className='cursor-pointer'>
                        <Link
                          className='flex  items-center gap-2'
                          href={p.pdfLinkUrl}
                          target='_blank'
                        >
                          <ExternalLink className='h-4 w-4' />
                          <p>See Prescription</p>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='cursor-pointer flex items-center gap-2 text-red-500'
                        onClick={() => handleDelete({ id: p.id })}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Trash className='h-4 w-4' />
                        )}
                        <p>Delete Prescription</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex md:hidden sm:flex-row flex-col items-center gap-2'>
        {prescriptions?.map((p, index) => (
          <Link
            href={p.pdfLinkUrl}
            target='_blank'
            key={p.id}
            className='w-full sm:w-[calc(50%-4px)] p-2 bg-secondary rounded-xl flex items-center justify-between'
          >
            <div className='flex items-center gap-2'>
              <div className='rounded-md h-16 w-16 flex items-center justify-center bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-200'>
                <ReceiptText className='h-8 w-8' />
              </div>
              <div className='flex flex-col h-16 justify-between'>
                <p className='text-sm font-semibold'>
                  #{index + 1} Prescription
                </p>

                <p className='text-xs dark:text-gray-600 text-gray-400'>
                  Issued By:{' '}
                  <span className='font-[500]'>
                    {p.employee.firstName} {p.employee.lastName}
                  </span>
                </p>
                <p className='text-xs dark:text-gray-600 text-gray-400'>
                  Issued At:{' '}
                  <span className='font-[500]'>
                    {format(p.createdAt, 'dd.MM.yyyy')}
                  </span>
                </p>
                <p className='text-xs dark:text-gray-600 text-gray-400'>
                  Issued For:{' '}
                  <span className='font-[500]'>
                    {p.patient.firstName} {p.patient.lastName}
                  </span>
                </p>
              </div>
            </div>
            <ChevronRight className='h-6 w-6' />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsPage;

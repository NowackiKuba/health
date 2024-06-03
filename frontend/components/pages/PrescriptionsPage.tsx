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
import { ExternalLink, Loader2, Settings, Trash } from 'lucide-react';
import Link from 'next/link';
import { toast } from '../ui/use-toast';

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
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Prescriptions</p>
      </div>
      <div className='flex items-center w-full gap-2'>
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
      <div className='w-full'>
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
    </div>
  );
};

export default PrescriptionsPage;

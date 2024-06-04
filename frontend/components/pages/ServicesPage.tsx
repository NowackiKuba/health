'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronDown,
  CirclePlus,
  Edit,
  Eye,
  Loader2,
  Settings,
  Trash,
} from 'lucide-react';
import CreateServiceDialog from '../dialogs/CreateServiceDialog';
import { useServices } from '@/hooks/useServices';
import ServiceCard from '../cards/ServiceCard';
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
import EditServiceDialog from '../dialogs/EditServiceDialog';
import { useMutation } from '@tanstack/react-query';
import { deleteService } from '@/actions/service.actions';
import { toast } from '../ui/use-toast';
import { FcExport, FcImport } from 'react-icons/fc';

const ServicesPage = () => {
  const { services } = useServices();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<TService | null>(null);

  const { mutate: deleteServiceMutation, isPending: isDeleting } = useMutation({
    mutationKey: ['deleteService'],
    mutationFn: deleteService,
    onSuccess: () => {
      toast({
        title: 'Successfully delete service',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to delete service',
        duration: 1500,
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-semibold'>Services</p>
        <div className='flex items-center gap-2'>
          <Button
            className='hidden sm:flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Add Service</p>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'primary-outline'}
                className='hidden sm:flex items-center gap-2'
              >
                <p>Actions</p>
                <ChevronDown className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className='sm:hidden flex items-center gap-2 cursor-pointer'>
                <CirclePlus className='h-5 w-5' />
                <p>Create Service</p>
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
      <div className='w-full'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Est. Duration</TableHead>
              <TableHead>Specialists</TableHead>
              <TableHead className='text-end'>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service?.name}</TableCell>
                <TableCell>{service?.price} PLN</TableCell>
                <TableCell>{service?.duration} minutes</TableCell>
                <TableCell>
                  {service?.employees.length}{' '}
                  {service?.employees.length === 1
                    ? 'specialist'
                    : 'specialists'}
                </TableCell>
                <TableCell className='flex justify-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'primary-outline'} size={'icon'}>
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                        <Eye className='h-4 w-4' />
                        <p>See Details</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsOpenEdit(true);
                          setSelectedService(service);
                        }}
                        className='flex items-center gap-2 cursor-pointer'
                      >
                        <Edit className='h-4 w-4' />
                        <p>Edit Service</p>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          deleteServiceMutation({ serviceId: service.id });
                        }}
                        className='flex items-center gap-2 text-red-500 cursor-pointer'
                      >
                        {isDeleting ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Trash className='h-4 w-4' />
                        )}
                        <p>Delete Service</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* <div className='flex items-center flex-wrap gap-4'>
        {services?.map((service) => (
          <ServiceCard service={service} key={service.id} />
        ))}
      </div> */}
      <CreateServiceDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
      <EditServiceDialog
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        service={selectedService!}
      />
    </div>
  );
};

export default ServicesPage;

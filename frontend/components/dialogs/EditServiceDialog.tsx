'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import useClinic from '@/hooks/useClinic';
import { Check, Trash } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import ButtonLoading from '../ButtonLoading';
import { useMutation } from '@tanstack/react-query';
import { editService } from '@/actions/service.actions';
import { toast } from '../ui/use-toast';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  service: TService;
}

const EditServiceDialog = ({ service, open, setOpen }: Props) => {
  const { clinic } = useClinic();
  const [name, setName] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [selectedEmployees, setSelectedEmployees] = useState<TEmployee[]>([]);

  const { mutate: editServiceMutation, isPending: isEditing } = useMutation({
    mutationKey: ['editService'],
    mutationFn: editService,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Successfully edited service',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to edit service',
        duration: 1500,
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!service) return;

    setName(service.name);
    setDuration(service.duration);
    setPrice(service.price);
    setDescription(service.description || '');
    setSelectedEmployees(service.employees);
  }, [service]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full xl:max-h-[750px] overflow-y-auto'>
        <p className='text-xl font-semibold'>Add Service</p>
        <div className='flex flex-col w-full gap-0.5'>
          <Label>Name</Label>
          <Input
            onChange={(e) => setName(e.target.value)}
            defaultValue={name}
          />
        </div>
        <div className='flex flex-col w-full gap-0.5'>
          <Label>Estimated Duration</Label>
          <Input
            onChange={(e) => setDuration(+e.target.value)}
            defaultValue={duration}
          />
        </div>
        <div className='flex flex-col w-full gap-0.5'>
          <Label>Price</Label>
          <Input
            onChange={(e) => setPrice(+e.target.value)}
            defaultValue={price}
          />
        </div>

        <div className='flex flex-col w-full gap-0.5'>
          <Label>Employees</Label>
          <Command
            className='bg-secondary'
            defaultValue={selectedEmployees.map((se) => se.id)}
          >
            <CommandInput placeholder='Search for employees' />
            <CommandList defaultChecked={false}>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading='Employees'>
                {clinic?.employees?.map((employee) => (
                  <CommandItem
                    disabled={false}
                    key={employee?.id}
                    onSelect={() => {
                      if (selectedEmployees.includes(employee)) {
                        setSelectedEmployees(
                          selectedEmployees.filter(
                            (emp) => emp.id !== employee.id
                          )
                        );
                      } else {
                        setSelectedEmployees((prev) => [...prev, employee]);
                      }
                    }}
                    className='flex items-center gap-2'
                  >
                    <p>
                      {employee?.firstName} {employee?.lastName}
                    </p>
                    {selectedEmployees?.includes(employee) && (
                      <Check className='h-4 w-4' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className='flex items-center flex-wrap gap-1'>
            {selectedEmployees?.map((employee) => (
              <div
                className='bg-secondary py-1 px-2 gap-3  text-xs flex justify-between'
                key={employee.id}
              >
                <p>
                  {employee?.firstName} {employee?.lastName}
                </p>
                <Trash
                  className='h-4 w-4 text-red-500 cursor-pointer'
                  onClick={() => {
                    setSelectedEmployees(
                      selectedEmployees.filter((emp) => emp.id !== employee.id)
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col w-full gap-0.5'>
          <Label>Description</Label>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            defaultValue={description}
          />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            variant={'primary-outline'}
            className='w-full'
            onClick={() => setOpen(false)}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            disabled={isEditing}
            onClick={() => {
              editServiceMutation({
                serviceId: service.id,
                description,
                duration,
                employeesIds: selectedEmployees.map((emp) => emp.id),
                name,
                price,
              });
            }}
          >
            <ButtonLoading isLoading={isEditing} buttonText='Edit' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;

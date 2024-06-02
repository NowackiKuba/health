import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import useClinic from '@/hooks/useClinic';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Check, Trash } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { createService } from '@/actions/service.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateServiceDialog = ({ open, setOpen }: Props) => {
  const { clinic } = useClinic();
  const [name, setName] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [selectedEmployees, setSelectedEmployees] = useState<TEmployee[]>([]);

  const { mutate: createServiceMutation, isPending: isCreating } = useMutation({
    mutationKey: ['createService'],
    mutationFn: createService,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Successfully created service',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to create service',
        duration: 1500,
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });
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
          <Input onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='flex flex-col w-full gap-0.5'>
          <Label>Estimated Duration</Label>
          <Input onChange={(e) => setDuration(+e.target.value)} />
        </div>
        <div className='flex flex-col w-full gap-0.5'>
          <Label>Price</Label>
          <Input onChange={(e) => setPrice(+e.target.value)} />
        </div>

        <div className='flex flex-col w-full gap-0.5'>
          <Label>Employees</Label>
          <Command>
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
          <Textarea onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            variant={'primary-outline'}
            className='w-full'
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            disabled={isCreating}
            onClick={() => {
              createServiceMutation({
                clinicId: clinic?.id!,
                description,
                duration,
                employeesIds: selectedEmployees.map((emp) => emp.id),
                name,
                price,
              });
            }}
          >
            <ButtonLoading isLoading={isCreating} buttonText='Create' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServiceDialog;

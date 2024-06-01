'use client';
import useClinic from '@/hooks/useClinic';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/actions/task.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  employeeId?: string;
}

const CreateTaskDialog = ({ open, setOpen, employeeId }: Props) => {
  const { clinic } = useClinic();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [deadLine, setDeadLine] = useState<Date>();
  const [priority, setPriority] = useState<string>('');
  const [assignedToId, setAssignedToId] = useState<string>(
    employeeId ? employeeId : ''
  );
  const queryClient = useQueryClient();
  const { mutate: createTaskMutation, isPending: isCreating } = useMutation({
    mutationKey: ['createTask'],
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getTasks'],
        refetchType: 'all',
      });
      toast({
        title: 'Successfully created task',
        duration: 1500,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error creating task',
        description: 'An error occurred while creating task',
        variant: 'destructive',
        duration: 1500,
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
      <DialogContent className='flex flex-col gap-3 w-full'>
        <p className='text-xl font-semibold'>Create Task</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Title</Label>
          <Input onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Description</Label>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className='resize-none'
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !deadLine && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {deadLine ? format(deadLine, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={deadLine}
                onSelect={setDeadLine}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Priority</Label>
          <Select onValueChange={(e) => setPriority(e)}>
            <SelectTrigger>
              <SelectValue placeholder='Select priority' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='3'>High</SelectItem>
              <SelectItem value='2'>Medium</SelectItem>
              <SelectItem value='1'>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Employee</Label>
          <Select onValueChange={(e) => setAssignedToId(e)}>
            <SelectTrigger>
              <SelectValue placeholder='Select Employee' />
            </SelectTrigger>
            <SelectContent>
              {clinic?.employees?.map((employee) => (
                <SelectItem key={employee?.id} value={employee?.id}>
                  {employee?.firstName} {employee?.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            className='w-full'
            variant={'primary-outline'}
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Anuluj
          </Button>
          <Button
            className='w-full'
            disabled={isCreating}
            onClick={() => {
              createTaskMutation({
                assignedToId,
                deadLine: deadLine!,
                description,
                priority: parseInt(priority),
                title,
                clinicId: clinic?.id!,
              });
            }}
          >
            <ButtonLoading buttonText='Create' isLoading={isCreating} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;

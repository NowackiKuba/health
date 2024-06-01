import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import useClinic from '@/hooks/useClinic';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { editTask } from '@/actions/task.actions';
import { toast } from '../ui/use-toast';
import ButtonLoading from '../ButtonLoading';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  task: TTask;
}
const EditTaskDialog = ({ open, setOpen, task }: Props) => {
  const { clinic } = useClinic();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [deadLine, setDeadLine] = useState<Date>();
  const [priority, setPriority] = useState<string>('');
  const [assignedToId, setAssignedToId] = useState<string>();
  const { mutate: editTaskMutation, isPending: isEditing } = useMutation({
    mutationKey: ['editTask'],
    mutationFn: editTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getTasks'],
        refetchType: 'all',
      });
      toast({
        title: 'Successfully edited task',
        duration: 1500,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error editing task',
        description: 'An error occurred while editing task',
        variant: 'destructive',
        duration: 1500,
      });
    },
  });

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description);
    setDeadLine(task.deadLine);
    setPriority(task.priority.toString());
    setAssignedToId(task.assignedToId);
  }, [task]);
  const queryClient = useQueryClient();
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
          <Input
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={title}
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Description</Label>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className='resize-none'
            defaultValue={description}
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
          <Select defaultValue={priority} onValueChange={(e) => setPriority(e)}>
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
          <Select
            defaultValue={assignedToId}
            onValueChange={(e) => setAssignedToId(e)}
          >
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
            disabled={isEditing}
          >
            Anuluj
          </Button>
          <Button
            className='w-full'
            disabled={isEditing}
            onClick={() => {
              editTaskMutation({
                assignedToId: assignedToId!,
                deadLine: deadLine!,
                description,
                priority: parseInt(priority),
                title,
                taskId: task?.id!,
              });
            }}
          >
            <ButtonLoading buttonText='Edit' isLoading={isEditing} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;

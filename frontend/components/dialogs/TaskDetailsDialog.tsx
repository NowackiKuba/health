'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { getPriorityData } from '@/utils';
import { format, formatDistance } from 'date-fns';
import { Button } from '../ui/button';
import { Check, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markTaskAsDone } from '@/actions/task.actions';
import { toast } from '../ui/use-toast';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  task: TTask;
}

const TaskDetailsDialog = ({ open, setOpen, task }: Props) => {
  const { bg, icon, text, textColor } = getPriorityData(task?.priority);
  const Icon = icon;
  const queryClient = useQueryClient();
  const { mutate: markTaskAsDoneMutation, isPending: isMarking } = useMutation({
    mutationKey: ['markTaskAsDone'],
    mutationFn: markTaskAsDone,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getTasks'],
        refetchType: 'all',
      });
      toast({
        title: 'Successfully marked task as done',
        duration: 1500,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error marking task as done',
        description: 'Please try again later',
        duration: 1500,
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
      <DialogContent className='flex flex-col gap-3 w-full'>
        <div className='flex flex-col gap-2 w-full rounded-xl px-4 py-2'>
          <div className='flex items-start w-full justify-between'>
            <div
              className={`${bg} flex items-center justify-center rounded-full h-24 w-24`}
            >
              <Icon className='h-12 w-12' />
            </div>
            <div className={`px-3 py-1 rounded-md text-sm ${bg} ${textColor}`}>
              {text} Priority
            </div>
          </div>
          <p className='text-2xl font-semibold'>{task?.title}</p>
          <div className='flex flex-col gap-1 w-full mt-2'>
            {task?.deadLine && (
              <div className='flex items-center gap-2 w-full'>
                <p className='font-[500]'>Deadline: </p>
                <p>
                  {format(task?.deadLine, 'dd.MM.yyyy')},{' '}
                  <span className='text-sm text-gray-400 dark:text-gray-600'>
                    ({formatDistance(task?.deadLine, new Date())})
                  </span>
                </p>
              </div>
            )}
            <div className='flex items-center gap-2 w-full'>
              <p className='font-[500]'>Assigned To: </p>
              <p>
                {task?.assignedTo?.firstName} {task?.assignedTo?.lastName}
              </p>
            </div>
            <div className='flex items-center gap-2 w-full'>
              <p className='font-[500]'>Completed: </p>
              <p className={task?.done ? 'text-green-500' : 'text-red-500'}>
                {task?.done ? 'Yes' : 'No'}
              </p>
              {!task?.done && (
                <TooltipProvider>
                  <Tooltip delayDuration={0} defaultOpen={false}>
                    <TooltipTrigger asChild>
                      <button
                        className='duration-100 ease-linear transition-all p-2 rounded-md hover:bg-primary/10 dark:hover:bg-green-500/20 dark:hover:text-green-200 hover:text-primary'
                        disabled={isMarking}
                        onClick={() => {
                          markTaskAsDoneMutation({
                            taskId: task?.id!,
                          });
                        }}
                      >
                        {isMarking ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Check className='h-4 w-4' />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Mark as Done</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;

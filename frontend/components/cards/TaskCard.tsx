import { getPriorityData } from '@/utils';
import { format, formatDistance } from 'date-fns';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { Check, Eye, Loader2, Trash } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Mutation, UseMutateFunction } from '@tanstack/react-query';

const TaskCard = ({
  task,
  handleDelete,
  isDeleting,
  setOpenDetails,
  setSelectedTask,
}: {
  task: TTask;
  isDeleting: boolean;
  handleDelete: UseMutateFunction<any, Error, { taskId: string }>;
  setOpenDetails: Dispatch<SetStateAction<boolean>>;
  setSelectedTask: Dispatch<SetStateAction<TTask | undefined>>;
}) => {
  const { bg, icon, text, textColor } = getPriorityData(task?.priority);
  const Icon = icon;
  return (
    <div className='w-full md:w-[334px] pt-3 pb-2 rounded-xl bg-secondary flex flex-col gap-2 px-2'>
      <div
        className={`h-20 w-20 rounded-full ${bg} flex items-center justify-center`}
      >
        <Icon className='h-10 w-10' />
      </div>
      <div className='flex items-center justify-between w-full'>
        <p className='text-xl font-semibold'>{task?.title}</p>
        <div className={`px-1 py-0.5 rounded-sm ${textColor} ${bg} text-xs `}>
          {text} Priority
        </div>
      </div>
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
        </div>
      </div>
      <div className='flex items-center gap-3 w-full'>
        <Button
          variant={'primary-outline'}
          className='w-full flex items-center gap-2'
          onClick={() => {
            setSelectedTask(task);
            setOpenDetails(true);
          }}
        >
          <Eye />
          <p>Details</p>
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={'icon'}
                variant={'destructive-ghost'}
                className='px-2'
                onClick={() => handleDelete({ taskId: task.id })}
              >
                {isDeleting ? <Loader2 className='animate-spin' /> : <Trash />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Task</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TaskCard;

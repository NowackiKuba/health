'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronDown,
  CirclePlus,
  Edit,
  Eye,
  Ghost,
  LayoutGrid,
  List,
  Loader2,
  Settings,
  Trash,
} from 'lucide-react';
import Searchbar from '../Searchbar';
import QuerySelector from '../QuerySelector';
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
import CreateTaskDialog from '../dialogs/CreateTaskDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTask, getTasks } from '@/actions/task.actions';
import { format } from 'date-fns';
import { getPriorityData } from '@/utils';
import EditTaskDialog from '../dialogs/EditTaskDialog';
import TaskDetailsDialog from '../dialogs/TaskDetailsDialog';
import TaskCard from '../cards/TaskCard';
import { toast } from '../ui/use-toast';

const TasksPage = () => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['getTasks'],
    queryFn: async () => await getTasks(),
  });
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TTask>();
  const queryClient = useQueryClient();
  const { mutate: deleteTaskMutation, isPending: isDeleting } = useMutation({
    mutationKey: ['deleteTask'],
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({
        title: 'Successfully deleted task',
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ['getTasks'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast({
        title: 'Error deleting task',
        description: 'An error occurred while deleting task',
        variant: 'destructive',
        duration: 1500,
      });
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-semibold'>Tasks</p>
        <div className='flex items-center gap-2'>
          <Button
            className='flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus className='h-5 w-5' />
            <p>Create Task</p>
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
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 w-full'>
          <Searchbar
            route='/dashboard/tasks'
            placeholder='Search for tasks'
            iconPosition='left'
            otherClasses='xl:max-w-[400px]'
          />
          <QuerySelector
            placeholder='Filter'
            queryKey='filter'
            options={[
              { key: 'high', value: 'High Priority' },
              { key: 'medium', value: 'Medium Priority' },
              { key: 'low', value: 'Low Priority' },
            ]}
            otherClasses='xl:max-w-[220px]'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant={view === 'list' ? 'default' : 'primary-outline'}
            onClick={() => setView('list')}
            size={'icon'}
          >
            <List className='h-5 w-5' />
          </Button>
          <Button
            variant={view === 'grid' ? 'default' : 'primary-outline'}
            onClick={() => setView('grid')}
            size={'icon'}
          >
            <LayoutGrid className='h-5 w-5' />
          </Button>
        </div>
      </div>
      {!tasks || tasks?.length === 0 ? (
        <div className='flex flex-col items-center justify-center mt-12 gap-2'>
          <Ghost className='h-20 w-20 text-gray-400 dark:text-gray-' />
          <p className='font-semibold text-gray-400 dark:text-gray-600'>
            No Tasks
          </p>
        </div>
      ) : (
        <div className='w-full'>
          {view === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className='text-end'>Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks?.map((task) => {
                  const { bg, icon, text, textColor } = getPriorityData(
                    task.priority
                  );
                  const Icon = icon;
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Icon className='h-8 w-8' />
                      </TableCell>
                      <TableCell>{task?.title}</TableCell>
                      <TableCell>{task?.description}</TableCell>
                      <TableCell className='first-letter:uppercase'>
                        {format(task?.deadLine, 'dd.MM.yyyy')}
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
                              onClick={() => {
                                setSelectedTask(task);
                                setIsOpenEdit(true);
                              }}
                              className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                            >
                              <Edit className='h-4 w-4' />
                              <p>Edit Task</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTask(task);
                                setIsOpenDetails(true);
                              }}
                              className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                            >
                              <Eye className='h-4 w-4' />
                              <p>See Details</p>
                            </DropdownMenuItem>
                            {/* {employee?.role?.toString().toLowerCase() ==
                            'doctor' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setIsOpenCreateAppointment(true);

                                setSelectedDoctorId(employee.id);
                              }}
                              className='flex cursor-pointer hover:text-current items-center gap-2 text-sm'
                            >
                              <CalendarPlus className='h-4 w-4' />
                              <p>Create Appointment</p>
                            </DropdownMenuItem>
                          )} */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='flex cursor-pointer hover:text-current items-center gap-2 text-sm text-red-500'
                              onClick={() =>
                                deleteTaskMutation({
                                  taskId: task.id,
                                })
                              }
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                              ) : (
                                <Trash className='h-4 w-4' />
                              )}

                              <p>Delete Task</p>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className='flex items-center gap-4 w-full flex-wrap'>
              {tasks?.map((task) => (
                <>
                  <TaskCard
                    key={task.id}
                    task={task}
                    handleDelete={deleteTaskMutation}
                    isDeleting={isDeleting}
                    setOpenDetails={setIsOpenDetails}
                    setSelectedTask={setSelectedTask}
                  />
                </>
              ))}
            </div>
          )}
        </div>
      )}
      <CreateTaskDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
      <EditTaskDialog
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        task={selectedTask!}
      />
      <TaskDetailsDialog
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        task={selectedTask!}
      />
    </div>
  );
};

export default TasksPage;

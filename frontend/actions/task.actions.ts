'use server';

import axios from 'axios';
import { getCurrentClinic } from './clinic.actions';
import { getCurrentUser } from './user.actions';

export const createTask = async ({
  title,
  description,
  deadLine,
  priority,
  assignedToId,
  clinicId,
}: {
  title: string;
  description: string;
  deadLine: Date;
  priority: number;
  assignedToId: string;
  clinicId: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/task/create', {
    title,
    description,
    deadLine,
    priority,
    assignedToId,
    clinicId,
  });

  return res.data;
};

export const getTasks = async (): Promise<TTask[]> => {
  const data = await getCurrentUser();
  const res = await axios.get(
    `http://localhost:8080/api/task/get-tasks/${data?.user?.clinicId}`
  );

  return res.data.tasks;
};

export const editTask = async ({
  title,
  description,
  deadLine,
  priority,
  assignedToId,
  taskId,
}: {
  title: string;
  description: string;
  deadLine: Date;
  priority: number;
  assignedToId: string;
  taskId: string;
}) => {
  const res = await axios.post('http://localhost:8080/api/task/edit', {
    title,
    description,
    deadLine,
    priority,
    assignedToId,
    taskId,
  });

  return res.data;
};

export const deleteTask = async ({ taskId }: { taskId: string }) => {
  const res = await axios.delete(
    `http://localhost:8080/api/task/delete/${taskId}`
  );
  return res.data;
};

export const markTaskAsDone = async ({ taskId }: { taskId: string }) => {
  const res = await axios.post('http://localhost:8080/api/task/mark-as-done', {
    taskId,
  });

  return res.data;
};

import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import { connect } from 'http2';

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, deadLine, priority, assignedToId, clinicId } =
      req.body;

    const createdTask = await db.task.create({
      data: {
        title,
        description,
        deadLine,
        priority,
        assignedTo: {
          connect: {
            id: assignedToId,
          },
        },
        clinic: {
          connect: {
            id: clinicId,
          },
        },
      },
    });

    return res.status(200).json({ createdTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const { filter } = req.query;

    let filterOptions = {};

    if (filter) {
      switch (filter) {
        case 'high':
          filterOptions = {
            priority: 3,
          };
          break;
        case 'medium':
          filterOptions = {
            priority: 2,
          };
          break;
        case 'low':
          filterOptions = {
            priority: 1,
          };
          break;
      }
    }

    const tasks = await db.task.findMany({
      where: {
        clinicId,
        ...filterOptions,
      },
      include: {
        assignedTo: true,
      },
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const editTask: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, priority, deadline, assignedToId, taskId } =
      req.body;

    const task = await db.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await db.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        assignedTo: {
          connect: {
            id: assignedToId,
          },
        },
        deadLine: deadline,
        description,
        priority,
      },
    });

    return res.status(200).json({ updatedTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await db.task.delete({
      where: {
        id: taskId,
      },
    });

    return res.status(200).json({ deletedTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const markTaskAsDone: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.body;

    const updatedTask = await db.task.update({
      where: {
        id: taskId,
      },
      data: {
        done: true,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({ updatedTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

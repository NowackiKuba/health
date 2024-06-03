import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

export const createEmployeeAccount: RequestHandler = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      clinicId,
      phone,
      room,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await db.employee.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        room,
        role: role as Role,
        clinic: {
          connect: {
            id: clinicId,
          },
        },
        phone,
      },
    });

    return res.status(200).json({ employee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getEmployeeById: RequestHandler = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const employee = await db.employee.findFirst({
      where: {
        id: employeeId,
      },
      include: {
        appointments: {
          include: {
            patient: true,
          },
        },
      },
    });

    return res.status(200).json({ employee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const editEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, phone, employeeId, imgUrl } =
      req.body;

    if (!firstName || !lastName || !email || !role || !phone || !employeeId) {
      return res.status(400).json({ message: 'missing data' });
    }

    const employeeExists = await db.employee.findFirst({
      where: {
        id: employeeId,
      },
    });

    if (!employeeExists) {
      return res.status(404).json({ message: 'employee not found' });
    }

    const employee = await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        firstName,
        lastName,
        email,
        role: role as Role,
        phone,
        imgUrl,
      },
    });

    return res.status(200).json({ employee });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteEmployee: RequestHandler = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const deletedEmployeee = await db.employee.delete({
      where: {
        id: employeeId,
      },
    });

    return res.status(200).json({ deletedEmployeee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateEmployeeData: RequestHandler = async (req, res, next) => {
  try {
    const { employeeId, firstName, lastName, email, phone } = req.body;

    if (!employeeId || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: 'missing data' });
    }

    const employee = await db.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'employee not found' });
    }

    const updatedEmployee = await db.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    return res.status(200).json({ updatedEmployee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

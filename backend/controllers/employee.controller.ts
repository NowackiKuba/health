import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

export const createEmployeeAccount: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, clinicId, phone } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await db.employee.create({
      data: {
        firstName,
        lastName,
        email,
        password,
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

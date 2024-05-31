import { RequestHandler } from 'express';
import { db } from '../db/prisma';

export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await db.employee.findFirst({
      where: {
        id,
      },
      include: {
        clinic: true,
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

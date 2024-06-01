import { RequestHandler } from 'express';
import { db } from '../db/prisma';

export const getCurrentUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await db.employee.findUnique({
      where: {
        id: userId,
      },
      include: {
        clinic: true,
        appointments: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

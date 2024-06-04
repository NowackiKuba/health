import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import jwt from 'jsonwebtoken';

export const validateCredentials: RequestHandler = async (req, res, next) => {
  const token = req.headers;

  if (!token.authorization) {
    return res.status(401).json({ message: 'Unauthorized', token: token });
  }

  const decoded = jwt.decode(token.authorization?.toString());
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized', token: token });
  }
  // @ts-ignore
  const { id } = decoded;

  const user = await db.employee.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized', token: 'token' });
  }

  next();
};

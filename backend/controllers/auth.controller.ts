import { RequestHandler } from 'express';
import { db } from '../db/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import CryptoJS from 'crypto-js';

export const createClinicAccount: RequestHandler = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      address,
      city,
      state,
      zip,
      phone,
      userEmail,
      userFirstName,
      userLastName,
      userPhone,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await db.clinic.create({
      data: {
        name,
        email,
        address,
        city,
        state,
        zip,
        phone,
        employees: {
          create: {
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            phone,
            role: Role.ADMIN,
            password: hashedPassword,
          },
        },
      },
    });

    return res.status(201).json(company);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logInUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.employee.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const decodePesel: RequestHandler = async (req, res, next) => {
  try {
    const { pesel } = req.body;
    const decryptedPesel = CryptoJS.AES.decrypt(
      pesel,
      process.env.ENCRYPTION_KEY!
    );

    return res
      .status(200)
      .json({ pesel: decryptedPesel.toString(CryptoJS.enc.Utf8) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

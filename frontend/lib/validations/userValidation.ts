import { z } from 'zod';

const userValidation = z.object({
  firstName: z
    .string()
    .min(3, { message: 'First name must be at least 3 characters long' }),
  lastName: z
    .string()
    .min(3, { message: 'Last name must be at least 3 characters long' }),
  userEmail: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  phoneNum: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters long' }),
});

export default userValidation;

import { z } from 'zod';

const clinicValidation = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  address: z
    .string()
    .min(3, { message: 'Address must be at least 3 characters long' }),
  city: z
    .string()
    .min(3, { message: 'City must be at least 3 characters long' }),
  state: z
    .string()
    .min(3, { message: 'State must be at least 3 characters long' }),
  zip: z.string().min(3, { message: 'Zip must be at least 3 characters long' }),
  phone: z
    .string()
    .min(3, { message: 'Phone must be at least 3 characters long' }),
});

export default clinicValidation;

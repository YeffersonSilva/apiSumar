import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters long')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password cannot exceed 100 characters'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

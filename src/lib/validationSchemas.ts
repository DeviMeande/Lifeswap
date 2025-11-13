import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
  userName: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore, and hyphen'),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

export const lifeBlockSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  category: z.string().min(1, 'Category is required').max(100, 'Category must be less than 100 characters'),
  duration: z.string().min(1, 'Duration is required').max(100, 'Duration must be less than 100 characters'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  description: z.string().trim().max(2000, 'Description must be less than 2000 characters'),
});

export const goalSchema = z.string().trim().min(1, 'Goal cannot be empty').max(500, 'Goal must be less than 500 characters');

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(200, 'Task title must be less than 200 characters'),
  description: z.string().trim().max(1000, 'Task description must be less than 1000 characters'),
  duration: z.string().max(100, 'Duration must be less than 100 characters'),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  userName: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore, and hyphen'),
});

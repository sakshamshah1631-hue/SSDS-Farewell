import { z } from 'zod';

export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be under 80 characters'),
  customer_phone: z
    .string()
    .regex(/^[0-9+\s\-()]{10,16}$/, 'Please enter a valid contact phone number (10 digits)'),
  customer_address: z
    .string()
    .min(10, 'Please provide a full delivery address including city and pincode')
    .max(300, 'Address is too long'),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
        image_url: z.string().optional(),
        color: z.string().optional(),
        fragrance: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .min(1, 'Your cart is empty'),
  total_inr: z.number().positive('Order total must be greater than zero'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(120),
});

export const passwordResetSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(64, 'Password must be under 64 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(5, 'Description is required').max(1000),
  category: z.enum(['single', 'blend']),
  image_url: z.string().min(1, 'Product image is required').refine(
    (val) => val.startsWith('data:image/') || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    'A valid image URL or uploaded image is required'
  ),
  price_inr: z.number().nullable(),
  sale_price_inr: z.number().nullable(),
  size_label: z.string().nullable(),
  weight_grams: z.number().int().positive().nullable(),
  fragrance: z.string().nullable(),
  stock_quantity: z.number().int().nonnegative(),
  is_featured: z.boolean(),
  is_bestseller: z.boolean(),
  is_published: z.boolean(),
});

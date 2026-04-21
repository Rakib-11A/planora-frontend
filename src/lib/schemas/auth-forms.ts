import { z } from 'zod';

const emailField = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .email({ message: 'Enter a valid email address' });

const strongPassword = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, { message: 'Password must include an uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must include a lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must include a number' });

const otpField = z
  .string({ required_error: 'OTP is required' })
  .regex(/^\d{6}$/, { message: 'OTP must be 6 digits' });

export const forgotPasswordFormSchema = z.object({
  email: emailField,
});

export const verifyEmailFormSchema = z.object({
  email: emailField,
  otp: otpField,
});

export const resendOtpFormSchema = z.object({
  email: emailField,
});

export const resetPasswordFormSchema = z
  .object({
    email: emailField,
    otp: otpField,
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .strict()
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const updateProfileFormSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be at most 50 characters' }),
    avatar: z
      .string()
      .trim()
      .max(2048, { message: 'Avatar URL is too long' })
      .url({ message: 'Avatar must be a valid URL' })
      .or(z.literal(''))
      .optional(),
  })
  .strict();

export type UpdateProfileFormValues = z.infer<typeof updateProfileFormSchema>;

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .strict()
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailFormSchema>;
export type ResendOtpFormValues = z.infer<typeof resendOtpFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

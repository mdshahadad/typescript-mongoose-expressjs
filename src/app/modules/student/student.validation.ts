import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First Name is Required' })
    .max(20, { message: 'First Name can not be more than 20 characters' })
    .regex(/^[A-Z][a-z]*$/, {
      message: 'First Name must be in capitalize format',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last Name is Required' })
    .regex(/^[a-zA-Z]+$/, { message: 'Last Name is not valid' }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().trim().min(1, { message: 'Father Name is Required' }),
  fatherOccupation: z
    .string()
    .trim()
    .min(1, { message: 'Father Occupation is Required' }),
  fatherContactNo: z
    .string()
    .trim()
    .min(1, { message: 'Father Contact Number is Required' }),
  motherName: z.string().trim().min(1, { message: 'Mother Name is Required' }),
  motherOccupation: z
    .string()
    .trim()
    .min(1, { message: 'Mother Occupation is Required' }),
  motherContactNo: z
    .string()
    .trim()
    .min(1, { message: 'Mother Contact Number is Required' }),
});

const localGuardianValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Name is Required' }),
  occupation: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Occupation is Required' }),
  contactNo: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Contact Number is Required' }),
  address: z
    .string()
    .trim()
    .min(1, { message: 'Local Guardian Address is Required' }),
});

const studentValidationSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, { message: 'Student ID is Required' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Student ID should be alphanumeric' }),
  password: z.string(),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is Required' })
    .email({ message: 'Email is not valid' }),
  contactNo: z.string().trim(),
  emergencyContactNo: z.string().trim().optional(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z
    .string()
    .trim()
    .min(1, { message: 'Present Address is Required' }),
  permanentAddress: z
    .string()
    .trim()
    .min(1, { message: 'Permanent Address is Required' }),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().trim().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean(),
});

export default studentValidationSchema;

import Joi from 'joi';

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .max(20)
    .regex(/^[A-Z][a-z]*$/),
  middleName: Joi.string().trim().allow(''),
  lastName: Joi.string()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().trim().required(),
  fatherOccupation: Joi.string().trim().required(),
  fatherContactNo: Joi.string().trim().required(),
  motherName: Joi.string().trim().required(),
  motherOccupation: Joi.string().trim().required(),
  motherContactNo: Joi.string().trim().required(),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  occupation: Joi.string().trim().required(),
  contactNo: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().trim().required(),
  name: userNameValidationSchema.required(),
  gender: Joi.string().trim().required().valid('male', 'female', 'other'),
  dateOfBirth: Joi.string().trim().allow(''),
  email: Joi.string().trim().required().email(),
  contactNo: Joi.string().trim().allow(''),
  emergencyContactNo: Joi.string().trim().allow(''),
  bloodGroup: Joi.string()
    .trim()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .allow(''),
  presentAddress: Joi.string().trim().required(),
  permanentAddress: Joi.string().trim().required(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImg: Joi.string().trim().allow(''),
  isActive: Joi.string().trim().valid('active', 'blocked').default('active'),
});

export default studentValidationSchema;

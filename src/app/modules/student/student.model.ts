import { Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';
import config from '../../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    maxlength: [20, 'First Name can not be more than 20'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value ? true : false;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is Required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is Required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact Number is Required'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is Required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is Required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact Number is Required'],
    trim: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is Required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is Required'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact Number is Required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is Required'],
    trim: true,
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is Required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      trim: true,
      maxlength: [20, 'Password should not more than 20'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is Required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message:
          "The gender field can only be one of the following: 'male', 'female', 'other'",
      },
      required: [true, 'Gender is Required'],
      trim: true,
    },
    dateOfBirth: { type: String, trim: true },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email type',
      },
    },
    contactNo: { type: String, trim: true, required: true },
    emergencyContactNo: { type: String, trim: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      trim: true,
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is Required'],
      trim: true,
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian Information is Required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian Information is Required'],
    },
    profileImg: { type: String, trim: true },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// creating a custom instance method ---------------
/* studentSchema.methods.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};
*/

// Virtual --------------
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName}  ${this.name.lastName}`;
});

// pre save middleware/hook
studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: we will save the data');
  // -
  // hashing password and save into DB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//post save middleware/hook
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

/* Query Middleware */
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// ---- Creating a custom static ----
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);

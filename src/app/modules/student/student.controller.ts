import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    /*  
      Validate data using Joi 
      const { error, value } = studentValidationSchema.validate(studentData);
    */

    /* -------- Validate data using Zod -------- */
    const zodParsedData = studentValidationSchema.parse(studentData);

    /* Will call student service function to send this data */
    const result = await StudentServices.createStudentIntoDB(zodParsedData);

    //send response
    res.status(200).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const student = await StudentServices.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: student,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Find Something went wrong',
      error: err,
    });
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const student = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student data are retrieved successfully',
      data: student,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Find Something went wrong',
      error: err,
    });
  }
};

const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const student = await StudentServices.deleteSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully',
      data: student,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Find Something went wrong',
      error: err,
    });
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};

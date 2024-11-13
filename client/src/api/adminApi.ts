/* eslint-disable @typescript-eslint/no-unused-vars */
import { authorizedAxios } from './config';


const getAllStudents = async () => {
  try {
    const students = await authorizedAxios.get("/admin/getStudents");
    if (students) {
      return Promise.resolve(students.data.students);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllInstructors = async () => {
  try {
    const instructors = await authorizedAxios.get("/admin/getInstructors");
    if (instructors) {
      return Promise.resolve(instructors.data.instructors);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const blockStudent = async (studentId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/blockStudent", {
      studentId,
    });
    console.log("Response in block api:" ,response)
    const { success } = response.data;
    if (success) {
      return Promise.resolve(success);
    }
  } catch (error) {
    return Promise.reject();
  }
};

const blockInstructor = async (instructorId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/blockInstructor", {
      instructorId,
    });
    const { success } = response.data;
    if (success) {
      return Promise.resolve(success);
    }
  } catch (error) {
    return Promise.reject();
  }
};

const unblockStudent = async (studentId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/unblockStudent", {
      studentId,
    });
    const { success } = response.data;

    return Promise.resolve(success);
  } catch (error) {
    return Promise.reject();
  }
};
const unblockInstructor = async (instructorId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/unblockInstructor", {
      instructorId,
    });
    const { success } = response.data;

    return Promise.resolve(success);
  } catch (error) {
    return Promise.reject();
  }
};

export {getAllStudents,blockStudent,unblockStudent,getAllInstructors,blockInstructor,unblockInstructor,}
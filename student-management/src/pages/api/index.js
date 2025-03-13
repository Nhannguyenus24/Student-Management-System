import fs from "fs";
import path from "path";
import { isValidVietnamPhone, isStudentEmail, writeLog, getStudents, saveStudents } from "./utils.js";
// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "students.json");
const LOG_FILE = path.join(process.cwd(),"src", "app.log");

export const config = {
  api: {
    bodyParser: true, 
  },
};

export default async function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  if (req.method === "GET") {
    const { mssv, name, faculty, year, status } = req.query;
    const students = getStudents(mssv, name, faculty, year, status);
      writeLog("INFO", "Students retrieved", { count: students.length });
      return res.status(200).json(students);
  } else if (req.method === "POST") {
    try {
      const newStudent = req.body;
      if (!isStudentEmail(newStudent.email)) {
        writeLog("ERROR", "Invalid email", { email: newStudent.email });
        return res.status(400).json({ message: "Invalid email" });
      }
      if (!isValidVietnamPhone(newStudent.phone)) {
        writeLog("ERROR", "Invalid phone", { phone: newStudent.phone });
        return res.status(400).json({ message: "Invalid phone" });
      }
      const students = getStudents();
      const isDuplicate = students.some(
        (student) =>
          student.email === newStudent.email ||
          student.phone === newStudent.phone ||
          student.mssv === newStudent.mssv
      );
      if (isDuplicate) {
        writeLog("ERROR", "Duplicate student detected", { student: newStudent });
        return res.status(400).json({ message: "Student already exists with the same email, phone, or mssv" });
      }
      newStudent.createdAt = new Date().toISOString();
      students.push(newStudent);
      saveStudents(students);
      writeLog("INFO", "Student added", { student: newStudent });
      return res.status(201).json({ message: "Student added", student: newStudent });
    } catch (error) {
      writeLog("ERROR", "Failed to add student", { error: error.message });
      return res.status(500).json({ message: "Failed to add student" });
    }
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

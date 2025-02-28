import fs from "fs";
import path from "path";

// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "students.json");
const LOG_FILE = path.join(process.cwd(),"src", "app.log");

export const config = {
  api: {
    bodyParser: true, 
  },
};
const isStudentEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@student\.\w+\.edu\.vn$/.test(email);
};
const isValidVietnamPhone = (phone) => {
  return /^(?:\+84|0)(3|5|7|8|9)\d{8}$/.test(phone);
};
const writeLog = (level, message, data = {}) => {
  const logMessage = `[${new Date().toISOString()}] [${level}] ${message} - ${JSON.stringify(data)}\n`;
  fs.appendFileSync(LOG_FILE, logMessage, "utf-8"); // Ghi vào file log
};

const getStudents = (mssv = "", name = "", faculty = "", year = "", status = "") => {
  const jsonData = fs.readFileSync(filePath);
  const students = JSON.parse(jsonData);
  return students.filter((student) => {
    return (
      (!mssv || student.mssv.includes(mssv)) && // Kiểm tra mssv có chứa giá trị nhập vào không
      (!name || student.name.toLowerCase().includes(name.toLowerCase())) && // Kiểm tra name (chuyển về lowercase)
      (!faculty || student.faculty === faculty) && // So sánh faculty
      (!year || student.year === year) && // So sánh course
      (!status || student.status === status) // So sánh status
    );
  });
};

const saveStudents = (students) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
    writeLog("INFO", "Students data updated", { total: students.length });
  } catch (error) {
    console.error("Error saving students.json:", error);
    writeLog("ERROR", "Error saving students.json", { error: error.message });
  }
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

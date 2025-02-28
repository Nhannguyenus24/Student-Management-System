import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "students.json");
const LOG_FILE = path.join(process.cwd(), "src","app.log");

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

const getStudents = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

const saveStudents = (students) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
    writeLog("INFO", "Students data updated", { total: students.length });
  } catch (error) {
    writeLog("ERROR", "Failed to save students", { error: error.message });
  }
};

export default function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  const { id } = req.query;
  let students = getStudents();

  if (req.method === "DELETE") {
    students = students.filter((student) => student.mssv !== id);
    saveStudents(students);
    writeLog("INFO", "Student deleted", { id });
    res.status(200).json({ message: "Student deleted" });
  } else if (req.method === "PUT") {
    const updatedStudent = req.body;
    if (!isStudentEmail(updatedStudent.email)) {
      writeLog("ERROR", "Invalid change student email", { email: updatedStudent.email });
      res.status(400).json({ message: "Invalid email" });
      return;
    }
    if (!isValidVietnamPhone(updatedStudent.phone)) {
      writeLog("ERROR", "Invalid change student phone", { phone: updatedStudent.phone });
      res.status(400).json({ message: "Invalid phone" });
      return;
    }
    students = students.map((student) => (student.mssv === id ? updatedStudent : student));
    saveStudents(students);
    writeLog("INFO", "Student updated", { id, updatedStudent });
    res.status(200).json({ message: "Student updated", student: updatedStudent });
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

import {
  isValidVietnamPhone,
  isStudentEmail,
  writeLog,
  saveStudents,
  getStudents,
} from "./utils";
import config from "../../config";

export default function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  const { id } = req.query;
  let students = getStudents();

  if (req.method === "DELETE") {
    const student = students.find((student) => student.mssv === id);
    students = students.filter((student) => student.mssv !== id);
    const createdAtTime = new Date(student.createdAt).getTime();
    const currentTime = Date.now();

    // Kiểm tra thời gian tạo có vượt quá giới hạn xóa không
    if (currentTime - createdAtTime > config.creationDeleteLimit) {
      writeLog("ERROR", "Deletion not allowed within time limit", { id });
      res.status(400).json({ message: `Cannot delete student within ${config.creationDeleteLimit / 60000} minutes of creation` });
      return;
    }
    saveStudents(students);
    writeLog("INFO", "Student deleted", { id });
    res.status(200).json({ message: "Student deleted" });
  } else if (req.method === "PUT") {
    const updatedStudent = req.body;
    if (!isStudentEmail(updatedStudent.email)) {
      writeLog("ERROR", "Invalid change student email", {
        email: updatedStudent.email,
      });
      res.status(400).json({ message: "Invalid email" });
      return;
    }
    if (!isValidVietnamPhone(updatedStudent.phone)) {
      writeLog("ERROR", "Invalid change student phone", {
        phone: updatedStudent.phone,
      });
      res.status(400).json({ message: "Invalid phone" });
      return;
    }
    const isDuplicateEmail = students.some(
      (student) => student.email === updatedStudent.email && student.mssv !== id
    );

    if (isDuplicateEmail) {
      writeLog("ERROR", "Duplicate student email", {
        email: updatedStudent.email,
      });
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const studentIndex = students.findIndex((student) => student.mssv === id);
    if (studentIndex === -1) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const currentStatus = students[studentIndex].status;
    const newStatus = updatedStudent.status;
    if (newStatus !== currentStatus) {
    // Kiểm tra trạng thái hợp lệ
    const allowedTransitions = config.studentStatusConfig[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      writeLog("ERROR", "Invalid status transition", {
        id,
        currentStatus,
        newStatus,
      });
      res
        .status(400)
        .json({
          message: `Cannot change status from '${currentStatus}' to '${newStatus}'`,
        });
      return;
    }}

    // Cập nhật sinh viên
    students[studentIndex] = { ...students[studentIndex], ...updatedStudent };
    saveStudents(students);
    writeLog("INFO", "Student updated", { id, updatedStudent });
    res
      .status(200)
      .json({ message: "Student updated", student: updatedStudent });
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

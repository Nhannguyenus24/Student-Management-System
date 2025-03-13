import config from "../../config";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "students.json");
const LOG_FILE = path.join(process.cwd(), "src", "app.log");

export const isStudentEmail = (email) => {
  const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${config.emailDomain}$`);
  return emailRegex.test(email);
};

export const isValidVietnamPhone = (phone) => {
  const phoneRegex = new RegExp(config.phone.regex);
  return phoneRegex.test(phone);
};

export const writeLog = (level, message, data = {}) => {
  const logMessage = `[${new Date().toISOString()}] [${level}] ${message} - ${JSON.stringify(
    data
  )}\n`;
  fs.appendFileSync(LOG_FILE, logMessage, "utf-8"); // Ghi vào file log
};

export const getStudents = (
  mssv = "",
  name = "",
  faculty = "",
  year = "",
  status = ""
) => {
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

export const saveStudents = (students) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
    writeLog("INFO", "Students data saved successfully", {
      count: students.length,
    });
  } catch (error) {
    writeLog("ERROR", "Error saving students.json", { error: error.message });
    console.error("Error saving students.json:", error);
  }
};

export const saveToFile = (data, filePath, logSuccess, logError) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    writeLog("INFO", logSuccess);
  } catch (error) {
    writeLog("ERROR", logError, { error: error.message });
  }
};

export const readFromFile = (filePath, logSuccess, logError) => {
    try {
        const jsonData = fs.readFileSync(filePath);
        writeLog("INFO", logSuccess);
        return JSON.parse(jsonData);
    } catch (error) {
        writeLog("ERROR", logError, { error: error.message });
    }
};
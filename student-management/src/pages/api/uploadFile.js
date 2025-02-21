import fs from "fs";
import path from "path";
import multer from "multer";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseString } from "xml2js";
import { promisify } from "util";

export const config = {
    api: {
      bodyParser: false, 
    },
  };
// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "students.json");
const LOG_FILE = path.join(process.cwd(), "src","app.log");

const writeLog = (level, message, data = {}) => {
  const logMessage = `[${new Date().toISOString()}] [${level}] ${message} - ${JSON.stringify(data)}\n`;
  fs.appendFileSync(LOG_FILE, logMessage, "utf-8"); // Ghi vào file log
};

// Middleware xử lý file upload với Multer
const upload = multer({ storage: multer.memoryStorage() });

const runMiddleware = promisify(upload.single("file"));
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
    writeLog("INFO", "Students data saved successfully", { count: students.length });
  } catch (error) {
    writeLog("ERROR", "Error saving students.json", { error: error.message });
    console.error("Error saving students.json:", error);
  }
};
const processFileData = async (file) => {
  const { mimetype, buffer } = file;
  let newStudents = [];

  try {
    if (mimetype === "text/csv") {
      // Parse CSV
      const text = buffer.toString("utf-8");
      const result = Papa.parse(text, { header: true });
      newStudents = result.data.filter((row) => Object.keys(row).length);
    } else if (mimetype === "application/json") {
      // Parse JSON
      newStudents = JSON.parse(buffer.toString("utf-8"));
    } else if (
      mimetype.includes("spreadsheetml") ||
      mimetype.includes("excel")
    ) {
      // Parse Excel
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      newStudents = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (mimetype === "application/xml" || mimetype === "text/xml") {
      // Parse XML
      const xmlText = buffer.toString("utf-8");
      const parsedXml = await new Promise((resolve, reject) => {
        parseString(xmlText, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      // Chuyển đổi XML sang JSON
      if (parsedXml.students && parsedXml.students.student) {
        newStudents = parsedXml.students.student.map((s) =>
          Object.fromEntries(
            Object.entries(s).map(([key, value]) => [key, value[0]])
          )
        );
      }
    } else {
      throw new Error("Unsupported file format");
    }
    writeLog("INFO", "File processed successfully", { format: mimetype, count: newStudents.length });
  } catch (error) {
    writeLog("ERROR", "Error processing file", { error: error.message });
    console.error("Error processing file:", error);
    throw new Error("Invalid file format or corrupt data");
  }

  return newStudents;
};

export default async function handler(req, res) {
    if (req.method === "POST" && req.headers["content-type"]?.includes("multipart/form-data")) {
        try {
            await runMiddleware(req, res);
      
            if (!req.file) {
              writeLog("WARN", "No file uploaded");
              return res.status(400).json({ message: "No file uploaded" });
            }
      
            const newStudents = await processFileData(req.file);
            const students = getStudents();
            if (!newStudents.length) {
              writeLog("WARN", "Invalid or empty file");
              return res.status(400).json({ message: "Invalid or empty file" });
            }
            const uniqueStudents = newStudents.filter(
              (newStudent) =>
                !students.some(
                  (student) =>
                    student.email === newStudent.email ||
                    student.phone === newStudent.phone ||
                    student.mssv === newStudent.mssv
                )
            );
            if (uniqueStudents.length === 0) {
              writeLog("WARN", "All students in file already exist");
              return res.status(400).json({ message: "All students in the file already exist" });
            }
            saveStudents([...students, ...uniqueStudents]);
            writeLog("INFO", "Students added from file", { count: uniqueStudents.length });
            return res.status(201).json({
              message: "Students added from file",
              count: uniqueStudents.length,
              
            });
          } catch (error) {
            writeLog("ERROR", "Server error", { error: error.message });
            return res.status(500).json({ message: error.message || "Server error" });
          }
    }
}
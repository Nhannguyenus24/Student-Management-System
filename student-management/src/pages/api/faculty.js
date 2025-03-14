import path from "path";
import { writeLog, readFromFile, saveToFile, getStudents } from "./utils";
// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "faculty.json");


export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  if (req.method === "GET") {
    const faculties = readFromFile(filePath, "Fetched faculty list", "Failed to fetch faculty list");
    writeLog("INFO", "Faculty list retrieved", { total: faculties.length });
    return res.status(200).json(faculties);
  } else if (req.method === "POST") {
    const { label, value } = req.body;
    const { query } = req.query;
    let faculties = readFromFile(filePath, "Fetched faculty list", "Failed to fetch faculty list");
    if (query) {
      const index = faculties.findIndex((s) => s.value === query);
      const students = getStudents();
      const isFacultyInUse = students.some((student) => student.faculty === query);
      if (isFacultyInUse) {
        writeLog("ERROR", "Delete faculty in use", { query });
        return res.status(400).json({ message: "Faculty in use, can not edit" });
      }
      if (index !== -1) {
        faculties[index] = { label, value };
        writeLog("INFO", "Faculty updated", { index, label, value });
      }
    } else {
      faculties.push({ label, value });
      writeLog("INFO", "New faculty added", { label, value });
    }
    saveToFile(faculties, filePath, "Faculty data updated", "Failed to save faculty data");
    return res.status(201).json({ message: "faculty added"});
  } else if (req.method === "DELETE") {
    const { value } = req.body;
    const students = getStudents();
    const isFacultyInUse = students.some((student) => student.faculty === value);
    if (isFacultyInUse) {
      writeLog("ERROR", "Delete faculty in use", { value });
      return res.status(400).json({ message: "Faculty in use" });
    }
    let faculties = readFromFile(filePath, "Fetched faculty list", "Failed to fetch faculty list");
    faculties = faculties.filter((faculty) => faculty.value !== value);
    saveToFile(faculties, filePath, "Faculty deleted", "Failed to delete faculty");
    return res.status(200).json({ message: "Faculty deleted" });
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

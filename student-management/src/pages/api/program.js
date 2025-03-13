import path from "path";
import { writeLog, readFromFile, saveToFile, getStudents } from "./utils";
// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "program.json");

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  if (req.method === "GET") {
    const programs = readFromFile(filePath, "Fetched program list", "Failed to fetch program list");
    writeLog("INFO", "Program list retrieved", { total: programs.length });
    return res.status(200).json(programs);
  } else if (req.method === "POST") {
    const { label, value } = req.body;
    const { query } = req.query;
    let programs = readFromFile(filePath, "Fetched program list", "Failed to fetch program list");
    if (query) {
      const index = programs.findIndex((s) => s.value === query);
      if (index !== -1) {
        programs[index] = { label, value };
        writeLog("INFO", "program updated", { index, label, value });
      }
    } else {
        programs.push({ label, value });
      writeLog("INFO", "New program added", { label, value });
    }
    saveToFile(programs, filePath, "program data updated", "Failed to save program data");
    return res.status(201).json({ message: "program added"});
  } else if (req.method === "DELETE") {
    const { value } = req.body;
    const students = getStudents();
    const isprogramInUse = students.some((student) => student.program === value);
    if (isprogramInUse) {
      writeLog("ERROR", "Delete program in use", { value });
      return res.status(400).json({ message: "program in use" });
    }
    let programs = readFromFile(filePath, "Fetched program list", "Failed to fetch program list");
    programs = programs.filter((program) => program.value !== value);
    saveToFile(programs, filePath, "program deleted", "Failed to delete program");
    return res.status(200).json({ message: "program deleted" });
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

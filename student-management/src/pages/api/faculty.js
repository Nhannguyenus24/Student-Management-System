import fs from "fs";
import path from "path";

// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "faculty.json");
const LOG_FILE = path.join(process.cwd(), "src", "app.log");

const writeLog = (level, message, data = {}) => {
  const logMessage = `[${new Date().toISOString()}] [${level}] ${message} - ${JSON.stringify(data)}\n`;
  fs.appendFileSync(LOG_FILE, logMessage, "utf-8"); // Ghi vào file log
};

export const config = {
  api: {
    bodyParser: true,
  },
};

const getFaculty = () => {
  try {
    const jsonData = fs.readFileSync(filePath);
    writeLog("INFO", "Fetched faculty list");
    return JSON.parse(jsonData);
  } catch (error) {
    writeLog("ERROR", "Failed to fetch faculty data", { error: error.message });
    return [];
  }
};

const saveFaculty = (faculties) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(faculties, null, 2));
    writeLog("INFO", "Faculty data updated", { total: faculties.length });
  } catch (error) {
    writeLog("ERROR", "Failed to save faculty data", { error: error.message });
    console.error("Error saving students.json:", error);
  }
};

export default async function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  if (req.method === "GET") {
    const faculties = getFaculty();
    writeLog("INFO", "Faculty list retrieved", { total: faculties.length });
    return res.status(200).json(faculties);
  } else if (req.method === "POST") {
    const { label, value } = req.body;
    const { query } = req.query;
    let faculties = getFaculty();
    console.log(query, label, value);
    if (query) {
      const index = faculties.findIndex((s) => s.value === query);
      if (index !== -1) {
        faculties[index] = { label, value };
        writeLog("INFO", "Faculty updated", { index, label, value });
      }
    } else {
      faculties.push({ label, value });
      writeLog("INFO", "New faculty added", { label, value });
    }
    saveFaculty(faculties);
    return res.status(201).json({ message: "faculty added"});
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

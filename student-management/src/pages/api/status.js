import fs from "fs";
import path from "path";

// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "studentStatus.json");
const LOG_FILE = path.join(process.cwd(),"src", "app.log");

const writeLog = (level, message, data = {}) => {
  const logMessage = `[${new Date().toISOString()}] [${level}] ${message} - ${JSON.stringify(data)}\n`;
  fs.appendFileSync(LOG_FILE, logMessage, "utf-8"); // Ghi vào file log
};

export const config = {
  api: {
    bodyParser: true,
  },
};

const getStatus = () => {
  try {
    const jsonData = fs.readFileSync(filePath);
    writeLog("INFO", "Fetched faculty list");
    return JSON.parse(jsonData);
  } catch (error) {
    writeLog("ERROR", "Failed to fetch faculty data", { error: error.message });
    return [];
  }
};

const saveStatus = (statuses) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(statuses, null, 2));
    writeLog("INFO", "Status data updated", { total: faculties.length });
  } catch (error) {
    writeLog("ERROR", "Failed to save status data", { error: error.message });
    console.error("Error saving students.json:", error);
  }
};

export default async function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  if (req.method === "GET") {
    const statuses = getStatus();
    writeLog("INFO", "Status list retrieved", { total: statuses.length });
    return res.status(200).json(statuses);
  } else if (req.method === "POST") {
    const { label, value } = req.body;
    const { query } = req.query;
    let statuses = getStatus();
    writeLog("INFO", "Processing status update", { query, label, value });
    if (query) {
      const index = statuses.findIndex((s) => s.value === query);
      if (index !== -1) {
        statuses[index] = { label, value };
        writeLog("INFO", "Status updated", { index, label, value });
      }
    } else {
      statuses.push({ label, value });
      writeLog("INFO", "New status added", { label, value });
    }
    saveStatus(statuses);
    return res.status(201).json({ message: "Status added"});
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}


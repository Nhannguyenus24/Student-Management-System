import path from "path";
import { writeLog, readFromFile, saveToFile } from "./utils";
// Thiết lập đường dẫn file JSON
const filePath = path.join(process.cwd(), "src", "data", "studentStatus.json");

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  writeLog("INFO", "API Accessed", { method: req.method, query: req.query });
  if (req.method === "GET") {
    const statuses = readFromFile(filePath, "Fetched student status list", "Failed to fetch student status list");
    return res.status(200).json(statuses);
  } else if (req.method === "POST") {
    const { label, value } = req.body;
    const { query } = req.query;
    let statuses = readFromFile(filePath, "Fetched student status list", "Failed to fetch student status list");Status();
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
    saveToFile(statuses, filePath, "Status data updated", "Failed to save status data");
    return res.status(201).json({ message: "Status added"});
  } else if (req.method === "DELETE") {
    const { value } = req.body;
    let statuses = readFromFile(filePath, "Fetched student status list", "Failed to fetch student status list");
    const isStatusInUse = Object.values(config.studentStatusConfig).some((statusList) => statusList.includes(value));
    if (isStatusInUse) {
      writeLog("ERROR", "Delete status in use", { value });
      return res.status(400).json({ message: "Status in use" });
    }
    statuses = statuses.filter((status) => status.value !== value);
    saveToFile(statuses, filePath, "Status deleted", "Failed to delete status");
    return res.status(200).json({ message: "Status deleted" });
  } else {
    writeLog("WARN", "Method Not Allowed", { method: req.method });
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}


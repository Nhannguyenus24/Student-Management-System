import fs from "fs";
import path from "path";

const versionPath = path.join(process.cwd(), "src", "data", "version.json");

// Hàm lấy phiên bản mới nhất từ danh sách version
const getLatestVersion = () => {
  try {
    const data = fs.readFileSync(versionPath, "utf-8");
    const versions = JSON.parse(data);
    
    if (Array.isArray(versions) && versions.length > 0) {
      return versions[versions.length - 1]; // Lấy phần tử cuối cùng trong mảng
    }

    return { version: "unknown", buildDate: "unknown" };
  } catch (error) {
    console.error("Error reading version file:", error);
    return { version: "unknown", buildDate: "unknown" };
  }
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(getLatestVersion());
  }

  return res.status(405).json({ message: "Method not allowed" });
}

import { useState } from "react";
import { exportToCSV, exportToJSON, exportToXML, exportToExcel } from "../utils/exportFiles";

const FileExport = ({ data }) => {
  const [open, setOpen] = useState(false);

  const handleExport = (format) => {
    switch (format) {
      case "csv":
        exportToCSV(data);
        break;
      case "json":
        exportToJSON(data);
        break;
      case "xml":
        exportToXML(data);
        break;
      case "excel":
        exportToExcel(data);
        break;
      default:
        console.error("Định dạng không hợp lệ");
    }
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Nút Export */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Export File
      </button>

      {/* Dropdown chọn định dạng */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
          {["csv", "json", "xml", "excel"].map((format) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-200 transition"
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExport;

import { saveAs } from "file-saver";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// Xuất CSV
const exportToCSV = (data, filename = "students.csv") => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
};

// Xuất JSON
const exportToJSON = (data, filename = "students.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  saveAs(blob, filename);
};

// Xuất XML
const exportToXML = (data, filename = "students.xml") => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<students>\n';
  data.forEach((student) => {
    xml += "  <student>\n";
    Object.entries(student).forEach(([key, value]) => {
      xml += `    <${key}>${value}</${key}>\n`;
    });
    xml += "  </student>\n";
  });
  xml += "</students>";

  const blob = new Blob([xml], { type: "application/xml" });
  saveAs(blob, filename);
};

// Xuất Excel
const exportToExcel = (data, filename = "students.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  saveAs(blob, filename);
};

export { exportToCSV, exportToJSON, exportToXML, exportToExcel };

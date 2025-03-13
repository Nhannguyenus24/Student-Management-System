import { saveAs } from "file-saver";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import blobStream from "blob-stream";
import { Document, Packer, Paragraph, TextRun } from "docx";
import config from "../config";

// Xuất PDF
const exportToPDF = (student, filename = "student.pdf") => {
  const doc = new PDFDocument({ margin: 50 });
  const stream = doc.pipe(blobStream());

  // Title
  doc.fontSize(14).font("Helvetica-Bold").text(`UNIVERSITY OF ${config.schoolName}`, { align: "center" });
  doc.text("TRAINING DEPARTMENT", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).font("Helvetica").text(`Address: ${config.schoolLocation}`);
  doc.text(`Phone: ${config.schoolPhone} | Email: ${config.schoolEmail}`);
  doc.moveDown();

  // Confirmation Letter
  doc.fontSize(14).font("Helvetica-Bold").text("STUDENT STATUS CONFIRMATION LETTER", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).font("Helvetica").text(`The University of ${config.schoolName} certifies that:`);
  doc.moveDown();

  // Student Information
  doc.font("Helvetica-Bold").text("1. Student Information:");
  doc.font("Helvetica").text(`- Full Name: ${student.name}`);
  doc.text(`- Student ID: ${student.mssv}`);
  doc.text(`- Date of Birth: ${student.dob}`);
  doc.text(`- Gender: ${student.gender === "male" ? "Male" : "Female"}`);
  doc.text(`- Faculty: ${student.faculty}`);
  doc.text(`- Program: ${student.program}`);
  doc.text(`- Course: K-${student.year}`);
  doc.moveDown();

  // Student Status
  doc.font("Helvetica-Bold").text("2. Current Student Status:");
  doc.font("Helvetica").text(`- ${student.status}`);
  doc.moveDown();

  // Issuance Date
  doc.font("Helvetica-Bold").text(`Certified by the University of  ${config.schoolName}`);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString("en-US")}`);
  doc.moveDown(2);
  doc.text("Head of Training Department", { align: "right" });
  doc.text("(Signature, Full Name, and Stamp)", { align: "right" });

  doc.end();
  stream.on("finish", function () {
    const blob = stream.toBlob("application/pdf");
    saveAs(blob, filename);
  });
};


// Xuất DOCX
const exportToDOCX = (student, filename = "student.docx") => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `TRƯỜNG ĐẠI HỌC ${config.schoolName}`, bold: true, size: 28 }),
              new TextRun("\nPHÒNG ĐÀO TẠO\n"),
              new TextRun(`📍 Địa chỉ: ${config.schoolLocation}`),
              new TextRun(`\n📞 Điện thoại: ${config.schoolPhone} | 📧 Email: ${config.schoolEmail}\n`),
            ],
          }),
          new Paragraph("\n"),
          new Paragraph({
            children: [
              new TextRun({ text: "GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN", bold: true, size: 24 }),
            ],
          }),
          new Paragraph(`\nTrường Đại học ${config.schoolName} xác nhận:`),
          new Paragraph({
            children: [
              new TextRun({ text: "1. Thông tin sinh viên:", bold: true }),
              new TextRun(`\n- Họ và tên: ${student.name}`),
              new TextRun(`\n- Mã số sinh viên: ${student.mssv}`),
              new TextRun(`\n- Ngày sinh: ${student.dob}`),
              new TextRun(`\n- Giới tính: ${student.gender === "male" ? "Nam" : "Nữ"}`),
              new TextRun(`\n- Khoa: ${student.faculty}`),
              new TextRun(`\n- Chương trình đào tạo: ${student.program}`),
              new TextRun(`\n- Khóa: K-${student.year}`),
            ],
          }),
          new Paragraph("\n"),
          new Paragraph({
            children: [
              new TextRun({ text: "2. Tình trạng sinh viên hiện tại:", bold: true }),
              new TextRun(`\n- ${student.status}`),
            ],
          }),
          new Paragraph("\n"),
          new Paragraph({
            children: [
              new TextRun({ text: "📍 Xác nhận của Trường Đại học", bold: true }),
              new TextRun(`\n📅 Ngày cấp: ${new Date().toLocaleDateString("vi-VN")}`),
            ],
          }),
          new Paragraph("\n"),
          new Paragraph({
            children: [
              new TextRun({ text: "🖋 Trưởng Phòng Đào Tạo", bold: true }),
              new TextRun("\n(Ký, ghi rõ họ tên, đóng dấu)"),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, filename);
  });
};

// Xuất HTML
const exportToHTML = (student, filename = "student.html") => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Giấy Xác Nhận</title>
  </head>
  <body>
    <h2 style="text-align: center;">TRƯỜNG ĐẠI HỌC ${config.schoolName}</h2>
    <h3 style="text-align: center;">PHÒNG ĐÀO TẠO</h3>
    <p><strong>Địa chỉ:</strong> ${config.schoolLocation}</p>
    <p><strong>Điện thoại:</strong> ${config.schoolPhone} | <strong>Email:</strong> ${config.schoolEmail}</p>
    <h2 style="text-align: center;">GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN</h2>
    <p><strong>1. Thông tin sinh viên:</strong></p>
    <p>- Họ và tên: ${student.name}</p>
    <p>- Mã số sinh viên: ${student.mssv}</p>
    <p>- Ngày sinh: ${student.dob}</p>
    <p>- Giới tính: ${student.gender === "male" ? "Nam" : "Nữ"}</p>
    <p>- Khoa: ${student.faculty}</p>
    <p>- Chương trình đào tạo: ${student.program}</p>
    <p>- Khóa: K-${student.year}</p>
    <p><strong>2. Tình trạng sinh viên hiện tại:</strong></p>
    <p>- ${student.status}</p>
    <p><strong>📍 Xác nhận của Trường Đại học</strong></p>
    <p>📅 Ngày cấp: ${new Date().toLocaleDateString("vi-VN")}</p>
    <p style="text-align: right;">🖋 Trưởng Phòng Đào Tạo</p>
    <p style="text-align: right;">(Ký, ghi rõ họ tên, đóng dấu)</p>
  </body>
  </html>
  `;
  const blob = new Blob([htmlContent], { type: "text/html" });
  saveAs(blob, filename);
};

// Xuất MD
const exportToMarkdown = (student, filename = "student.md") => {
  const mdContent = `
# TRƯỜNG ĐẠI HỌC ${config.schoolName}
## PHÒNG ĐÀO TẠO
📍 Địa chỉ: ${config.schoolLocation}
📞 Điện thoại: ${config.schoolPhone} | 📧 Email: ${config.schoolEmail}

## GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN

**1. Thông tin sinh viên:**
- Họ và tên: ${student.name}
- Mã số sinh viên: ${student.mssv}
- Ngày sinh: ${student.dob}
- Giới tính: ${student.gender === "male" ? "Nam" : "Nữ"}
- Khoa: ${student.faculty}
- Chương trình đào tạo: ${student.program}
- Khóa: K-${student.year}

**2. Tình trạng sinh viên hiện tại:**
- ${student.status}

📍 **Xác nhận của Trường Đại học**
📅 Ngày cấp: ${new Date().toLocaleDateString("vi-VN")}

🖋 **Trưởng Phòng Đào Tạo**  
(Ký, ghi rõ họ tên, đóng dấu)
  `;
  const blob = new Blob([mdContent], { type: "text/markdown" });
  saveAs(blob, filename);
};

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

export { exportToCSV, exportToJSON, exportToXML, exportToExcel, exportToPDF, exportToDOCX, exportToHTML, exportToMarkdown };

import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "students.json");

const getStudents = (mssv, name, faculty, course, status) => {
  const jsonData = fs.readFileSync(filePath);
  const students = JSON.parse(jsonData);

  return students.filter((student) => {
    return (
      (!mssv || student.mssv.includes(mssv)) && // Kiểm tra mssv có chứa giá trị nhập vào không
      (!name || student.name.toLowerCase().includes(name.toLowerCase())) && // Kiểm tra name (chuyển về lowercase)
      (!faculty || student.faculty === faculty) && // So sánh faculty
      (!course || student.course === course) && // So sánh course
      (!status || student.status === status) // So sánh status
    );
  });
};

const saveStudents = (students) => {
  fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
};

export default function handler(req, res) {
  if (req.method === "GET") {
    const { mssv, name, faculty, course, status } = req.query;
    const students = getStudents( mssv, name, faculty, course, status );
    res.status(200).json(students);
  } else if (req.method === "POST") {
    const newStudent = req.body;
    const students = getStudents();
    students.push(newStudent);
    saveStudents(students);
    res.status(201).json({ message: "Student added", student: newStudent });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

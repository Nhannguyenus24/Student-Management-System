import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "students.json");

const getStudents = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

const saveStudents = (students) => {
  fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
};

export default function handler(req, res) {
  const { id } = req.query;
  let students = getStudents();

  if (req.method === "DELETE") {
    console.log(id)
    students = students.filter((student) => student.mssv !== id);
    saveStudents(students);
    res.status(200).json({ message: "Student deleted" });
  } else if (req.method === "PUT") {
    const updatedStudent = req.body;
    students = students.map((student) => (student.mssv === id ? updatedStudent : student));
    saveStudents(students);
    res.status(200).json({ message: "Student updated", student: updatedStudent });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

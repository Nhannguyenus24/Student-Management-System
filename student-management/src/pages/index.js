import { useEffect, useState } from "react";
import {
  FileUpload,
  FileExport,
  StudentForm,
  FacultyEdit,
  StatusEdit,
} from "../components";

const years = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i);

export default function Home() {
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [version, setVersion] = useState({
    version: "unknown",
    buildDate: "unknown",
  });
  const [filters, setFilters] = useState({
    mssv: "",
    name: "",
    faculty: "",
    year: "",
    status: "",
  });
  const [formData, setFormData] = useState({
    mssv: "",
    name: "",
    dob: "",
    gender: "",
    faculty: "",
    year: "",
    program: "",
    address: "",
    email: "",
    phone: "",
    status: "",
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams(filters).toString();
    fetch(`/api?${queryParams}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  };
  const getFaculty = () => {
    fetch(`/api/faculty`)
      .then((res) => res.json())
      .then((data) => setFaculties(data))
      .catch((error) => console.error("Error fetching students:", error));
  };
  const getStatus = () => {
    fetch(`/api/status`)
      .then((res) => res.json())
      .then((data) => setStatuses(data))
      .catch((error) => console.error("Error fetching students:", error));
  };
  const getVersion = () => {
    fetch("/api/version")
      .then((res) => res.json())
      .then((data) => setVersion(data))
      .catch((error) => console.error("Error fetching version:", error));
  };
  // Gọi API ngay khi component load để lấy toàn bộ dữ liệu ban đầu
  useEffect(() => {
    handleSearch();
    getFaculty();
    getStatus();
    getVersion();
  }, []);

  const handleInputChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = async (mssv) => {
    await fetch(`/api/${mssv}`, { method: "DELETE" });
    setStudents(students.filter((s) => s.mssv !== mssv));
  };

  const openModal = (student = null) => {
    setEditingStudent(student);
    setFormData(
      student || {
        mssv: "",
        name: "",
        dob: "",
        gender: "",
        faculty: "",
        year: "",
        program: "",
        address: "",
        email: "",
        phone: "",
      }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setReview(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          Quản lý Sinh Viên
        </h1>

        {/* Thanh filter */}
        <div className="bg-white p-4 shadow-md flex items-center gap-4 mt-6 rounded-md">
          <input
            name="mssv"
            placeholder="Mã số sinh viên"
            className="border p-2 rounded-md w-1/6"
            value={filters.mssv}
            onChange={handleInputChange}
          />
          <input
            name="name"
            placeholder="Họ tên"
            className="border p-2 rounded-md w-1/6"
            value={filters.name}
            onChange={handleInputChange}
          />
          <select
            name="faculty"
            className="border p-2 rounded-md w-1/6"
            value={filters.faculty}
            onChange={handleInputChange}
          >
            {faculties.map((faculty) => (
              <option key={faculty.value} value={faculty.value}>
                {faculty.label}
              </option>
            ))}
          </select>
          <select
            name="year"
            className="border p-2 rounded-md w-1/6"
            value={filters.year}
            onChange={handleInputChange}
          >
            <option value="">Tất cả các khóa</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            name="status"
            className="border p-2 rounded-md w-1/6"
            value={filters.status}
            onChange={handleInputChange}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Tìm kiếm
          </button>
        </div>
        <div className=" flex items-center gap-4 mt-6 rounded-md">
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Thêm sinh viên
          </button>
          <FileUpload rerender={handleSearch} />
          <FileExport data={students} />
          <FacultyEdit data={faculties} setData={setFaculties} />
          <StatusEdit data={statuses} setData={setStatuses} />
        </div>

        {/* Danh sách sinh viên */}
        <div className="overflow-x-auto w-full mt-6">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                {[
                  "MSSV",
                  "Họ tên",
                  "Khoa",
                  "Khóa",
                  "Chương trình",
                  "Tình trạng",
                  "Hành động",
                ].map((h) => (
                  <th key={h} className="p-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.mssv} className="border-t text-center">
                  <td className="p-2">{s.mssv}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.faculty}</td>
                  <td className="p-2">{s.year}</td>
                  <td className="p-2">{s.program}</td>
                  <td className="p-2">{s.status}</td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setReview(true);
                        openModal(s);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => openModal(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md mx-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(s.mssv)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <StudentForm
            formData={formData}
            closeModal={closeModal}
            faculties={faculties}
            years={years}
            statuses={statuses}
            editingStudent={editingStudent}
            setStudents={setStudents}
            students={students}
            review={review}
          />
        )}
      </div>
      <div className="fixed bottom-0 left-0 p-2  text-gray text-sm rounded-tr-lg">
        <p>Version: {version.version}</p>
        <p>Build Date: {new Date(version.buildDate).toLocaleString()}</p>
      </div>
    </>
  );
}

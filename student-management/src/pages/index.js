import React, { useEffect, useState } from "react";
import {
  FileUpload,
  FileExport,
  StudentForm,
  FacultyEdit,
  StatusEdit,
} from "../components";
import config from "../config";
import { useSnackbar } from "notistack";
import { exportToDOCX, exportToHTML, exportToMarkdown, exportToPDF } from "@/utils/exportFiles";
const years = Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2025 - i);

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [version, setVersion] = useState({
    version: "unknown",
    buildDate: "unknown",
  });
  const [openForm, setOpenForm] = useState(null);
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
      .catch((error) => enqueueSnackbar("Error fetching students", { variant: "error" }));
  };
  const getFaculty = () => {
    fetch(`/api/faculty`)
      .then((res) => res.json())
      .then((data) => setFaculties(data))
      .catch((error) => console.error("Error fetching faculty:", error));
  };
  const getStatus = () => {
    fetch(`/api/status`)
      .then((res) => res.json())
      .then((data) => setStatuses(data))
      .catch((error) => console.error("Error fetching status:", error));
  };
  const getProgram = () => {
    fetch(`/api/program`)
      .then((res) => res.json())
      .then((data) => setPrograms(data))
      .catch((error) => console.error("Error fetching program:", error));
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
    getProgram();
    getVersion();
  }, []);

  const handleInputChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = async (mssv) => {
    const response = await fetch(`/api/${mssv}`, { method: "DELETE" });
    if (response.ok) {
      enqueueSnackbar("Xóa sinh viên thành công", { variant: "success" });
      setStudents(students.filter((s) => s.mssv !== mssv));
    } else {
      const data = await response.json();
      enqueueSnackbar(data.message, { variant: "error" });
    }
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
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          {config.schoolName}
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
                      className="bg-red-500 text-white px-3 py-1 rounded-md mx-2"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => setOpenForm(s)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Xuất file
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
            programs={programs}
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
      {openForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Tiêu đề */}
        <h2 className="text-center text-lg font-bold">{`TRƯỜNG ĐẠI HỌC ${config.schoolName}`}</h2>
        <h3 className="text-center text-md font-semibold mt-2">Giấy xác nhận</h3>

        {/* Tùy chọn xuất file */}
        <div className="flex flex-col gap-2 mt-4">
          <button className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={() => exportToPDF(openForm, `${openForm.name}.pdf`)}>Xuất PDF</button>
          <button className="bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600" onClick={() => exportToMarkdown(openForm, `${openForm.name}.md`)}>Xuất MD</button>
          <button className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600" onClick={() => exportToHTML(openForm, `${openForm.name}.html`)}>Xuất HTML</button>
          <button className="bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600" onClick={() => exportToDOCX(openForm,`${openForm.name}.docx`)}>Xuất DOCX</button>
        </div>

        {/* Nút hủy */}
        <div className="mt-4 flex justify-center">
          <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600" onClick={() => setOpenForm(null)}>
            Hủy
          </button>
        </div>
      </div>
    </div>
      )}
    </>
  );
}

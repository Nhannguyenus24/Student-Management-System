import { useEffect, useState } from "react";

const studentFields = [
  { label: "Mã số sinh viên", value: "mssv" },
  { label: "Họ và tên", value: "name" },
  { label: "Ngày sinh", value: "dob" },
  { label: "Giới tính", value: "gender" },
  { label: "Khoa", value: "falcuty" },
  { label: "Khóa học", value: "course" },
  { label: "Chương trình", value: "program" },
  { label: "Địa chỉ", value: "address" },
  { label: "Email", value: "email" },
  { label: "Số điện thoại", value: "phone" },
  { label: "Tình trạng", value: "status" },
];

const faculties = [
  { label: "Tất cả các khoa", value: "" },
  { label: "Khoa Luật", value: "law" },
  { label: "Khoa Tiếng Anh Thương Mại", value: "business-english" },
  { label: "Khoa Tiếng Nhật", value: "japanese" },
  { label: "Khoa Tiếng Pháp", value: "french" },
];

const statuses = [
  { label: "Mọi tình trạng", value: "" },
  { label: "Đang học", value: "studying" },
  { label: "Đã tốt nghiệp", value: "graduated" },
  { label: "Đã thôi học", value: "dropped-out" },
];

export default function Home() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filters, setFilters] = useState({
    mssv: "",
    name: "",
    faculty: "",
    course: "",
    status: "",
  });
  const [formData, setFormData] = useState({
    mssv: "",
    name: "",
    dob: "",
    gender: "Nam",
    khoa: "",
    khoaHoc: "",
    chuongTrinh: "",
    diaChi: "",
    email: "",
    phone: "",
    tinhTrang: "Đang học",
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams(filters).toString();
    fetch(`/api?${queryParams}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  };

  // Gọi API ngay khi component load để lấy toàn bộ dữ liệu ban đầu
  useEffect(() => {
    handleSearch();
  }, []);

  const handleInputChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStudent) {
      // Cập nhật sinh viên
      await fetch(`/api/${editingStudent.mssv}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStudents(
        students.map((s) => (s.mssv === editingStudent.mssv ? formData : s))
      );
    } else {
      // Thêm mới sinh viên
      await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStudents([...students, formData]);
    }
    closeModal();
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
        khoa: "",
        khoaHoc: "",
        chuongTrinh: "",
        diaChi: "",
        email: "",
        phone: "",
        tinhTrang: "Đang học",
      }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  return (
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
        <option value="">Tất cả các khoa</option>
        <option value="law">Khoa Luật</option>
        <option value="business-english">Khoa Tiếng Anh Thương Mại</option>
        <option value="japanese">Khoa Tiếng Nhật</option>
        <option value="french">Khoa Tiếng Pháp</option>
      </select>
      <select
        name="course"
        className="border p-2 rounded-md w-1/6"
        value={filters.course}
        onChange={handleInputChange}
      >
        <option value="">Tất cả các khóa</option>
        {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>

      <select
        name="status"
        className="border p-2 rounded-md w-1/6"
        value={filters.status}
        onChange={handleInputChange}
      >
        <option value="">Mọi tình trạng</option>
        <option value="Đang học">Đang học</option>
        <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
        <option value="Đã thôi học">Đã thôi học</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Tìm kiếm
      </button>
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Thêm
      </button>
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
                <td className="p-2">{s.falcuty}</td>
                <td className="p-2">{s.course}</td>
                <td className="p-2">{s.program}</td>
                <td className="p-2">{s.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(s.mssv)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-1/3"
          >
            <h2 className="text-2xl font-bold">
              {editingStudent ? "Sửa Sinh Viên" : "Thêm Sinh Viên"}
            </h2>
            {studentFields.map((field) => (
              <input
                key={field.value}
                name={field.value}
                placeholder={field.label}
                value={formData[field.value]}
                onChange={handleChange}
                className="border p-2 w-full mt-2"
              />
            ))}

            <button
              type="submit"
              className="bg-blue-500 text-white w-full p-2 mt-4 rounded-md hover:bg-blue-600"
            >
              Lưu
            </button>
            <button onClick={closeModal} className="mt-2 text-red-500 w-full">
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

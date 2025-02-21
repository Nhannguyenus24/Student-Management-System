import React, { useState } from "react";

const StudentForm = ({
  formData,
  closeModal,
  faculties,
  years,
  statuses,
  editingStudent,
  setStudents,
  students,
  review,
}) => {
  const [data, setData] = useState(formData);
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStudent) {
      await fetch(`/api/${editingStudent.mssv}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStudents(
        students.map((s) => (s.mssv === editingStudent.mssv ? data : s))
      );
    } else {
      await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStudents([...students, data]);
    }
    closeModal();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-1/3"
      >
        <h2 className="text-2xl font-bold  text-center">
          {editingStudent ? "Sửa Sinh Viên" : "Thêm Sinh Viên"}
        </h2>
        <label className="block">
          Mã số sinh viên
          <input
            name="mssv"
            placeholder="Nhập mã số sinh viên"
            value={data.mssv}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Họ và tên
          <input
            name="name"
            placeholder="Nhập họ và tên"
            value={data.name}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Ngày sinh
          <input
            type="date"
            name="dob"
            value={data.dob}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            disabled={review}
          />
        </label>

        <label className="block">
          Giới tính
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            disabled={review}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </label>

        <label className="block">
          Khoa
          <select
            name="faculty"
            value={data.faculty}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          >
            {faculties.map((faculty) => (
              <option key={faculty.value} value={faculty.value}>
                {faculty.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          Khóa học
          <select
            name="year"
            value={data.year}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          >
            <option value="">Chọn khóa học</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          Chương trình
          <input
            name="program"
            placeholder="Nhập chương trình"
            value={data.program}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Địa chỉ
          <input
            name="address"
            placeholder="Nhập địa chỉ"
            value={data.address}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            disabled={review}
          />
        </label>

        <label className="block">
          Email
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={data.email}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Số điện thoại
          <input
            type="tel"
            name="phone"
            placeholder="Nhập số điện thoại"
            value={data.phone}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Tình trạng học
          <select
            name="status"
            value={data.status}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        {!review && (
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white flex-1 p-2 rounded-md hover:bg-blue-600"
            >
              Lưu
            </button>
            <button
              onClick={closeModal}
              className="text-blue-500 border border-blue-500 flex-1 p-2 rounded-md hover:bg-red-100"
            >
              Hủy
            </button>
          </div>
        )}
        {review && (
            <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={closeModal}
            className="text-blue-500 border border-blue-500 flex-1 p-2 rounded-md hover:bg-red-100"
          >
            Trở về
          </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentForm;

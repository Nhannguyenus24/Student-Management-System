import React, { useState } from "react";
import { useSnackbar } from "notistack";
const StudentForm = ({
  formData,
  closeModal,
  faculties,
  years,
  statuses,
  programs,
  editingStudent,
  setStudents,
  students,
  review,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(formData);
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStudent) {
      const response = await fetch(`/api/${editingStudent.mssv}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const data = await response.json();
        enqueueSnackbar(data.message, { variant: "error" });
        return;
      }
      enqueueSnackbar("Student updated", { variant: "success" });
      setStudents(
        students.map((s) => (s.mssv === editingStudent.mssv ? data : s))
      );
    } else {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const data = await response.json();
        enqueueSnackbar(data.message, { variant: "error" });
        return;
      }
      enqueueSnackbar("Student added", { variant: "success" });
      setStudents([...students, data]);
    }
    closeModal();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center max-h-[100vh] overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-1/3 "
      >
        <h2 className="text-2xl font-bold  text-center">
          {editingStudent ? "Edit student" : "Add student"}
        </h2>
        <label className="block">
          Student ID
          <input
            name="mssv"
            placeholder="Enter student ID"
            value={data.mssv}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Full name
          <input
            name="name"
            placeholder="Enter full name"
            value={data.name}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Date of birth
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
          Gender
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
          Faculty
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
          Course
          <select
            name="year"
            value={data.year}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          >
            <option value="">Choose course</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          Program
          <select
            name="program"
            value={data.program}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          >
            {programs.map((faculty) => (
              <option key={faculty.value} value={faculty.value}>
                {faculty.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          Address
          <input
            name="address"
            placeholder="Enter address"
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
            placeholder="Enter email"
            value={data.email}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Phone number
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={data.phone}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            required
            disabled={review}
          />
        </label>

        <label className="block">
          Status
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
              Save
            </button>
            <button
              onClick={closeModal}
              className="text-blue-500 border border-blue-500 flex-1 p-2 rounded-md hover:bg-red-100"
            >
              Cancel
            </button>
          </div>
        )}
        {review && (
          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={closeModal}
              className="text-blue-500 border border-blue-500 flex-1 p-2 rounded-md hover:bg-red-100"
            >
              Close
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentForm;

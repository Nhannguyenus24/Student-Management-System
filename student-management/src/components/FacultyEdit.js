import { useState } from "react";

const FacultyEdit = ({ data, setData }) => {
  const [openList, setOpenList] = useState(false); // Hiện danh sách khoa
  const [openForm, setOpenForm] = useState(false); // Hiện form nhập liệu
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyName, setFacultyName] = useState("");

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setFacultyName(faculty.value);
    setOpenForm(true);
  };

  const handleAddNew = () => {
    setSelectedFaculty(null);
    setFacultyName("");
    setOpenForm(true);
  };

  const handleSubmit = async () => {
    if (facultyName.trim() === "") return;
    await fetch(`/api/faculty?query=${selectedFaculty?.value || ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: facultyName, value: facultyName }),
    });
    if (selectedFaculty) {
      console.log("Old Value:", selectedFaculty.value);
      console.log("New Value:", facultyName);
      setData((prevData) =>
        prevData.map((faculty) =>
          faculty.value === selectedFaculty.value
            ? { ...faculty, value: facultyName, label: facultyName }
            : faculty
        )
      );
    } else {
      console.log("Old Value:", "");
      console.log("New Value:", facultyName);
      setData((prevData) => [
        ...prevData,
        { value: facultyName, label: facultyName },
      ]);
    }
    setOpenForm(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Nút mở danh sách khoa */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() => setOpenList(!openList)}
      >
        Thêm / Chỉnh sửa khoa
      </button>

      {/* Hiển thị danh sách khoa khi bấm vào nút trên */}
      {openList && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-80 z-50">
          <h3 className="text-lg font-semibold mb-2">Danh sách khoa</h3>
          <ul className="space-y-2">
            {data.filter((faculty) => faculty.value !== "").map((faculty, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-100 p-2 rounded-md"
              >
                <span>{faculty.label}</span>
                <button
                  className="text-sm text-white bg-yellow-500 px-2 py-1 rounded-md hover:bg-yellow-600"
                  onClick={() => handleEdit(faculty)}
                >
                  Sửa
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between gap-2">
            <button
              onClick={handleAddNew}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Thêm
            </button>
            <button
              onClick={() => setOpenList(false)}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Trở về
            </button>
          </div>
        </div>
      )}

      {/* Modal nhập dữ liệu */}
      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {selectedFaculty ? "Chỉnh sửa khoa" : "Thêm mới khoa"}
            </h2>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
              >
                Lưu
              </button>
              <button
                onClick={() => setOpenForm(false)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyEdit;

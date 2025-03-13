import React, { useState } from "react";
import { useSnackbar } from "notistack";

const ProgramEdit = ({ data, setData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openList, setOpenList] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [ProgramName, setProgramName] = useState("");

  const handleEdit = (Program) => {
    setSelectedProgram(Program);
    setProgramName(Program.value);
    setOpenForm(true);
  };

  const handleAddNew = () => {
    setSelectedProgram(null);
    setProgramName("");
    setOpenForm(true);
  };
  const handleDelete = async () => {
    if (!selectedProgram) return;
    const response = await fetch(`/api/program?query=${selectedProgram?.value || ""}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: selectedProgram.value }),
    });
    if (!response.ok){
      const data = await response.json();
      enqueueSnackbar(data.message, { variant: "error" });
      return;
    }
    enqueueSnackbar("Xóa thành công", { variant: "success" });
    setData((prevData) =>
      prevData.filter((Program) => Program.value !== selectedProgram.value)
    );
    setOpenForm(false);
  };
  const handleSubmit = async () => {
    if (ProgramName.trim() === "") return;
    await fetch(`/api/program?query=${selectedProgram?.value || ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: ProgramName, value: ProgramName }),
    });
    if (selectedProgram) {
      console.log("Old Value:", selectedProgram.value);
      console.log("New Value:", ProgramName);
      setData((prevData) =>
        prevData.map((Program) =>
          Program.value === selectedProgram.value
            ? { ...Program, value: ProgramName, label: ProgramName }
            : Program
        )
      );
    } else {
      console.log("Old Value:", "");
      console.log("New Value:", ProgramName);
      setData((prevData) => [
        ...prevData,
        { value: ProgramName, label: ProgramName },
      ]);
    }
    setOpenForm(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() => setOpenList(!openList)}
      >
        Thêm / Chỉnh sửa chương trình học
      </button>

      {openList && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-80 z-50">
          <h3 className="text-lg font-semibold mb-2">Danh sách trạng thái</h3>
          <ul className="space-y-2">
            {data.filter((Program) => Program.value !== "").map((Program, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-100 p-2 rounded-md"
              >
                <span>{Program.label}</span>
                <button
                  className="text-sm text-white bg-yellow-500 px-2 py-1 rounded-md hover:bg-yellow-600"
                  onClick={() => handleEdit(Program)}
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

      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProgram ? "Chỉnh sửa" : "Thêm mới"}
            </h2>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={ProgramName}
              onChange={(e) => setProgramName(e.target.value)}
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
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramEdit;

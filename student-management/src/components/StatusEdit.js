import { useState } from "react";

const StatusEdit = ({ data, setData }) => {
  const [openList, setOpenList] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusName, setStatusName] = useState("");

  const handleEdit = (status) => {
    setSelectedStatus(status);
    setStatusName(status.value);
    setOpenForm(true);
  };

  const handleAddNew = () => {
    setSelectedStatus(null);
    setStatusName("");
    setOpenForm(true);
  };

  const handleSubmit = async () => {
    if (statusName.trim() === "") return;
    await fetch(`/api/status?query=${selectedStatus?.value || ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: statusName, value: statusName }),
    });
    if (selectedStatus) {
      console.log("Old Value:", selectedStatus.value);
      console.log("New Value:", statusName);
      setData((prevData) =>
        prevData.map((status) =>
          status.value === selectedStatus.value
            ? { ...status, value: statusName, label: statusName }
            : status
        )
      );
    } else {
      console.log("Old Value:", "");
      console.log("New Value:", statusName);
      setData((prevData) => [
        ...prevData,
        { value: statusName, label: statusName },
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
        Thêm / Chỉnh sửa trạng thái
      </button>

      {openList && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-80 z-50">
          <h3 className="text-lg font-semibold mb-2">Danh sách trạng thái</h3>
          <ul className="space-y-2">
            {data.filter((status) => status.value !== "").map((status, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-100 p-2 rounded-md"
              >
                <span>{status.label}</span>
                <button
                  className="text-sm text-white bg-yellow-500 px-2 py-1 rounded-md hover:bg-yellow-600"
                  onClick={() => handleEdit(status)}
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
              {selectedStatus ? "Chỉnh sửa" : "Thêm mới"}
            </h2>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={statusName}
              onChange={(e) => setStatusName(e.target.value)}
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

export default StatusEdit;

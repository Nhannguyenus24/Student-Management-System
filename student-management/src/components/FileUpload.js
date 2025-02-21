import { useState } from "react";
import { useDropzone } from "react-dropzone";

const allowedFileTypes = {
  "text/csv": [".csv"],
  "application/json": [".json"],
  "application/xml": [".xml"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"]
};

const FileUpload = ({rerender}) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: allowedFileTypes,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setError(""); // Xóa lỗi nếu file hợp lệ
      }
  
      if (rejectedFiles.length > 0) {
        setError("❌ Chỉ chấp nhận các file CSV, JSON, XML, Excel.");
        setSelectedFile(null);
      }
    }
  });
  

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);

      // Gửi file lên backend bằng fetch API
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch("/api/uploadFile", {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Upload thành công:", data);
          rerender(); // Gọi hàm rerender sau khi upload thành công
        })
        .catch((error) => console.error("Lỗi khi upload:", error));

      setOpen(false);
      setSelectedFile(null);
      setError("");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Nút mở cửa sổ import */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() => setOpen(true)}
      >
        Import file
      </button>

      {/* Modal chọn file */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Chọn hoặc kéo thả file</h2>

            {/* Khu vực kéo thả */}
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer hover:bg-gray-100 transition"
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">Kéo & thả file vào đây hoặc click để chọn file</p>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && <p className="mt-2 text-red-500">{error}</p>}

            {/* Hiển thị tên file hợp lệ */}
            {selectedFile && <p className="mt-2 text-gray-700">📂 {selectedFile.name}</p>}

            {/* Nút Upload & Hủy */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 rounded-md text-white ${
                  selectedFile
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                } transition`}
              >
                Upload
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setSelectedFile(null);
                  setError("");
                }}
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

export default FileUpload;

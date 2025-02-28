import { createMocks } from "node-mocks-http";
import handler from "./uploadFile"; // Import the API handler
import fs from "fs";
import * as Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseString } from "xml2js";

// Mocking required modules
jest.mock("fs");
jest.mock("papaparse");
jest.mock("xlsx");
jest.mock("xml2js");

describe("Upload File API Handler", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocks after each test
  });

  test("POST request with CSV file should add students", async () => {
    const mockCSVFile = {
      mimetype: "text/csv",
      buffer: Buffer.from("mssv,name,faculty\n12345,John Doe,CS\n"),
    };

    Papa.parse.mockReturnValue({
      data: [{ mssv: "12345", name: "John Doe", faculty: "CS" }],
    });

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = mockCSVFile;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(
      JSON.stringify({
        message: "Students added from file",
        count: 1,
      })
    );
  });

  test("POST request with JSON file should add students", async () => {
    const mockJSONFile = {
      mimetype: "application/json",
      buffer: Buffer.from('[{"mssv":"12345","name":"John Doe","faculty":"CS"}]'),
    };

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = mockJSONFile;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(
      JSON.stringify({
        message: "Students added from file",
        count: 1,
      })
    );
  });

  test("POST request with Excel file should add students", async () => {
    const mockExcelFile = {
      mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: Buffer.from("Excel content here"),
    };

    const mockWorkbook = {
      SheetNames: ["Sheet1"],
      Sheets: {
        Sheet1: { A1: { v: "mssv,name,faculty" }, A2: { v: "12345,John Doe,CS" } },
      },
    };
    XLSX.read.mockReturnValue(mockWorkbook);

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = mockExcelFile;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(
      JSON.stringify({
        message: "Students added from file",
        count: 1,
      })
    );
  });

  test("POST request with XML file should add students", async () => {
    const mockXMLFile = {
      mimetype: "application/xml",
      buffer: Buffer.from("<students><student><mssv>12345</mssv><name>John Doe</name><faculty>CS</faculty></student></students>"),
    };

    parseString.mockImplementation((xml, callback) => {
      callback(null, {
        students: { student: [{ mssv: ["12345"], name: ["John Doe"], faculty: ["CS"] }] },
      });
    });

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = mockXMLFile;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(
      JSON.stringify({
        message: "Students added from file",
        count: 1,
      })
    );
  });

  test("POST request should handle empty file", async () => {
    const emptyFile = {
      mimetype: "text/csv",
      buffer: Buffer.from(""),
    };

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = emptyFile;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toBe(JSON.stringify({ message: "Invalid or empty file" }));
  });

  test("POST request should return 400 for unsupported file format", async () => {
    const unsupportedFile = {
      mimetype: "application/pdf",
      buffer: Buffer.from(""),
    };

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = unsupportedFile;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toBe(JSON.stringify({ message: "Unsupported file format" }));
  });

  test("POST request should handle file processing errors", async () => {
    const mockFile = {
      mimetype: "application/json",
      buffer: Buffer.from('{"invalidJson": "test"'),
    };

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = mockFile;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(JSON.stringify({ message: "Invalid file format or corrupt data" }));
  });

  test("POST request should handle no file uploaded", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toBe(JSON.stringify({ message: "No file uploaded" }));
  });

  test("POST request should return 500 on server error", async () => {
    const mockFile = {
      mimetype: "text/csv",
      buffer: Buffer.from("mssv,name\n12345,John Doe"),
    };

    const { req, res } = createMocks({
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    req.file = mockFile;

    // Mock server error
    jest.spyOn(fs, "writeFileSync").mockImplementationOnce(() => {
      throw new Error("Server error");
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toBe(JSON.stringify({ message: "Server error" }));
  });
});

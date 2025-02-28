import { createMocks } from "node-mocks-http";
import handler from "./faculty"; // Import the API handler
import fs from "fs";

// Mock the fs module to avoid actual file system interaction
jest.mock("fs");

describe("Faculty API Handler", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocks after each test
  });

  test("GET request should return a list of faculties", async () => {
    // Mocking the fs.readFileSync method to return a sample JSON
    fs.readFileSync.mockReturnValue(JSON.stringify([{ label: "Math", value: "math" }]));

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe(JSON.stringify([{ label: "Math", value: "math" }]));
  });

  test("POST request should add a new faculty", async () => {
    const newFaculty = { label: "Science", value: "science" };
    const mockFaculties = [{ label: "Math", value: "math" }];
    
    fs.readFileSync.mockReturnValue(JSON.stringify(mockFaculties));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const { req, res } = createMocks({
      method: "POST",
      body: newFaculty,
    });

    await handler(req, res);

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([...mockFaculties, newFaculty], null, 2));
    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(JSON.stringify({ message: "faculty added" }));
  });

  test("POST request should update an existing faculty", async () => {
    const updatedFaculty = { label: "Math", value: "advanced-math" };
    const mockFaculties = [{ label: "Math", value: "math" }];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockFaculties));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const { req, res } = createMocks({
      method: "POST",
      query: { query: "math" },
      body: updatedFaculty,
    });

    await handler(req, res);

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([updatedFaculty], null, 2));
    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(JSON.stringify({ message: "faculty added" }));
  });

  test("POST request should handle missing body", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400); // Expect a bad request error
    expect(res._getData()).toBe(JSON.stringify({ message: "Invalid data" }));
  });

  test("GET request should log faculty fetch", async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([{ label: "Math", value: "math" }]));

    const { req, res } = createMocks({
      method: "GET",
    });

    const writeLogSpy = jest.spyOn(console, "log"); // Spy on the logging function
    await handler(req, res);

    expect(writeLogSpy).toHaveBeenCalledWith("INFO", "Fetched faculty list");
  });

  test("POST request should log adding new faculty", async () => {
    const newFaculty = { label: "History", value: "history" };
    const mockFaculties = [{ label: "Math", value: "math" }];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockFaculties));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const writeLogSpy = jest.spyOn(console, "log");
    const { req, res } = createMocks({
      method: "POST",
      body: newFaculty,
    });

    await handler(req, res);

    expect(writeLogSpy).toHaveBeenCalledWith("INFO", "New faculty added", { label: "History", value: "history" });
  });

  test("POST request should log updating faculty", async () => {
    const updatedFaculty = { label: "Math", value: "advanced-math" };
    const mockFaculties = [{ label: "Math", value: "math" }];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockFaculties));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const writeLogSpy = jest.spyOn(console, "log");
    const { req, res } = createMocks({
      method: "POST",
      query: { query: "math" },
      body: updatedFaculty,
    });

    await handler(req, res);

    expect(writeLogSpy).toHaveBeenCalledWith("INFO", "Faculty updated", { index: 0, label: "Math", value: "advanced-math" });
  });

  test("GET request should handle empty data file", async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe(JSON.stringify([]));
  });

  test("POST request should return 405 for unsupported method", async () => {
    const { req, res } = createMocks({
      method: "PUT", // Unsupported method
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toBe(JSON.stringify({ message: "Method Not Allowed" }));
  });
});

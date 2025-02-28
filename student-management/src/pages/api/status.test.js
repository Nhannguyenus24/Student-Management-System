import { createMocks } from "node-mocks-http";
import handler from "./status"; // Import the API handler
import fs from "fs";

// Mock the fs module to avoid actual file system interaction
jest.mock("fs");

describe("Status API Handler", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocks after each test
  });

  test("GET request should return a list of statuses", async () => {
    // Mocking the fs.readFileSync method to return a sample JSON
    fs.readFileSync.mockReturnValue(JSON.stringify([{ label: "Active", value: "active" }]));

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe(JSON.stringify([{ label: "Active", value: "active" }]));
  });

  test("POST request should add a new status", async () => {
    const newStatus = { label: "Graduated", value: "graduated" };
    const mockStatuses = [{ label: "Active", value: "active" }];
    
    fs.readFileSync.mockReturnValue(JSON.stringify(mockStatuses));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const { req, res } = createMocks({
      method: "POST",
      body: newStatus,
    });

    await handler(req, res);

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([...mockStatuses, newStatus], null, 2));
    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(JSON.stringify({ message: "Status added" }));
  });

  test("POST request should update an existing status", async () => {
    const updatedStatus = { label: "Active", value: "inactive" };
    const mockStatuses = [{ label: "Active", value: "active" }];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockStatuses));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const { req, res } = createMocks({
      method: "POST",
      query: { query: "active" },
      body: updatedStatus,
    });

    await handler(req, res);

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([updatedStatus], null, 2));
    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toBe(JSON.stringify({ message: "Status added" }));
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

  test("GET request should log status fetch", async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([{ label: "Active", value: "active" }]));

    const { req, res } = createMocks({
      method: "GET",
    });

    const writeLogSpy = jest.spyOn(console, "log"); // Spy on the logging function
    await handler(req, res);

    expect(writeLogSpy).toHaveBeenCalledWith("INFO", "Fetched faculty list");
  });

  test("POST request should log adding new status", async () => {
    const newStatus = { label: "Graduated", value: "graduated" };
    const mockStatuses = [{ label: "Active", value: "active" }];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockStatuses));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const writeLogSpy = jest.spyOn(console, "log");
    const { req, res } = createMocks({
      method: "POST",
      body: newStatus,
    });

    await handler(req, res);

    expect(writeLogSpy).toHaveBeenCalledWith("INFO", "New status added", { label: "Graduated", value: "graduated" });
  });

  test("POST request should log updating status", async () => {
    const updatedStatus = { label: "Active", value: "inactive" };
    const mockStatuses = [{ label: "Active", value: "active" }];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockStatuses));
    fs.writeFileSync.mockImplementation(() => {}); // Mock fs.writeFileSync

    const writeLogSpy = jest.spyOn(console, "log");
    const { req, res } = createMocks({
      method: "POST",
      query: { query: "active" },
      body: updatedStatus,
    });

    await handler(req, res);

    expect(writeLogSpy).toHaveBeenCalledWith("INFO", "Status updated", { index: 0, label: "Active", value: "inactive" });
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

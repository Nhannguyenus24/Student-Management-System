import handler from "./index"; // API handler
import fs from "fs";
import { createMocks } from "node-mocks-http";

jest.mock("fs"); // Mock fs để tránh ghi file thật

const mockStudents = [
  { mssv: "123", name: "John Doe", faculty: "IT", year: "2023", status: "active", email: "john@student.edu.vn", phone: "0987654321" },
];

fs.readFileSync.mockReturnValue(JSON.stringify(mockStudents));
fs.writeFileSync.mockImplementation(() => {}); // Tránh ghi file thật

describe("API /api/students", () => {
  it("should return students on GET", async () => {
    const { req, res } = createMocks({ method: "GET" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockStudents);
  });

  it("should filter students by MSSV", async () => {
    const { req, res } = createMocks({ method: "GET", query: { mssv: "123" } });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveLength(1);
  });

  it("should filter students by name (case insensitive)", async () => {
    const { req, res } = createMocks({ method: "GET", query: { name: "john" } });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveLength(1);
  });

  it("should add a new student on POST", async () => {
    const newStudent = { mssv: "456", name: "Jane Doe", faculty: "Math", year: "2024", status: "active", email: "jane@student.edu.vn", phone: "0912345678" };
    const { req, res } = createMocks({ method: "POST", body: newStudent });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData()).message).toBe("Student added");
  });

  it("should return 400 for invalid email", async () => {
    const invalidStudent = { mssv: "789", name: "Bob", faculty: "CS", year: "2025", status: "inactive", email: "invalid-email", phone: "0912345678" };
    const { req, res } = createMocks({ method: "POST", body: invalidStudent });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).message).toBe("Invalid email");
  });

  it("should return 400 for invalid phone number", async () => {
    const invalidStudent = { mssv: "789", name: "Bob", faculty: "CS", year: "2025", status: "inactive", email: "bob@student.edu.vn", phone: "12345" };
    const { req, res } = createMocks({ method: "POST", body: invalidStudent });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).message).toBe("Invalid phone");
  });

  it("should return 400 for duplicate student", async () => {
    const { req, res } = createMocks({ method: "POST", body: mockStudents[0] });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).message).toBe("Student already exists with the same email, phone, or mssv");
  });

  it("should return 400 when missing required fields", async () => {
    const invalidStudent = { name: "Missing MSSV", faculty: "Physics" }; // Thiếu MSSV, email, phone
    const { req, res } = createMocks({ method: "POST", body: invalidStudent });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it("should return 400 for invalid request body format", async () => {
    const { req, res } = createMocks({ method: "POST", body: "invalid_body_format" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it("should return 405 for unsupported HTTP methods", async () => {
    const { req, res } = createMocks({ method: "PUT" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData()).message).toBe("Method Not Allowed");
  });
});

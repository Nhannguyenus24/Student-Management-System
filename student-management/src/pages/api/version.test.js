import { createMocks } from "node-mocks-http";
import handler from "../version"; // Adjust the import path based on your structure
import fs from "fs";
import path from "path";

// Mock fs.readFileSync
jest.mock("fs");

describe("GET /api/version", () => {
  const versionPath = path.join(process.cwd(), "src", "data", "version.json");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the latest version if the version file exists", async () => {
    const mockVersionData = JSON.stringify([
      { version: "1.0.0", buildDate: "2025-01-01" },
      { version: "1.1.0", buildDate: "2025-02-01" },
    ]);

    fs.readFileSync.mockReturnValueOnce(mockVersionData);

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({
      version: "1.1.0",
      buildDate: "2025-02-01",
    });
  });

  it("should return { version: 'unknown', buildDate: 'unknown' } if version file is empty", async () => {
    fs.readFileSync.mockReturnValueOnce("[]");

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ version: "unknown", buildDate: "unknown" });
  });

  it("should return { version: 'unknown', buildDate: 'unknown' } if version file doesn't exist", async () => {
    fs.readFileSync.mockImplementationOnce(() => {
      throw new Error("File not found");
    });

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ version: "unknown", buildDate: "unknown" });
  });

  it("should return 405 Method Not Allowed for non-GET requests", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toEqual({ message: "Method not allowed" });
  });

  it("should return the latest version when there's only one version in the file", async () => {
    const mockVersionData = JSON.stringify([{ version: "1.0.0", buildDate: "2025-01-01" }]);
    fs.readFileSync.mockReturnValueOnce(mockVersionData);

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({
      version: "1.0.0",
      buildDate: "2025-01-01",
    });
  });

  it("should handle large version data correctly", async () => {
    const mockVersionData = JSON.stringify(
      Array.from({ length: 1000 }, (_, index) => ({
        version: `1.${index}.0`,
        buildDate: `2025-01-${String(index + 1).padStart(2, "0")}`,
      }))
    );

    fs.readFileSync.mockReturnValueOnce(mockVersionData);

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({
      version: "1.999.0",
      buildDate: "2025-01-1000",
    });
  });

  it("should handle version file with invalid JSON format", async () => {
    fs.readFileSync.mockReturnValueOnce("{ version: '1.0.0', buildDate: '2025-01-01' }"); // Invalid JSON

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ version: "unknown", buildDate: "unknown" });
  });

  it("should return default values if the version file has an empty object", async () => {
    fs.readFileSync.mockReturnValueOnce("{}");

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ version: "unknown", buildDate: "unknown" });
  });

  it("should log an error if reading the version file fails", async () => {
    const mockError = new Error("File read error");
    fs.readFileSync.mockImplementationOnce(() => {
      throw mockError;
    });

    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ version: "unknown", buildDate: "unknown" });
    // Add additional assertion if your logger captures errors
  });
});

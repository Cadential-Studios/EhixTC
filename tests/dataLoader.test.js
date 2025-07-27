// tests/dataLoader.test.js
const fs = require("fs");
const path = require("path");

describe("Data Loader", () => {
  it("should be valid JSON and contain locations array", () => {
    const data = fs.readFileSync(
      path.join(__dirname, "../src/data/locations.json"),
      "utf-8"
    );
    const json = JSON.parse(data);
    expect(typeof json).toBe("object");
    // Assuming locations.json is an object keyed by id
    const keys = Object.keys(json);
    expect(keys.length).toBeGreaterThan(0);
    const sample = json[keys[0]];
    expect(sample).toHaveProperty("name");
    expect(sample).toHaveProperty("description");
  });
});

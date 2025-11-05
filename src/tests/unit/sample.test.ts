import { describe, it } from "node:test";
import assert from "node:assert";

describe("Sample test", () => {
  it("should pass", () => {
    assert.strictEqual(1 + 1, 2);
  });
});

test("sample test", () => {
  expect(1 + 1).toBe(2);
});

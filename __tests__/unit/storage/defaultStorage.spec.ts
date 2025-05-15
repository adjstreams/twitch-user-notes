import { storage } from "@src/storage/defaultStorage";

describe("defaultStorage.ts", () => {
  it("should be instance of ChromeStorage", () => {
    expect(storage.constructor.name).toBe("ChromeStorage");
  });
});

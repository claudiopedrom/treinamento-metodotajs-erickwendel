import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import fs from "node:fs/promises";

describe("Service Test Suite", () => {
  let _service;
  const filename = "test.ndjson";

  beforeEach(() => {
    _service = new Service({ filename });
  });

  describe("#read", () => {
    // The file exists, but it's empty.
    it("should return an empty array if the file is empty", async () => {
      // If the below line was commented, the test would fail because it would try to read,
      // the file `test.ndjson`, but the file does not exist in the file system.
      // That's why unit test should not depend on the file system and we should mock it.
      jest.spyOn(fs, fs.readFile.name).mockResolvedValue("");

      const result = await _service.read();
      expect(result).toEqual([]);
    });

    // The file does not exist.
    it("should throw an error if the file does not exist", async () => {
      const error = new Error("No such file or directory, open 'test.ndjson'");
      jest.spyOn(fs, "readFile").mockRejectedValue(error);

      await expect(_service.read()).rejects.toThrow(error);
    });

    it("should return users without password if file contains users", async () => {
      // AAA -> Arrange, Act, Assert

      // Arrange
      const dbData = [
        {
          username: "user1",
          password: "password1",
          createdAt: new Date().toISOString(),
        },
        {
          username: "user2",
          password: "password2",
          createdAt: new Date().toISOString(),
        },
      ];

      const fileContents = dbData
        .map((item) => JSON.stringify(item).concat("\n"))
        .join("");

      jest.spyOn(fs, "readFile").mockResolvedValue(fileContents);

      // Act
      const result = await _service.read();

      // Assert
      const expected = dbData.map(({ password, ...rest }) => ({ ...rest }));
      expect(result).toEqual(expected);
    });
  });
});

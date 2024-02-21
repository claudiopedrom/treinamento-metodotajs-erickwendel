import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person";

describe("#Person Suite", () => {
  describe("#validate", () => {
    // A good practice is to always start testing the error cases.
    it("should throw if the name is not present", () => {
      // Mock is the necessary input for the test to work.
      const mockInvalidPerson = {
        name: "",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("name is required")
      );
    });

    it("should throw if the cpf is not present", () => {
      const mockInvalidPerson = {
        name: "John Doe",
        cpf: "",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("cpf is required")
      );
    });

    it("should not throw if person is valid", () => {
      const mockInvalidPerson = {
        name: "John Doe",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).not.toThrow();
    });
  });

  describe("#format", () => {
    // It starts from the principle that the data has already been validated!
    it("should format the person name and CPF", () => {
      // AAA
      // Arrange = Prepare
      const mockPerson = {
        name: "John Doe",
        cpf: "123.456.789-00",
      };

      // Act = Execute
      const formattedPerson = Person.format(mockPerson);

      // Assert = Check
      const expected = {
        name: "John",
        lastName: "Doe",
        cpf: "12345678900",
      };

      expect(formattedPerson).toStrictEqual(expected);
    });
  });

  describe("#save", () => {
    it("should throw if required properties are missing", () => {
      const personWithoutName = { lastName: "Doe", cpf: "12345678900" };
      expect(() => Person.save(personWithoutName)).toThrow(
        new Error(
          'can not save invalid person {"lastName":"Doe","cpf":"12345678900"}'
        )
      );

      const personWithoutLastName = { name: "John", cpf: "12345678900" };
      expect(() => Person.save(personWithoutLastName)).toThrow(
        new Error(
          'can not save invalid person {"name":"John","cpf":"12345678900"}'
        )
      );

      const personWithoutCPF = { name: "John", lastName: "Doe" };
      expect(() => Person.save(personWithoutCPF)).toThrow(
        new Error(
          'can not save invalid person {"name":"John","lastName":"Doe"}'
        )
      );
    });

    it("should not throw if all properties are provided", () => {
      const mockValidPerson = {
        name: "John",
        lastName: "Doe",
        cpf: "12345678900",
      };

      expect(() => Person.save(mockValidPerson)).not.toThrow();
    });
  });

  describe("#process", () => {
    it("should process a valid person", () => {
      // Another idea is not to retest what has already been tested.

      // Remember checkpoints?
      // Already tested from path A to path B, now test from path B to path C (for unit tests).
      // So here, I skip path A (`validate`) and path B (`format`) and go straight to path C (`save`) as these paths have already been validated.

      // This method below makes more sense when you have external interactions such as API calls, databases, etc.

      // Mocks are simulations of functions that you can do when testing behavior!

      // AAA = Arrange, Act, Assert

      // Arrange
      const mockPerson = {
        name: "John Doe",
        cpf: "123.456.789-00",
      };

      jest.spyOn(Person, Person.validate.name).mockReturnValue(); // This is like a return "true", because was already validated.
      // .mockImplementation(() => {
      //   throw new Error("Something went wrong!");
      // });

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        cpf: "12345678900",
        name: "John",
        lastName: "Doe",
      });

      // Act
      const result = Person.process(mockPerson);

      // Assert
      const expected = "ok";
      expect(result).toStrictEqual(expected);
    });
  });
});

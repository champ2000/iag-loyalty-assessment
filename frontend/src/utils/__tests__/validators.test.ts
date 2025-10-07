import { validateAviosForm } from "../validators";

describe("validateAviosForm", () => {
  const validFormData = {
    departureCode: "LHR",
    arrivalCode: "LAX",
    departureTime: new Date("2025-10-08T10:00:00"),
    arrivalTime: new Date("2025-10-08T18:00:00"),
    price: "500",
  };

  it("should pass validation with valid data", () => {
    const result = validateAviosForm(validFormData);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should fail when departure time is after arrival time", () => {
    const invalidData = {
      ...validFormData,
      departureTime: new Date("2025-10-08T19:00:00"),
      arrivalTime: new Date("2025-10-08T18:00:00"),
    };
    const result = validateAviosForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Departure time must be before arrival time");
  });

  it("should fail with invalid departure airport code", () => {
    const invalidData = {
      ...validFormData,
      departureCode: "LHRX",
    };
    const result = validateAviosForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      "Departure airport code must be exactly 3 letters"
    );
  });

  it("should fail with invalid arrival airport code", () => {
    const invalidData = {
      ...validFormData,
      arrivalCode: "LA",
    };
    const result = validateAviosForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Arrival airport code must be exactly 3 letters");
  });

  it("should fail with non-positive price", () => {
    const invalidData = {
      ...validFormData,
      price: "0",
    };
    const result = validateAviosForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Price must be greater than 0");
  });

  it("should fail when departure and arrival airports are the same", () => {
    const invalidData = {
      ...validFormData,
      departureCode: "LHR",
      arrivalCode: "LHR",
    };
    const result = validateAviosForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      "Departure and arrival airports must be different"
    );
  });

  it("should handle case-insensitive airport code comparison", () => {
    const invalidData = {
      ...validFormData,
      departureCode: "LHR",
      arrivalCode: "lhr",
    };
    const result = validateAviosForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      "Departure and arrival airports must be different"
    );
  });

  it("should pass with decimal prices", () => {
    const validDecimalData = {
      ...validFormData,
      price: "199.99",
    };
    const result = validateAviosForm(validDecimalData);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

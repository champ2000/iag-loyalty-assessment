import { formatCurrency } from "../formatters";

describe("formatCurrency", () => {
  it("should return whole numbers without decimals", () => {
    expect(formatCurrency(100)).toBe("100");
    expect(formatCurrency(50)).toBe("50");
  });

  it("should return numbers with decimals when they exist", () => {
    expect(formatCurrency(100.5)).toBe("100.50");
    expect(formatCurrency(50.99)).toBe("50.99");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("0");
  });

  it("should handle numbers with more than 2 decimal places", () => {
    expect(formatCurrency(100.567)).toBe("100.57");
    expect(formatCurrency(50.991)).toBe("50.99");
  });
});

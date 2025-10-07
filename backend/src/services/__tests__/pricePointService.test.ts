import { calculatePricePoints } from "../pricePointService";

describe("calculatePricePoints", () => {
  it("calculates price points for a known route", () => {
    const result = calculatePricePoints("LHR", "LAX", 1000);
    expect(result).toEqual([
      {
        discountPercent: 20,
        cashDiscount: 200,
        aviosRequired: expect.any(Number),
      },
      {
        discountPercent: 50,
        cashDiscount: 500,
        aviosRequired: expect.any(Number),
      },
      {
        discountPercent: 70,
        cashDiscount: 700,
        aviosRequired: expect.any(Number),
      },
      {
        discountPercent: 100,
        cashDiscount: 1000,
        aviosRequired: expect.any(Number),
      },
    ]);
  });

  it("uses default value for unknown route", () => {
    const result = calculatePricePoints("XXX", "YYY", 1000);
    expect(result[0].aviosRequired).toBe(Math.ceil(200 / 0.02));
  });
});

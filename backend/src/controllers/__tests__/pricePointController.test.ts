import { getPricePoints } from "../pricePointController";
import { Request, Response } from "express";

describe("getPricePoints controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        DepartureAirportCode: "LHR",
        ArrivalAirportCode: "LAX",
        DepartureTime: "2025-10-10T10:00:00Z",
        ArrivalTime: "2025-10-10T14:00:00Z",
        Price: 1000,
        Currency: "GBP",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  const testRoutes = [
    { dep: "LHR", arr: "LAX", value: 0.028 },
    { dep: "LHR", arr: "AMS", value: 0.025 },
    { dep: "LHR", arr: "JFK", value: 0.03 },
    { dep: "LGW", arr: "LAX", value: 0.027 },
    { dep: "LGW", arr: "MUC", value: 0.024 },
    { dep: "XXX", arr: "YYY", value: 0.02 }, // default
  ];

  testRoutes.forEach(({ dep, arr, value }) => {
    it(`calculates correct Avios for route ${dep}-${arr}`, () => {
      req.body.DepartureAirportCode = dep;
      req.body.ArrivalAirportCode = arr;
      getPricePoints(req as Request, res as Response);
      const [[responseArg]] = (res.json as jest.Mock).mock.calls;
      expect(responseArg.pricePoints).toHaveLength(4);
      expect(responseArg.pricePoints).toEqual([
        {
          discountPercent: 20,
          cashDiscount: 200,
          aviosRequired: Math.ceil(200 / value),
        },
        {
          discountPercent: 50,
          cashDiscount: 500,
          aviosRequired: Math.ceil(500 / value),
        },
        {
          discountPercent: 70,
          cashDiscount: 700,
          aviosRequired: Math.ceil(700 / value),
        },
        {
          discountPercent: 100,
          cashDiscount: 1000,
          aviosRequired: Math.ceil(1000 / value),
        },
      ]);
      (res.json as jest.Mock).mockClear();
    });
  });

  it("returns 400 for missing fields", () => {
    req.body = {};
    getPricePoints(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: '"DepartureAirportCode" is required',
    });
  });
});

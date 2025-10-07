import { Request, Response } from "express";
import Joi from "joi";
import { calculatePricePoints } from "../services/pricePointService";

export function getPricePoints(req: Request, res: Response) {
  const schema = Joi.object({
    DepartureAirportCode: Joi.string().required(),
    ArrivalAirportCode: Joi.string().required(),
    DepartureTime: Joi.string().required(),
    ArrivalTime: Joi.string().required(),
    Price: Joi.number().required(),
    Currency: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const pricePoints = calculatePricePoints(
    value.DepartureAirportCode,
    value.ArrivalAirportCode,
    value.Price
  );

  res.json({ pricePoints });
}

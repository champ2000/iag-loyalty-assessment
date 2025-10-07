export interface PricePoint {
  discountPercent: number;
  cashDiscount: number;
  aviosRequired: number;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface CalculatorFormData {
  departureCode: string;
  arrivalCode: string;
  departureTime: Date | null;
  arrivalTime: Date | null;
  price: string;
  currency: string;
}

export interface PricePointsResponse {
  pricePoints: PricePoint[];
}

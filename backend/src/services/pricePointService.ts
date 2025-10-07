export interface RouteValue {
  departure: string;
  arrival: string;
  value: number;
}

export interface PricePoint {
  discountPercent: number;
  cashDiscount: number;
  aviosRequired: number;
}

const routeValues: RouteValue[] = [
  { departure: "LHR", arrival: "LAX", value: 0.028 },
  { departure: "LHR", arrival: "AMS", value: 0.025 },
  { departure: "LHR", arrival: "JFK", value: 0.03 },
  { departure: "LGW", arrival: "LAX", value: 0.027 },
  { departure: "LGW", arrival: "MUC", value: 0.024 },
];

const defaultValuePerAvios = 0.02;
const pricePointPercentages = [20, 50, 70, 100];

function getValuePerAvios(departure: string, arrival: string): number {
  const route = routeValues.find(
    (r) => r.departure === departure && r.arrival === arrival
  );
  return route ? route.value : defaultValuePerAvios;
}

export function calculatePricePoints(
  departure: string,
  arrival: string,
  price: number
): PricePoint[] {
  const valuePerAvios = getValuePerAvios(departure, arrival);
  return pricePointPercentages.map((percent) => {
    const cashDiscount = parseFloat((price * (percent / 100)).toFixed(2));
    const aviosRequired = Math.ceil(cashDiscount / valuePerAvios);
    return { discountPercent: percent, cashDiscount, aviosRequired };
  });
}

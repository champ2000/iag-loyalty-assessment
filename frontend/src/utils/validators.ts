interface AviosFormData {
  departureCode: string;
  arrivalCode: string;
  departureTime: Date | null;
  arrivalTime: Date | null;
  price: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateAviosForm = (data: AviosFormData): ValidationResult => {
  // Check if departure time is before arrival time
  if (
    data.departureTime &&
    data.arrivalTime &&
    data.departureTime >= data.arrivalTime
  ) {
    return {
      isValid: false,
      error: "Departure time must be before arrival time",
    };
  }

  // Validate airport codes (3 letters)
  if (!/^[A-Za-z]{3}$/.test(data.departureCode)) {
    return {
      isValid: false,
      error: "Departure airport code must be exactly 3 letters",
    };
  }

  if (!/^[A-Za-z]{3}$/.test(data.arrivalCode)) {
    return {
      isValid: false,
      error: "Arrival airport code must be exactly 3 letters",
    };
  }

  // Validate price
  if (Number(data.price) <= 0) {
    return {
      isValid: false,
      error: "Price must be greater than 0",
    };
  }

  // Check if airports are different
  if (data.departureCode.toUpperCase() === data.arrivalCode.toUpperCase()) {
    return {
      isValid: false,
      error: "Departure and arrival airports must be different",
    };
  }

  return { isValid: true };
};

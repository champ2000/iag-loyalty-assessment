/**
 * Format currency values to show decimals only when they're not .00
 * @param value The number to format
 * @returns Formatted string with decimals only when needed
 */
export const formatCurrency = (value: number): string => {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

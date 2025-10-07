import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { PricePoint, PricePointsResponse } from "../types/calculator";
import { availableCurrencies } from "../constants/currencies";
import { formatCurrency } from "../utils/formatters";
import { validateAviosForm } from "../utils/validators";

interface AviosCalculatorProps {
  initialDepartureTime?: Date;
  initialArrivalTime?: Date;
}

export function AviosCalculator({
  initialDepartureTime = new Date(),
  initialArrivalTime = new Date(),
}: AviosCalculatorProps = {}) {
  const [loading, setLoading] = useState(false);
  const [departureCode, setDepartureCode] = useState("");
  const [arrivalCode, setArrivalCode] = useState("");
  const [departureTime, setDepartureTime] = useState<Date | null>(
    initialDepartureTime
  );
  const [arrivalTime, setArrivalTime] = useState<Date | null>(
    initialArrivalTime
  );
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [pricePoints, setPricePoints] = useState<PricePoint[]>([]);
  const [error, setError] = useState("");

  const selectedCurrency =
    availableCurrencies.find((c: { code: string }) => c.code === currency) ||
    availableCurrencies[0];

  const validateForm = (): boolean => {
    const result = validateAviosForm({
      departureCode,
      arrivalCode,
      departureTime,
      arrivalTime,
      price,
    });

    if (!result.isValid && result.error) {
      setError(result.error);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/price-points", {
        DepartureAirportCode: departureCode.toUpperCase(),
        ArrivalAirportCode: arrivalCode.toUpperCase(),
        DepartureTime: departureTime?.toISOString(),
        ArrivalTime: arrivalTime?.toISOString(),
        Price: Number(price),
        Currency: currency,
      });

      setPricePoints(response.data.pricePoints);
    } catch (err) {
      setError("Failed to calculate price points. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            data-testid="departure-code-input"
            label="Departure Airport Code"
            value={departureCode}
            onChange={(e) => setDepartureCode(e.target.value)}
            required
            fullWidth
            inputProps={{ maxLength: 3 }}
            placeholder="e.g. LHR"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Arrival Airport Code"
            data-testid="arrival-code-input"
            value={arrivalCode}
            onChange={(e) => setArrivalCode(e.target.value)}
            required
            fullWidth
            inputProps={{ maxLength: 3 }}
            placeholder="e.g. LAX"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Departure Time"
            value={departureTime}
            onChange={(newValue) => setDepartureTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                "data-testid": "departure-time-input",
              },
              toolbar: { hidden: false },
            }}
            format="PPp"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Arrival Time"
            value={arrivalTime}
            onChange={(newValue) => setArrivalTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                "data-testid": "arrival-time-input",
              },
              toolbar: { hidden: false },
            }}
            format="PPp"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="currency-select-label">Currency</InputLabel>
            <Select
              labelId="currency-select-label"
              data-testid="currency-select"
              value={currency}
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
            >
              {availableCurrencies.map((curr) => (
                <MenuItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code} - {curr.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Price"
            data-testid="price-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            fullWidth
            type="number"
            inputProps={{
              step: "0.01",
              min: "0.01",
            }}
            placeholder="e.g. 230.43"
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 1 }}>
                  {selectedCurrency.symbol}
                </Box>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            data-testid="submit-button"
          >
            {loading ? (
              <CircularProgress size={24} data-testid="loading-spinner" />
            ) : (
              "Calculate Price Points"
            )}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Box sx={{ mt: 2 }}>
          <Typography color="error" data-testid="error-message">
            {error}
          </Typography>
        </Box>
      )}

      {pricePoints.length > 0 && (
        <Box sx={{ mt: 4 }} data-testid="price-points-container">
          <Typography variant="h6" gutterBottom>
            Available Price Points:
          </Typography>
          <Grid container spacing={2}>
            {pricePoints.map((point, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card data-testid={`price-point-${index}`}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {point.discountPercent}% Off
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Save: {selectedCurrency.symbol}
                      {formatCurrency(point.cashDiscount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avios: {point.aviosRequired.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

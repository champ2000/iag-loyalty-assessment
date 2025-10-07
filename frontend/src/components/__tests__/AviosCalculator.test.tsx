import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { AviosCalculator } from "../AviosCalculator";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock date for consistency in tests
const mockDate = new Date("2025-10-08T10:00:00");

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {component}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

describe("AviosCalculator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    renderWithProviders(<AviosCalculator />);

    expect(screen.getByTestId("departure-code-input")).toBeInTheDocument();
    expect(screen.getByTestId("arrival-code-input")).toBeInTheDocument();
    expect(screen.getByTestId("departure-time-input")).toBeInTheDocument();
    expect(screen.getByTestId("arrival-time-input")).toBeInTheDocument();
    expect(screen.getByTestId("price-input")).toBeInTheDocument();
    expect(screen.getByTestId("currency-select")).toBeInTheDocument();
  });

  it("successfully submits form and displays price points", async () => {
    const mockResponse = {
      data: {
        pricePoints: [
          {
            discountPercent: 25,
            cashDiscount: 50,
            aviosRequired: 7500,
          },
          {
            discountPercent: 50,
            cashDiscount: 100,
            aviosRequired: 15000,
          },
        ],
      },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<AviosCalculator />);

    // Fill form with valid data
    const departureInput = screen.getByTestId("departure-code-input");
    const arrivalInput = screen.getByTestId("arrival-code-input");
    const priceInput = screen.getByTestId("price-input");
    const submitButton = screen.getByTestId("submit-button");

    // Set up our test times
    const departureTime = new Date();
    const arrivalTime = new Date(departureTime.getTime() + 10 * 60000); // Add 10 minutes

    // Get the actual input elements within the form controls
    const departureInputEl = within(departureInput).getByRole("textbox");
    const arrivalInputEl = within(arrivalInput).getByRole("textbox");
    const priceInputEl = within(priceInput).getByRole("spinbutton");

    fireEvent.change(departureInputEl, { target: { value: "LHR" } });
    fireEvent.change(arrivalInputEl, { target: { value: "JFK" } });
    fireEvent.change(priceInputEl, { target: { value: "200" } });

    // Get date picker inputs
    const departureDatePicker = within(
      screen.getByTestId("departure-time-input")
    ).getByRole("textbox");
    const arrivalDatePicker = within(
      screen.getByTestId("arrival-time-input")
    ).getByRole("textbox");

    // Format dates as expected by the DateTimePicker (PPp format)
    const formatDateTime = (date: Date) => {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC", // Ensure consistent timezone handling
      });
    };

    // Simulate date picker changes
    fireEvent.change(departureDatePicker, {
      target: { value: formatDateTime(departureTime) },
    });
    fireEvent.change(arrivalDatePicker, {
      target: { value: formatDateTime(arrivalTime) },
    });

    // Submit form
    fireEvent.click(submitButton);

    // Wait for loading state to appear
    await waitFor(() => {
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // Wait for API response
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    // Verify API call
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/price-points",
      expect.objectContaining({
        DepartureAirportCode: "LHR",
        ArrivalAirportCode: "JFK",
        DepartureTime: expect.any(String),
        ArrivalTime: expect.any(String),
        Price: 200,
        Currency: "GBP", // Default currency
      })
    );

    // Verify results are displayed
    const pricePointsContainer = screen.getByTestId("price-points-container");
    expect(pricePointsContainer).toBeInTheDocument();

    // Check first price point
    const firstPricePoint = screen.getByTestId("price-point-0");
    expect(firstPricePoint).toHaveTextContent("25% Off");
    expect(firstPricePoint).toHaveTextContent("£50");
    expect(firstPricePoint).toHaveTextContent("7,500");

    // Check second price point
    const secondPricePoint = screen.getByTestId("price-point-1");
    expect(secondPricePoint).toHaveTextContent("50% Off");
    expect(secondPricePoint).toHaveTextContent("£100");
    expect(secondPricePoint).toHaveTextContent("15,000");

    // Verify no error message is shown
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});

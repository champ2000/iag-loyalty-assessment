import { Box, Container, Typography } from "@mui/material";
import { AviosCalculator } from "./components/AviosCalculator";

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Avios Price Points Calculator
        </Typography>
        <AviosCalculator />
      </Box>
    </Container>
  );
}

export default App;

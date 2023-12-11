// React
import { Route, Routes } from "react-router-dom";

// Pages
import { MainPage } from "./pages/MainPage";
import { NotFound } from "./pages/NotFound";
import { LandingPage } from "./pages/LandingPage";
import { AdminPage } from "./pages/AdminPage";
import { TicketPage } from "./pages/TicketPage";
import { DashBoard } from "./pages/Dashboard";
import { StaffForm } from "./pages/forms/StaffForm";
import { TicketForm } from "./pages/forms/TicketForm";

// MUI
import { CssBaseline, ThemeProvider } from "@mui/material";

// Color
import { ColorModeContext, useMode } from "./context/theme";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/main" element={<MainPage />}>
              <Route path="admin" element={<AdminPage />} />
              <Route path="tickets" element={<TicketPage />} />
              <Route path="dash" element={<DashBoard />} />
              <Route path="staffform" element={<StaffForm />} />
              <Route path="ticketform" element={<TicketForm />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

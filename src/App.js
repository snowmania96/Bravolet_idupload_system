import "./App.css";
import { Idupload, PageNotFound, RentalAgreement } from "./scenes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme";
import { useMemo } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

function App() {
  const theme = useMemo(() => createTheme(themeSettings("light")), ["light"]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/:id" element={<Idupload />} />
            <Route path="/rentalagreement/:id" element={<RentalAgreement />} />
            <Route path="/pagenotfound" element={<PageNotFound />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
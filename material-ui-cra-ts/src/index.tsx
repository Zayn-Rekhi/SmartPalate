import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Uploader from "./components/Uploader";
import StartPage from "./pages/StartPage";
import UploadPage from "./pages/UploadPage";
import { ThemeProvider, createTheme } from "@mui/material";
import { indigo, purple } from "@mui/material/colors";
import theme from "./theme";
import RecipePage from "./pages/RecipePage";
import FinalPage from "./pages/FinalPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
  {
    path: "/recipes",
    element: <RecipePage />,
  },
  {
    path: "/final",
    element: <FinalPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <div>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </div>
);

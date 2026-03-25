import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import { MainRouter } from "./routes/MainRouter";

const router = createBrowserRouter([...MainRouter]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <>
    <RouterProvider router={router} />
  </>,
);

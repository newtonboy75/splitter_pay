import { createBrowserRouter } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Root from "../../pages/Root";
import ProtectedRoute from "./ProtectedRoute";
import Checkout from "../../pages/Checkout";
import Recents from "../../pages/Recents";
import ActiveDetails from "../../pages/ActiveDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
        index: true,
      },
      {
        path: "/payment/:id",
        element: <ProtectedRoute><Checkout /></ProtectedRoute>,

      },
      {
        path: "/paid/:id",
        element: <ProtectedRoute><Recents /></ProtectedRoute>,

      },
      {
        path: "/active/:id",
        element: <ProtectedRoute><ActiveDetails /></ProtectedRoute>,

      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

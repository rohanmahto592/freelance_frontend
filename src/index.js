import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  // BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Pages/Landing/LandingPage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import PrivateUserRoute from "./Components/PrivateUserRoute";
import User from "./Pages/User/User";
// import { UserRoutes } from "./RoutesPath/DirectedRoutes";
import ExcelFileUploadPage from "./Pages/User/ExcelFileUploadPage";
import Order from "./Pages/OrderStats/Order";
import PrivateDeliveryRoute from "./Components/PrivateDeliveryRoute";
import Delivery from "./Pages/Delivery/Delivery";
import UploadDeliveryFile from "./Pages/Delivery/UploadDeliveryFile";
import PrivateAdminRoute from "./Components/PrivateAdminRoute";
import AdminDashboard from "./Pages/AdminDashboard";
import About from "./Pages/About/About";
import { ContactUs } from "./Pages/ContactUs";
import Error404Page from "./Pages/Error404Page";
const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/user",
        element: (
          <PrivateUserRoute>
            <User />
          </PrivateUserRoute>
        ),
      },
      {
        path: "/user/uploadfile",
        element: (
          <PrivateUserRoute>
            <ExcelFileUploadPage />
          </PrivateUserRoute>
        ),
      },
      {
        path: "/user/order",
        element: (
          <PrivateUserRoute>
            <Order />
          </PrivateUserRoute>
        ),
      },
      {
        path: "/delivery",
        element: (
          <PrivateDeliveryRoute>
            <Delivery />
          </PrivateDeliveryRoute>
        ),
      },
      {
        path: "/delivery/uploadfile",
        element: (
          <PrivateDeliveryRoute>
            <UploadDeliveryFile />
          </PrivateDeliveryRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <PrivateAdminRoute>
            <User />
          </PrivateAdminRoute>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <PrivateAdminRoute>
            <AdminDashboard />
          </PrivateAdminRoute>
        ),
      },
      {
        path: "/admin/uploadfile",
        element: (
          <PrivateAdminRoute>
            <ExcelFileUploadPage />
          </PrivateAdminRoute>
        ),
      },
      {
        path: "/admin/order",
        element: (
          <PrivateAdminRoute>
            <Order />
          </PrivateAdminRoute>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contactus",
        element: <ContactUs />,
      },
      {
        path: "*",
        element: <Error404Page />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

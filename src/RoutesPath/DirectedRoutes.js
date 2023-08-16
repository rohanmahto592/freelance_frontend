import AdminDashboard from "../Pages/AdminDashboard";
import Order from "../Pages/OrderStats/Order";
import ExcelFileUploadPage from "../Pages/User/ExcelFileUploadPage";
export const Adminroutes = [
  { path: "dashboard", element: <AdminDashboard /> },
  {
    path: "uploadfile",
    element: <ExcelFileUploadPage />,
  },
  {
    path:"order",
    element:<Order/>
  }
];
export const UserRoutes = [
  {
    path: "uploadfile",
    element: <ExcelFileUploadPage />,
  },
  {
    path:"order",
    element:<Order/>
  }
];

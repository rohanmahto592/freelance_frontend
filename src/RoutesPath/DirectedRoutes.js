import AdminDashboard from "../Pages/AdminDashboard";
import ExcelFileUploadPage from "../Pages/User/ExcelFileUploadPage";
export const Adminroutes = [
  { path: "dashboard", element: <AdminDashboard /> },
  {
    path: "uploadfile",
    element: <ExcelFileUploadPage />,
  },
];
export const UserRoutes = [
  {
    path: "uploadfile",
    element: <ExcelFileUploadPage />,
  },
];

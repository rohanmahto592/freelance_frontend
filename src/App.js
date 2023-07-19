import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/Landing/LandingPage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import ExcelFileUploadPage from "./Pages/User/ExcelFileUploadPage";
import Error404Page from "./Pages/Error404Page";
import PrivateUserRoute from "./Components/PrivateUserRoute";
import User from "./Pages/User/User";
import Delivery from "./Pages/Delivery/Delivery";
import PrivateDeliveryRoute from "./Components/PrivateDeliveryRoute";
import UploadDeliveryFile from "./Pages/Delivery/UploadDeliveryFile";
import AdminDashboard from "./Pages/AdminDashboard";
import PrivateAdminRoute from "./Components/PrivateAdminRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/user"element={<PrivateUserRoute>< User/></PrivateUserRoute>}>
        <Route path="uploadfile" element={<ExcelFileUploadPage/>}/>
      </Route>
      <Route path="/delivery"element={<PrivateDeliveryRoute>< Delivery/></PrivateDeliveryRoute>}>
        <Route path="uploadfile" element={<UploadDeliveryFile/>}/>
      </Route>
      <Route path="/admin" element={<PrivateAdminRoute><User/></PrivateAdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard/>}/>
        </Route>
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default App;

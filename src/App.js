import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/Landing/LandingPage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import Error404Page from "./Pages/Error404Page";
import PrivateUserRoute from "./Components/PrivateUserRoute";
import User from "./Pages/User/User";
import Delivery from "./Pages/Delivery/Delivery";
import PrivateDeliveryRoute from "./Components/PrivateDeliveryRoute";
import UploadDeliveryFile from "./Pages/Delivery/UploadDeliveryFile";
import PrivateAdminRoute from "./Components/PrivateAdminRoute";
import { Adminroutes, UserRoutes } from "./RoutesPath/DirectedRoutes";
import About from "./Pages/About/About";
import { ContactUs } from "./Pages/ContactUs";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/user"
        element={
          <PrivateUserRoute>
            <User />
          </PrivateUserRoute>
        }
      >
        {UserRoutes?.map((user, index) => (
          <Route key={index} path={user.path} element={user.element} />
        ))}
      </Route>
      <Route
        path="/delivery"
        element={
          <PrivateDeliveryRoute>
            <Delivery />
          </PrivateDeliveryRoute>
        }
      >
        <Route path="uploadfile" element={<UploadDeliveryFile />} />
      </Route>
      <Route
        path="/admin"
        element={
          <PrivateAdminRoute>
            <User />
          </PrivateAdminRoute>
        }
      >
        {Adminroutes?.map((admin, index) => (
          <Route key={index} path={admin.path} element={admin.element} />
        ))}
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default App;

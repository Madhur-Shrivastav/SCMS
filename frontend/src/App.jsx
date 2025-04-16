import { useState, useContext } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ConfirmAccount from "./components/ConfirmAccount";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Inventory from "./Pages/Inventory";
import Procure from "./Pages/Procure";
import Chat from "./Pages/Chat";
import { UserContext } from "./contexts/UserContext";
import { AlertProvider } from "./contexts/AlertContext";
import AWS_LogOut from "./functions/auth/AWS_LogOut";
import UserProfile from "./Pages/UserProfile";
import OrderDetails from "./Pages/OrderDetails";
import BillDetails from "./Pages/BillDetails";
import MedicineDetails from "./Pages/MedicineDetails";
import Retailer from "./Pages/Retailer";
import AddMedicine from "./Pages/AddMedicine";
import UpdateProfile from "./components/UpdateProfile";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    AWS_LogOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AlertProvider>
      <UserContext.Provider value={{ user, setUser, logout: handleLogout }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm" element={<ConfirmAccount />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />

            <Route path="/:userId/*" element={<PrivateRoute />}>
              <Route index element={<Home />} />
              <Route path="update" element={<UpdateProfile />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="add" element={<AddMedicine />} />
              <Route path="chat" element={<Chat />} />
              <Route
                path="inventory/medicine/:medicineId"
                element={<MedicineDetails />}
              />
              {/* <Route path="orders" element={<PendingOrders />} /> */}
              <Route path="procure" element={<Procure />} />
              <Route
                path="procure/retailer/:retailerId"
                element={<Retailer />}
              />
              <Route path="user" element={<UserProfile />} />
              <Route path="order/:orderId" element={<OrderDetails />} />
              <Route
                path="order/:orderId/bill/:billId"
                element={<BillDetails />}
              />
              <Route
                path="order/:orderId/transaction/:billId"
                element={<BillDetails />}
              />
              <Route
                path="procure/retailer/:retailerId/batch/:batchId/medicine/:medicineId"
                element={<MedicineDetails />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </AlertProvider>
  );
}

function PrivateRoute() {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default App;

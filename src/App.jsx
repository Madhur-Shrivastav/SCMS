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
import ConsumerDashboard from "./Pages/ConsumerDashboard";
import Chat from "./Pages/Chat";
import { UserContext } from "./contexts/UserContext";
import AWS_LogOut from "./functions/auth/AWS_LogOut";
import PendingOrders from "./Pages/PendingOrders";
import UserProfile from "./Pages/UserProfile";
import OrderDetails from "./Pages/OrderDetails";
import BillDetails from "./Pages/BillDetails";
import MedicineDetails from "./Pages/MedicineDetails";

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
    <UserContext.Provider value={{ user, setUser, logout: handleLogout }}>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirm" element={<ConfirmAccount />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />

          {/* Home & Chat - Public & Private */}
          <Route path="/" element={<DynamicHome />} />
          <Route path="/chat" element={<DynamicChat />} />

          {/* Private Routes */}
          <Route path="/:userId/*" element={<PrivateRoute />}>
            <Route index element={<Home />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<PendingOrders />} />
            <Route path="order" element={<ConsumerDashboard />} />
            <Route path="user" element={<UserProfile />} />
            <Route path=":orderId/orderdetails" element={<OrderDetails />} />
            <Route path=":billId/billdetails" element={<BillDetails />} />
            <Route
              path=":medicineId/medicinedetails"
              element={<MedicineDetails />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

function DynamicHome() {
  const { user } = useContext(UserContext);
  return user?.id ? <Navigate to={`/${user.id}`} replace /> : <Home />;
}

function DynamicChat() {
  const { user } = useContext(UserContext);
  return user?.id ? <Navigate to={`/${user.id}/chat`} replace /> : <Chat />;
}

function PrivateRoute() {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default App;

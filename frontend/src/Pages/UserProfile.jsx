import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import AWS_LogOut from "../functions/auth/AWS_LogOut";
import getConsumerOrders from "../functions/lambda/GetConsumerOrders";
import getConsumerBills from "../functions/lambda/GetConsumerBills";
import getRetailerOrders from "../functions/lambda/GetRetailerOrders";
import changeOrderState from "../functions/lambda/ChangeOrderState";
import handlePay from "../functions/utility/Payment";
import { FaClipboardList } from "react-icons/fa";
import { ChartNoAxesCombinedIcon } from "lucide-react";
import getRetailerTransactions from "../functions/lambda/GetRetailerTransactions";
import { useAlert } from "../contexts/AlertContext";
import userimg from "/assets/user.jpeg";
import AWS_RemoveUser from "../functions/auth/AWS_RemoveUser";

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  console.log(user);
  const { showAlert } = useAlert();

  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (user?.id) {
      if (user?.role === "Consumer") {
        getConsumerOrders(user.id).then((data) => {
          if (!data.error) {
            setOrders(data.orders || []);
          }
        });
        getConsumerBills(user.id).then((data) => {
          if (!data.error) {
            setBills(data.bills || []);
          }
        });
      } else {
        getRetailerOrders(user.id).then((data) => {
          if (!data.error) {
            setOrders(data.orders || []);
          }
        });
        getRetailerTransactions(user.id).then((data) => {
          if (!data.error) {
            setTransactions(data.transactions || []);
          }
        });
      }
    }
  }, [user]);

  const handleOrderStateChange = (order) => {
    console.log(order);
    const {
      order_id,
      order_status,
      next_status,
      consumer_paid,
      quantity,
      medicine_id,
    } = order;
    changeOrderState(
      order_id,
      order_status,
      next_status,
      consumer_paid,
      quantity,
      medicine_id
    )
      .then((response) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id
              ? { ...order, order_status: next_status }
              : order
          )
        );
        showAlert("success", response.body.message);
      })
      .catch((error) => {
        console.log(error);
        alert(error.error);
      });
  };

  const handleLogout = () => {
    AWS_LogOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleRemoveProfile = async () => {
    AWS_RemoveUser(user)
      .then(() => {
        showAlert("success", "Profile has been deleted successfully!.");
        setUser(null);
        localStorage.clear();
      })
      .catch((error) => {
        console.error(error);
        showAlert("error", error.message);
      });
  };

  return (
    <section className="bg-white min-h-screen p-4 sm:p-6 lg:p-[6rem] flex flex-col gap-8 items-center lg:flex-row lg:items-start">
      <div className="shadow-lg w-full lg:w-1/2 rounded-2xl h-full">
        <div className="flex flex-col p-4 sm:p-6 gap-4">
          <img
            src={user.profileImage || userimg}
            alt={user.name || "Profile"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = userimg;
            }}
            className="rounded-2xl max-h-[50vh] sm:max-h-[35rem] mb-4 w-full object-cover"
          />
          <p className="text-sm text-gray-500 break-words">
            Last login: {user.time} <br />
            Using: {user.device.os}, {user.device.browser}
          </p>

          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between text-sm md:text-base">
              <p className="font-semibold sm:w-1/3">Name</p>
              <p className="font-semibold sm:w-2/3 truncate">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between text-sm md:text-base">
              <p className="font-semibold sm:w-1/3">Email</p>
              <p className="font-semibold sm:w-2/3 truncate">{user.email}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between text-sm md:text-base">
              <p className="font-semibold sm:w-1/3">Contact</p>
              <p className="font-semibold sm:w-2/3 truncate">{user.contact}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between text-sm md:text-base">
              <p className="font-semibold sm:w-1/3">Location</p>
              <p className="font-semibold sm:w-2/3 truncate">
                {user.city}, {user.state}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
            <Link
              to={`/${user.id}/update`}
              className="bg-[#9bd300] hover:bg-[#9bd300c4] p-2 rounded-full text-black font-bold text-sm w-full transition-transform hover:scale-105 text-center"
            >
              EDIT PROFILE
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-[#9bd300] hover:bg-[#9bd300c4] p-2 rounded-full text-black font-bold text-sm w-full transition-transform hover:scale-105 hover:cursor-pointer"
            >
              LOG OUT
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
            <button
              className="text-red-700 cursor-pointer"
              onClick={handleRemoveProfile}
            >
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Orders</h2>
            <FaClipboardList />
          </div>

          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <Link
                    to={`/${user.id}/order/${order.order_id}`}
                    className="font-semibold text-sm hover:text-[#9bd300c4] hover:scale-[1.05] hover:cursor-pointer duration-300 transition-all"
                  >
                    Order Id: {order.order_id}
                  </Link>

                  {user?.role === "Retailer" ? (
                    <button
                      className={` ${
                        order.order_status === "Delivered" &&
                        !order.consumer_paid
                          ? "bg-orange-400"
                          : "bg-[#9bd300]"
                      } text-white px-4 py-2 rounded-full hover:scale-[1.05] hover:cursor-pointer duration-300 ${
                        order.order_status === "Delivered" &&
                        !order.consumer_paid
                          ? "hover:bg-orange-500"
                          : "hover:bg-[#9bd300c4]"
                      }  text-sm w-full sm:w-auto`}
                      onClick={() => handleOrderStateChange(order)}
                      disabled={
                        order.order_status === "Delivered" &&
                        !order.consumer_paid
                      }
                    >
                      {order.order_status === "Pending"
                        ? "Accept Order"
                        : order.order_status === "Accepted"
                        ? "Mark as Dispatched"
                        : order.order_status === "Dispatched"
                        ? "Mark as Delivered"
                        : order.order_status === "Delivered" &&
                          !order.consumer_paid
                        ? "Payment Pending"
                        : "Order Completed"}
                    </button>
                  ) : (
                    <button
                      className={`${
                        order.consumer_paid
                          ? `bg-green-500 hover:bg-green-400`
                          : `bg-red-500 hover:bg-red-400`
                      } text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto hover:scale-[1.05] hover:cursor-pointer duration-300`}
                      onClick={() =>
                        order.order_status !== "Delivered"
                          ? showAlert(
                              "error",
                              "You can only pay after delivery!"
                            )
                          : handlePay(order, user, showAlert)
                      }
                      disabled={order.consumer_paid}
                    >
                      {order.consumer_paid ? "Payment Done" : "Make Payment"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No pending orders</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">
              {user.role === "Retailer" ? "All Payments" : "My Bills"}
            </h2>
            <ChartNoAxesCombinedIcon />
          </div>
          <div className="space-y-2">
            {user.role === "Consumer" && bills.length > 0 ? (
              bills.map((bill) => (
                <Link
                  key={bill.bill_id}
                  to={`/${user.id}/order/${bill.order_id}/bill/${bill.bill_id}`}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="font-semibold text-sm hover:text-[#9bd300c4] hover:scale-[1.05] hover:cursor-pointer duration-300 transition-all">
                    <p>{bill.bill_id}</p>
                  </div>
                  <div className="font-semibold text-sm hover:text-[#9bd300c4] hover:scale-[1.05] hover:cursor-pointer duration-300 transition-all">
                    {" "}
                    <p>₹{bill.amount}</p>
                  </div>
                </Link>
              ))
            ) : user.role === "Retailer" && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Link
                  key={transaction.bill_id}
                  to={`/${user.id}/order/${transaction.order_id}/transaction/${transaction.bill_id}`}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="font-semibold text-sm hover:text-[#9bd300c4] hover:scale-[1.05] hover:cursor-pointer duration-300 transition-all">
                    <p>{transaction.bill_id}</p>
                  </div>
                  <div className="font-semibold text-sm hover:text-[#9bd300c4] hover:scale-[1.05] hover:cursor-pointer duration-300 transition-all">
                    {" "}
                    <p>₹{transaction.amount}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No bills yet</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;

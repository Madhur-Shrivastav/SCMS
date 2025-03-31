import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import AWS_LogOut from "../functions/auth/AWS_LogOut";
import getConsumerOrders from "../functions/lambda/GetConsumerOrders";
import getConsumerBills from "../functions/lambda/GetConsumerBills";
import getRetailerOrders from "../functions/lambda/GetRetailerOrders";
import changeOrderState from "../functions/lambda/ChangeOrderState";
import handlePay from "../functions/Payment";

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const handleLogout = () => {
    AWS_LogOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  console.log(user);
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
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
      }
    }
  }, [user]);

  const handleOrderStateChange = (
    orderId,
    currentState,
    consumerPaid,
    quantity,
    retailer_id,
    medicine_id,
    batch_id
  ) => {
    let nextState = currentState;

    if (currentState === "Pending") {
      nextState = "Accepted";
    } else if (currentState === "Accepted") {
      nextState = "Dispatched";
    } else if (currentState === "Dispatched") {
      if (consumerPaid) {
        nextState = "Delivered";
      } else {
        alert("Payment has not been made yet!");
        return;
      }
    } else if (currentState === "Delivered") {
      nextState = "Completed";
    }

    changeOrderState(
      orderId,
      currentState,
      consumerPaid,
      quantity,
      retailer_id,
      medicine_id,
      batch_id
    )
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, status: nextState } : order
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section className="bg-white min-h-screen p-6 lg:p-[6rem] flex flex-col gap-8 items-center md:p-10 lg:flex-row lg:items-start">
      <div className="shadow-lg w-full lg:w-1/2 rounded-2xl h-full">
        <div className="flex flex-col p-6 gap-4">
          <img
            src={user.profileImage}
            alt="Profile"
            className="rounded-2xl max-h-[1/2] sm:max-h-[35rem] mb-4 w-full"
          />
          <p className="text-sm text-gray-500">
            Last login: {user.time} <br />
            Using: {user.device.os}, {user.device.browser}
          </p>
          <div className="text-center mt-4">
            <div className="flex justify-center sm:justify-between text-sm md:text-base">
              <p className="hidden sm:block font-semibold">Name</p>
              <p className="font-semibold overflow-hidden">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <hr className="my-4" />
            <div className="flex justify-center sm:justify-between text-sm md:text-base">
              <p className="hidden sm:block font-semibold">Email</p>
              <p className="font-semibold overflow-hidden">{user.email}</p>
            </div>

            <hr className="my-4" />
            <div className="flex justify-center sm:justify-between text-sm md:text-base">
              <p className="hidden sm:block font-semibold">Contact</p>
              <p className="font-semibold overflow-hidden">{user.contact}</p>
            </div>

            <hr className="my-4" />
            <div className="flex justify-center sm:justify-between text-sm md:text-base">
              <p className="hidden sm:block font-semibold">Location</p>
              <p className="font-semibold overflow-hidden">
                {user.city}, {user.state}
              </p>
            </div>
          </div>
          <div className="flex gap-[1rem]">
            <button
              type="submit"
              className="bg-yellow-300 hover:bg-yellow-500 p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.05] duration-[300ms] font-bold text-[14px] w-full"
            >
              EDIT PROFILE
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-yellow-300 hover:bg-yellow-500 p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.05] duration-[300ms] font-bold text-[14px] w-full"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 w-full lg:w-1/2 justify-center ">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Pending Orders</h2>
          <div className="mt-4 space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex justify-between items-center"
                >
                  <Link
                    to={`/${user.id}/${order.order_id}/orderdetails`}
                    className="transition-scale hover:scale-[1.02] duration-300 hover:text-yellow-400"
                  >
                    <div>
                      <p className="font-semibold overflow-hidden">
                        Order Id: {order.order_id}
                      </p>
                    </div>
                  </Link>

                  {user?.role === "Retailer" ? (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-400"
                      onClick={() =>
                        handleOrderStateChange(
                          order.order_id,
                          order.status,
                          order.consumer_paid,
                          order.quantity,
                          order.retailer_id,
                          order.medicine_id,
                          order.batch_id
                        )
                      }
                    >
                      {order.status === "Pending"
                        ? "Accept Order"
                        : order.status === "Accepted"
                        ? "Mark as Dispatched"
                        : order.status === "Dispatched"
                        ? "Mark as Delivered"
                        : "Order Completed"}
                    </button>
                  ) : (
                    <button
                      className={`${
                        order.consumer_paid
                          ? `bg-green-500 hover:bg-green-400`
                          : `bg-red-500 hover:bg-red-400`
                      } text-white px-4 py-2 rounded-full cursor-pointer `}
                      onClick={() => handlePay(order, user)}
                      disabled={order.consumer_paid}
                    >
                      {order.consumer_paid ? "Payment Done" : "Make Payment"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No pending orders</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold">
            {user.role === "Retailer" ? "All Payments" : "My Bills"}
          </h2>
          <div className="mt-4 space-y-2">
            {bills.length > 0 ? (
              bills.map((bill, index) => (
                <Link
                  to={`/${user.id}/${bill.bill_id}/billdetails`}
                  key={index}
                  className="flex justify-between items-center my-2 transition-scale hover:scale-[1.02] duration-300 hover:text-yellow-400"
                >
                  <div className="flex items-center gap-2">
                    <p>{bill.bill_id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>Rupees: {bill.amount}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No bills yet</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;

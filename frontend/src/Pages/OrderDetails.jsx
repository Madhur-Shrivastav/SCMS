import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getConsumerOrders from "../functions/lambda/GetConsumerOrders";
import getRetailerOrders from "../functions/lambda/GetRetailerOrders";
import { UserContext } from "../contexts/UserContext";

const OrderDetails = () => {
  const { user } = new useContext(UserContext);
  const { userId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (userId) {
      if (user?.role === "Consumer") {
        getConsumerOrders(userId).then((data) => {
          if (!data.error) {
            setOrders(data.orders || []);
            const foundOrder = data.orders.find(
              (order) => order.order_id === orderId
            );
            setOrder(foundOrder || null);
            setLoading(false);
          }
        });
      } else {
        getRetailerOrders(userId).then((data) => {
          if (!data.error) {
            setOrders(data.orders || []);
            const foundOrder = data.orders.find(
              (order) => order.order_id === orderId
            );
            setOrder(foundOrder || null);
            setLoading(false);
          }
        });
      }
    }
  }, [userId, orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  const isConsumer = order.consumer_id === user.id;
  const isRetailer = order.retailer_id === user.id;

  if (!isConsumer && !isRetailer) {
    return <p>You are not authorized to view this order.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      <p>
        <strong>Order ID:</strong> {order.order_id}
      </p>
      {isRetailer && (
        <p>
          <strong>Batch ID:</strong> {order.batch_id}
        </p>
      )}
      <p>
        <strong>Medicine ID:</strong> {order.medicine_id}
      </p>
      <p>
        <strong>Quantity:</strong> {order.quantity}
      </p>
      <p>
        <strong>Payed:</strong> {order.consumer_paid ? "True" : "False"}
      </p>
      {user?.role === "Consumer" ? (
        <p>
          <strong>Retailer ID:</strong> {order.retailer_id}
        </p>
      ) : (
        <p>
          <strong>Consumer ID:</strong> {order.consumer_id}
        </p>
      )}
      <p>
        <strong>Status:</strong> {order.order_status}
      </p>
      <p>
        <strong>Time & Date:</strong> {order.time_date || "N/A"}
      </p>
    </div>
  );
};

export default OrderDetails;

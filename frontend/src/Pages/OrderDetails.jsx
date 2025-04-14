import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import getOrderDetails from "../functions/lambda/GetOrderDetails";
import { UserContext } from "../contexts/UserContext";

const OrderDetails = () => {
  const { user } = useContext(UserContext);
  const { userId, orderId } = useParams();
  console.log(useParams());
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const getDetails = async () => {
      try {
        const orderInfo = await getOrderDetails(orderId);
        console.log(orderInfo);
        setOrder(orderInfo.order);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [orderId, userId]);

  if (loading) return <p>Loading bill details...</p>;
  if (!order) return <p>Bill not found.</p>;

  console.log(order);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      <p>
        <strong>Order ID:</strong> {order.order_id}
      </p>
      {user?.role === "Retailer" && (
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

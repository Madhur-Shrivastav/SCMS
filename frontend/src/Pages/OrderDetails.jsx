import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import getOrderDetails from "../functions/lambda/GetOrderDetails";

const Detail = ({ label, value }) => (
  <p className="text-base sm:text-lg break-words">
    <span className="font-semibold">{label}:</span>{" "}
    <span className="break-all">{value}</span>
  </p>
);

const OrderDetails = () => {
  const { userId, orderId } = useParams();
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Order Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Retailer
            </h2>
            <Detail label="Name" value={order.retailer_name} />
            <Detail label="Contact" value={order.retailer_contact} />
            <Detail label="Email" value={order.retailer_email} />
            <Detail label="Address" value={order.retailer_address} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Consumer
            </h2>
            <Detail label="Name" value={order.consumer_name} />
            <Detail label="Contact" value={order.consumer_contact} />
            <Detail label="Email" value={order.consumer_email} />
            <Detail label="Address" value={order.consumer_address} />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Order Info
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Detail label="Order ID" value={order.order_id} />
              <Detail label="Medicine ID" value={order.medicine_id} />
              <Detail label="Quantity" value={order.quantity} />
              <Detail label="Product Name" value={order.product_name} />
              <Detail label="Manufacturer" value={order.product_manufactured} />
              <Detail label="Price (₹)" value={`₹${order.product_price}`} />
              <Detail
                label="Consumer Paid"
                value={
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.consumer_paid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.consumer_paid ? "Yes" : "No"}
                  </span>
                }
              />
              <Detail
                label="Order Status"
                value={
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {order.order_status}
                  </span>
                }
              />
              <Detail label="Date/Time" value={order.time_date} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

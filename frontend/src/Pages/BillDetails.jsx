import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getBillDetails from "../functions/lambda/GetBillDetails";

const BillDetails = () => {
  const { userId, billId, orderId } = useParams();
  console.log(useParams());
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !billId) return;

    const getDetails = async () => {
      try {
        const billInfo = await getBillDetails(billId, orderId);
        console.log(billInfo);
        setBill(billInfo.bill);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [billId, userId]);

  if (loading) return <p>Loading bill details...</p>;
  if (!bill) return <p>Bill not found.</p>;

  console.log(bill);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base text-gray-700">
          <div className="space-y-4">
            <h1 className="font-bold text-2xl sm:text-3xl text-gray-800">
              Product Details
            </h1>
            <p className="text-base sm:text-lg break-words">
              <span className="font-semibold">Product Name:</span>{" "}
              {bill.product_name}
            </p>
            <p className="text-base sm:text-lg break-words">
              <span className="font-semibold">Manufacturer:</span>{" "}
              {bill.product_manufactured}
            </p>
            <p className="text-base sm:text-lg break-words">
              <span className="font-semibold">Price:</span> ₹
              {bill.product_price}
            </p>
            <p className="text-base sm:text-lg break-words">
              <span className="font-semibold">Quantity:</span> {bill.quantity}
            </p>
            <p className="text-base sm:text-lg break-words">
              <span className="font-semibold">Date/Time:</span> {bill.time_date}
            </p>
          </div>

          {userId === bill.consumer_id ? (
            <div className="space-y-4">
              <h1 className="font-bold text-2xl sm:text-3xl text-gray-800">
                Retailer Details
              </h1>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Name:</span>{" "}
                {bill.retailer_name}
              </p>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Contact:</span>{" "}
                {bill.retailer_contact}
              </p>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Email:</span>{" "}
                {bill.retailer_email}
              </p>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Address:</span>{" "}
                {bill.retailer_address}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="font-bold text-2xl sm:text-3xl text-gray-800">
                Consumer Details
              </h1>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Name:</span>{" "}
                {bill.consumer_name}
              </p>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Contact:</span>{" "}
                {bill.consumer_contact}
              </p>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Email:</span>{" "}
                {bill.consumer_email}
              </p>
              <p className="text-base sm:text-lg break-words">
                <span className="font-semibold">Address:</span>{" "}
                {bill.consumer_address}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-between items-center mt-8 md:mt-10 border-t border-gray-300 pt-4">
          <p className="text-xl font-semibold text-gray-800 w-full sm:w-auto break-words">
            <span className="font-semibold">Bill ID:</span> {bill.bill_id}
          </p>
          <p className="text-xl font-semibold text-gray-800 w-full sm:w-auto break-words">
            <span className="font-semibold">Amount Paid:</span> ₹{bill.amount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;

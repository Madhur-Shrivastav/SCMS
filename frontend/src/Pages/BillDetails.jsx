import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getBillDetails from "../functions/lambda/GetBillDetails";
import formatDate from "../functions/utility/FormatDate";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base text-gray-700">
          <div className="space-y-2">
            <h1 className="font-bold text-2xl sm:text-3xl">Product Details</h1>
            <p className="text-base sm:text-lg">
              Product Name: {bill.product_name}
            </p>
            <p className="text-base sm:text-lg">
              Manufacturer: {bill.product_manufactured}
            </p>
            <p className="text-base sm:text-lg">Price: ₹{bill.product_price}</p>
            <p className="text-base sm:text-lg">Quantity: {bill.quantity}</p>
            <p className="text-base sm:text-lg">Date/Time: {bill.time_date}</p>
          </div>
          {userId === bill.consumer_id ? (
            <div className="space-y-2">
              <h1 className="font-bold text-2xl sm:text-3xl">
                Retailer Details
              </h1>
              <p className="text-base sm:text-lg">Name: {bill.retailer_name}</p>
              <p className="text-base sm:text-lg">
                Contact: {bill.retailer_contact}
              </p>
              <p className="text-base sm:text-lg">
                Email: {bill.retailer_email}
              </p>
              <p className="text-base sm:text-lg">
                Address: {bill.retailer_address}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="font-bold text-2xl sm:text-3xl">
                Consumer Details
              </h1>
              <p className="text-base sm:text-lg">Name: {bill.consumer_name}</p>
              <p className="text-base sm:text-lg">
                Contact: {bill.consumer_contact}
              </p>
              <p className="text-base sm:text-lg">
                Email: {bill.consumer_email}
              </p>
              <p className="text-base sm:text-lg">
                Address: {bill.consumer_address}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
          <p className="text-xl font-semibold text-gray-800">
            Bill ID: {bill.bill_id}
          </p>
          <p className="text-xl font-semibold text-gray-800">
            Amount Payed: ₹{bill.amount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;

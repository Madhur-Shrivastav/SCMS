import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getConsumerBills from "../functions/lambda/GetConsumerBills";

const BillDetails = () => {
  const { userId, billId } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  useEffect(() => {
    if (userId) {
      getConsumerBills(userId).then((data) => {
        if (!data.error) {
          setBills(data.bills || []);
          const foundBill = data.bills.find((bill) => bill.bill_id === billId);
          setBill(foundBill || null);
          setLoading(false);
        }
      });
    }
  }, [userId, billId]);

  if (loading) return <p>Loading bill details...</p>;
  if (!bill) return <p>Bill not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">bill Details</h2>
      <p>
        <strong>bill ID:</strong> {bill.bill_id}
      </p>

      <p>
        <strong>Amount:</strong> {bill.amount}
      </p>
      <p>
        <strong>Consumer ID:</strong> {bill.consumer_id}
      </p>

      <p>
        <strong>Time & Date:</strong> {bill.time_date || "N/A"}
      </p>
    </div>
  );
};

export default BillDetails;

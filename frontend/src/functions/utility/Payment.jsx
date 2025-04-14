import getMedicineDetails from "../lambda/GetMedicineDetails";
import getRetailerDetails from "../lambda/GetRetailerDetails";
import makeBill from "../lambda/MakeBill";
import makePayment from "../lambda/MakePayment";

export default async function handlePay(order, user, showAlert) {
  if (!window.Razorpay) {
    alert("Razorpay SDK not loaded. Please try again later.");
    return;
  }

  const medicine = await getMedicineDetails(order.medicine_id);
  const price = parseFloat(
    medicine.details.product_price.replace(/[^\d.]/g, "")
  );
  const retailer = await getRetailerDetails(order.retailer_id);

  const options = {
    key: "rzp_test_soz2eu4ImIgju2",
    amount: price * order.quantity * 100,
    currency: "INR",
    name: "Pharmly",
    description: "Purchase Description",
    handler: async function (response) {
      console.log("Payment successful:", response);

      try {
        await makePayment(order.order_id);
        await makeBill(
          order,
          price * order.quantity,
          medicine,
          user,
          retailer,
          response.razorpay_payment_id
        );
      } catch (err) {
        console.error(err);
        showAlert({
          type: "error",
          message: "Something went wrong while processing the payment.",
        });
      }

      showAlert("success", "Payment completed and bill generated!");
    },
    prefill: {
      name: user.firstName + " " + user.lastName,
      email: user.email,
      contact: user.contact,
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
//5267318187975449


import getMedicineDetails from "./lambda/GetMedicineDetails";
import makePayment from "./lambda/MakePayment";

export default async function handlePay(order, user) {
  if (!window.Razorpay) {
    alert("Razorpay SDK not loaded. Please try again later.");
    return;
  }

  const medicine = await getMedicineDetails(order.medicine_id);
  const price = parseFloat(
    medicine.details.product_price.replace(/[^\d.]/g, "")
  );
  console.log(price);
  const options = {
    key: "rzp_test_soz2eu4ImIgju2",
    amount: price * order.quantity * 100,
    currency: "INR",
    name: "Pharmly",
    description: "Purchase Description",
    handler: function (response) {
      console.log("Payment successful:", response);
      makePayment(order.order_id);
      console.log(
        order.order_id,
        response.razorpay_payment_id,
        user.id,
        price * order.quantity
      );

      alert("Payment ID: " + response.razorpay_payment_id);
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
// const razorpay = new Razorpay({
//   key_id: "rzp_test_soz2eu4ImIgju2",
//   key_secret: "pstKjM5wfv3OvbgsWBo6F4Dk",
// });

import formatDate from "../utility/FormatDate";
import getAWSLambda from "./getAWSLambda";

export default async function getBillDetails(billId, orderId) {
  const lambda = getAWSLambda();
  const params = {
    FunctionName: "GetBillDetails",
    Payload: JSON.stringify({ body: { bill_id: billId, order_id: orderId } }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);
    const result =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;
    console.log(result);

    const bill = result;
    const formattedBill = {
      bill_id: bill.bill_id.S,
      consumer_id: bill.consumer_id.S,
      retailer_id: bill.retailer_id.S,
      order_id: bill.order_id.S,
      amount: bill.amount.N,
      quantity: bill.quantity.N,
      product_name: bill.product_name.S,
      product_manufactured: bill.product_manufactured.S,
      product_price: bill.product_price.N,
      time_date: bill.time_date.S,
      consumer_name: bill.consumer_name.S,
      consumer_email: bill.consumer_email.S,
      consumer_contact: bill.consumer_contact.S,
      consumer_address: bill.consumer_address.S,
      retailer_name: bill.retailer_name.S,
      retailer_contact: bill.retailer_contact.S,
      retailer_email: bill.retailer_email.S,
      retailer_address: bill.retailer_address.S,
    };

    console.log("Bill Data:", formattedBill);
    return { bill: formattedBill };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

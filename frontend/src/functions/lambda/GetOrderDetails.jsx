import getAWSLambda from "./getAWSLambda";

export default async function getOrderDetails(orderId) {
  const lambda = getAWSLambda();
  const params = {
    FunctionName: "GetOrderDetails",
    Payload: JSON.stringify({ body: { order_id: orderId } }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);
    const result =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;
    console.log(result);

    const order = result;
    const formattedOrder = {
      order_id: order.order_id?.S || "",
      medicine_id: order.medicine_id?.S || "",
      product_name: order.product_name?.S || "",
      product_price: order.product_price?.N || "0",
      product_manufactured: order.product_manufactured?.S || "",

      consumer_id: order.consumer_id?.S || "",
      consumer_name: order.consumer_name?.S || "",
      consumer_email: order.consumer_email?.S || "",
      consumer_contact: order.consumer_contact?.S || "",
      consumer_address: order.consumer_address?.S || "",
      consumer_paid: order.consumer_paid?.BOOL ?? false,

      retailer_id: order.retailer_id?.S || "",
      retailer_name: order.retailer_name?.S || "",
      retailer_email: order.retailer_email?.S || "",
      retailer_contact: order.retailer_contact?.S || "",
      retailer_address: order.retailer_address?.S || "",

      quantity: order.quantity?.N || "1",
      batch_id: order.batch_id?.S || "",
      order_status: order.order_status?.S || "Pending",
      next_status: order.next_status?.S || "Accepted",
      time_date: order.time_date?.S || new Date().toLocaleString(),
    };

    console.log("Order Data:", formattedOrder);
    return { order: formattedOrder };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

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
      order_id: order.order_id.S,
      medicine_id: order.medicine_id.S,
      quantity: order.quantity.N,
      batch_id: order.batch_id.S,
      consumer_paid: order.consumer_paid.BOOL,
      consumer_id: order.consumer_id.S,
      retailer_id: order.retailer_id.S,
      next_status: order.next_status.S,
      order_status: order.order_status.S,
      time_date: order.time_date.S,
    };

    console.log("Order Data:", formattedOrder);
    return { order: formattedOrder };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

import getAWSLambda from "./getAWSLambda";

export default async function getRetailerOrders(retailerId) {
  const lambda = getAWSLambda();
  const params = {
    FunctionName: "GetRetailerOrders",
    Payload: JSON.stringify({ retailer_id: retailerId }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const orders =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;

    const formattedOrders = orders.map((item) => ({
      medicine_id: item.medicine_id.S,
      order_id: item.order_id.S,
      quantity: item.quantity.N,
      order_status: item.order_status.S,
      next_status: item.next_status.S,
      time_date: item.time_date.S,
      consumer_paid: item.consumer_paid.BOOL,
    }));

    console.log("Formatted Orders:", formattedOrders);

    return { orders: formattedOrders };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

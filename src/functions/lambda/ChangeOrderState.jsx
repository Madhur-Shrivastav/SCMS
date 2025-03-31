import getAWSLambda from "./getAWSLambda";

export default async function changeOrderState(
  orderId,
  currentState,
  consumerPaid,
  quantity,
  retailer_id,
  medicine_id,
  batch_id
) {
  const lambda = getAWSLambda();
  try {
    const payload = {
      order_id: orderId,
      current_state: currentState,
      consumer_paid: consumerPaid,
      quantity: quantity,
      retailer_id: retailer_id,
      medicine_id: medicine_id,
      batch_id: batch_id,
    };

    const params = {
      FunctionName: "ChangeOrderStatus",
      Payload: JSON.stringify({ body: payload }),
    };

    console.log("Sending Payload:", params.Payload);
    const response = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(response.Payload);

    if (response.StatusCode === 200) {
      console.log("Order status updated successfully:", responsePayload);
      return responsePayload;
    } else {
      console.error("Error updating order status:", responsePayload);
      return { error: "Failed to update order status" };
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Lambda invocation failed" };
  }
}

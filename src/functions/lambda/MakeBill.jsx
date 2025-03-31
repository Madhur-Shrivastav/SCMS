import getAWSLambda from "./getAWSLambda";

export default async function makeBill(orderId, billId, consumerId, amount) {
  const lambda = getAWSLambda();

  try {
    const payload = JSON.stringify({
      body: {
        order_id: orderId,
        bill_id: billId,
        consumer_id: consumerId,
        amount: amount,
      },
    });

    const params = {
      FunctionName: "MakeBill",
      Payload: payload,
    };

    const response = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(response.Payload);

    console.log("Bill:", responsePayload);

    if (responsePayload.statusCode === 200) {
      console.log("Consumer payment status updated:", responsePayload);
      return responsePayload;
    } else {
      console.error("Error updating consumer payment status:", responsePayload);
      return { error: "Failed to update consumer payment status" };
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Lambda invocation failed" };
  }
}

import getAWSLambda from "./getAWSLambda";

export default async function makePayment(orderId) {
  const lambda = getAWSLambda();

  try {
    const payload = JSON.stringify({ body: { order_id: orderId } });

    const params = {
      FunctionName: "MakePayment",
      Payload: payload,
    };

    const response = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(response.Payload);

    console.log("Payment response:", responsePayload);

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

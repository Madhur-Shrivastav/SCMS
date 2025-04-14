import getAWSLambda from "./getAWSLambda";

export default async function orderMedicine(
  consumerId,
  retailerId,
  medicineId,
  batchId,
  quantity
) {
  const lambda = getAWSLambda();
  const payload = JSON.stringify({
    body: {
      consumer_id: consumerId,
      retailer_id: retailerId,
      medicine_id: medicineId,
      batch_id: batchId,
      quantity,
    },
  });

  const params = {
    FunctionName: "OrderMedicine",
    Payload: payload,
  };

  console.log(params);

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);
    console.log(response);
    return data;
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

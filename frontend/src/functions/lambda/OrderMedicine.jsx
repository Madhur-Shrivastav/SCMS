import getAWSLambda from "./getAWSLambda";

export default async function ({
  retailerId,
  consumerId,
  batchId,
  product_name,
  product_price,
  product_manufactured,
  consumer_name,
  consumer_contact,
  consumer_email,
  consumer_address,
  retailer_name,
  retailer_contact,
  retailer_email,
  retailer_address,
  quantity,
  medicineId,
}) {
  const lambda = getAWSLambda();
  const payload = JSON.stringify({
    body: {
      consumer_id: consumerId,
      retailer_id: retailerId,
      medicine_id: medicineId,
      batch_id: batchId,
      product_name,
      product_price,
      product_manufactured,
      consumer_name,
      consumer_contact,
      consumer_email,
      consumer_address,
      retailer_name,
      retailer_contact,
      retailer_email,
      retailer_address,
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

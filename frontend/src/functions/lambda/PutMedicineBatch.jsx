import getAWSLambda from "./getAWSLambda";

export default async function putMedicineBatch(retailerId, medicines) {
  const lambda = getAWSLambda();
  const payload = {
    retailer_id: retailerId,
    medicines: medicines,
  };

  console.log(payload);
  const params = {
    FunctionName: "PutMedicineBatch",
    Payload: JSON.stringify({ body: payload }),
  };

  try {
    const response = await lambda.invoke(params).promise();

    const data = JSON.parse(response.Payload);

    return data;
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to insert medicine batch" };
  }
}

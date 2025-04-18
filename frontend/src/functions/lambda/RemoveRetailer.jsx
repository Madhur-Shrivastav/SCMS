import getAWSLambda from "./getAWSLambda";

export default async function removeRetailer(retailer_id) {
  const lambda = getAWSLambda();
  try {
    const payload = {
      retailer_id,
    };

    const params = {
      FunctionName: "RemoveRetailer",
      Payload: JSON.stringify({ body: payload }),
    };

    const response = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(response.Payload);

    if (response.StatusCode === 200) {
      console.log("Retailer deleted successfully:", responsePayload);
      return responsePayload;
    } else {
      console.error("Error deleting retailer:", responsePayload);
      return { error: "Failed to delete retailer" };
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Lambda invocation failed" };
  }
}

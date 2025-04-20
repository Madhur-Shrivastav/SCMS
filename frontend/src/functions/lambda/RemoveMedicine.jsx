import getAWSLambda from "./getAWSLambda";

export default async function removeMedicine(medicine_id) {
  const lambda = getAWSLambda();
  try {
    const payload = {
      medicine_id,
    };

    const params = {
      FunctionName: "RemoveMedicine",
      Payload: JSON.stringify({ body: payload }),
    };

    const response = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(response.Payload);

    if (response.StatusCode === 200) {
      console.log("Medicine deleted successfully:", responsePayload);
      return responsePayload;
    } else {
      console.error("Error deleting medicine:", responsePayload);
      return { error: "Failed to delete medicine" };
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Lambda invocation failed" };
  }
}

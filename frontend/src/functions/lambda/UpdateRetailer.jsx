import getAWSLambda from "./getAWSLambda";

export default async function updateRetailer(
  retailer_id,
  email,
  name,
  contact,
  city,
  state,
  address,
  role,
  profileImage
) {
  const lambda = getAWSLambda();
  try {
    const payload = {
      retailer_id,
      email,
      name,
      contact,
      city,
      state,
      address,
      role,
      profileImage,
    };

    const params = {
      FunctionName: "UpdateRetailer",
      Payload: JSON.stringify({ body: payload }),
    };

    const response = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(response.Payload);

    if (response.StatusCode === 200) {
      console.log("Retailer updated successfully:", responsePayload);
      return responsePayload;
    } else {
      console.error("Error updating retailer:", responsePayload);
      return { error: "Failed to update retailer" };
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Lambda invocation failed" };
  }
}

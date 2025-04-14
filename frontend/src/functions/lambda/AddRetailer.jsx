import getAWSLambda from "./getAWSLambda";

export default async function addRetailer(
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
      retailer_id: retailer_id,
      email: email,
      name: name,
      contact: contact,
      city: city,
      state: state,
      address: address,
      role: role,
      profileImage: profileImage,
    };

    const params = {
      FunctionName: "AddRetailer",
      Payload: JSON.stringify({ body: payload }),
    };

    console.log("Sending Payload:", params.Payload);
    const response = await lambda.invoke(params).promise();
    const responsePayload = JSON.parse(response.Payload);

    if (response.StatusCode === 200) {
      console.log("Retailer added successfully:", responsePayload);
      return responsePayload;
    } else {
      console.error("Error adding retailer:", responsePayload);
      return { error: "Failed to add retailer" };
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Lambda invocation failed" };
  }
}

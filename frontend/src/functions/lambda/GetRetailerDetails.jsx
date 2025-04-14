import getAWSLambda from "./getAWSLambda";

export default async function getRetailerDetails(retailerId) {
  console.log(retailerId);
  const lambda = getAWSLambda();
  const params = {
    FunctionName: "GetRetailerDetails",
    Payload: JSON.stringify({ body: { retailer_id: retailerId } }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);
    const result =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;

    const retailer = result.data;
    const formattedRetailer = {
      name: retailer.name.S,
      profileImage: retailer.profileImage.S,
      contact: retailer.contact.S,
      address: retailer.address.S,
      email: retailer.email.S,
    };

    console.log("Retailer Data:", formattedRetailer);

    return { retailer: formattedRetailer };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

import getAWSLambda from "./getAWSLambda";

export default async function getRetailersByQuery(city, state, query) {
  const lambda = getAWSLambda();
  const payload = JSON.stringify({
    body: {
      city,
      state,
      query,
    },
  });

  const params = {
    FunctionName: "GetRetailersByQuery",
    Payload: payload,
  };

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const retailers =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;

    const retailersArray = Array.isArray(retailers.retailers)
      ? retailers.retailers
      : Object.values(retailers.retailers);

    const formattedRetailers = retailersArray.map((item) => ({
      retailer_id: item.retailer_id?.S || "Unknown ID",
      name: item.name?.S || "N/A",
      email: item.email?.S || "N/A",
      city: item.city?.S || "N/A",
      state: item.state?.S || "N/A",
      contact: item.contact?.S || "N/A",
      address: item.address?.S || "N/A",
      profileImage: item.profileImage?.S || "N/A",
    }));
    console.log(formattedRetailers);
    return { retailers: formattedRetailers };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch retailers" };
  }
}

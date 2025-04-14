import getAWSLambda from "./getAWSLambda";

export default async function getRetailerInventory(retailerId) {
  console.log(retailerId);
  const lambda = getAWSLambda();
  try {
    const payload = {
      retailer_id: retailerId,
    };

    const params = {
      FunctionName: "GetRetailerInventory",
      Payload: JSON.stringify({ body: payload }),
    };

    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const medicines =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;
    console.log(medicines);

    const medicinesArray = Array.isArray(medicines.medicines)
      ? medicines.medicines
      : Object.values(medicines.medicines);

    const formattedMedicines = medicinesArray.map((item) => ({
      batch_id: item.batch_id?.S || "N/A",
      medicine_id: item.medicine_id?.S || "N/A",
      retailer_id: item.retailer_id?.S || "N/A",
      batch_added_at: item.batch_added_at?.S || "N/A",
      price: item.product_price?.S || "0",
      quantity: item.quantity?.N || "0",
    }));

    return { medicines: formattedMedicines };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

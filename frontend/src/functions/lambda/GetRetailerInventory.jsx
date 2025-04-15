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
      product_name: item.product_name?.S || "N/A",
      batch_added_at: item.batch_added_at?.S || "N/A",
      batch_id: item.batch_id?.S || "N/A",
      quantity: item.quantity?.N || "0",
      product_price: item.product_price?.S || "0",
      medicine_id: item.medicine_id?.S || "N/A",
      retailer_id: item.retailer_id?.S || "N/A",
      medicine_desc: item.medicine_desc?.S || "N/A",
      salt_composition: item.salt_composition?.S || "N/A",
      side_effects: item.side_effects?.S || "N/A",
      product_manufactured: item.product_manufactured?.S || "N/A",
      image_urls: item.image_urls?.L?.map((img) => img.S) || [],
    }));

    return { medicines: formattedMedicines };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

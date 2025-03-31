import getAWSLambda from "./getAWSLambda";

export default async function getRetailerMedicines(retailerId) {
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
      batch_id: item.batch_id.S,
      medicine_id: item.medicine_id.S,
      retailer_id: item.retailer_id.S,
      batch_added_at: item.batch_added_at.S,
      price: item.price.S,
      quantity: parseInt(item.quantity.N, 10),
    }));

    return { medicines: formattedMedicines };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

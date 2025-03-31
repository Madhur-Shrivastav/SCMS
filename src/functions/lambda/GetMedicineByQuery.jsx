import getAWSLambda from "./getAWSLambda";
export default async function getMedicineByQuery(searchQuery, retailerId) {
  const lambda = getAWSLambda();
  try {
    const payload = {
      retailer_id: retailerId,
      search_query: searchQuery,
    };
    console.log(payload);
    const params = {
      FunctionName: "GetMedicineByQuery",
      Payload: JSON.stringify({ body: payload }),
    };

    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const medicines =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;

    const medicinesArray = Array.isArray(medicines.medicines)
      ? medicines.medicines
      : Object.values(medicines.medicines);

    const formattedMedicines = medicinesArray.map((item) => ({
      medicine_desc: item.medicine_desc?.S || "No description",
      medicine_id: item.medicine_id?.S || "Unknown ID",
      batch_id: item.batch_id || "Unknown ID",
      batch_added_at: item.batch_added_at || "N/A",
      quantity: item.quantity || 0,
      product_manufactured:
        item.product_manufactured?.S || "Unknown Manufacturer",
      product_name: item.product_name?.S || "Unknown Name",
      product_price: item.product_price?.S || "₹N/A",
      salt_composition: item.salt_composition?.S || "N/A",
      side_effects: item.side_effects?.S || "None",
      sub_category: item.sub_category?.S || "Uncategorized",
    }));

    console.log(formattedMedicines);

    return { medicines: formattedMedicines };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

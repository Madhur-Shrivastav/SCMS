import getAWSLambda from "./getAWSLambda";

export default async function getMedicineDetails(medicineId) {
  const lambda = getAWSLambda();
  try {
    const payload = {
      medicine_id: medicineId,
    };

    const params = {
      FunctionName: "GetMedicineDetails",
      Payload: JSON.stringify({ body: payload }),
    };

    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const details =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;

    const formattedDetails = {
      medicine_desc: details.medicine.medicine_desc?.S,
      medicine_id: details.medicine.medicine_id?.S,
      product_manufactured: details.medicine.product_manufactured?.S,
      product_name: details.medicine.product_name?.S,
      product_price: details.medicine.product_price?.S,
      salt_composition: details.medicine.salt_composition?.S,
      side_effects: details.medicine.side_effects?.S,
      sub_category: details.medicine.sub_category?.S,
    };
    return { details: formattedDetails };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

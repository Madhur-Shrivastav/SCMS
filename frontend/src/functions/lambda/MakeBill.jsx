import getAWSLambda from "./getAWSLambda";

export default async function makeBill(
  order,
  amount,
  medicine,
  user,
  retailer,
  billId
) {
  const lambda = getAWSLambda();
  const { order_id, retailer_id, quantity } = order;
  const { product_name, product_manufactured, product_price } =
    medicine.details;
  const { name, contact, email, address } = retailer.retailer;

  console.log(user);
  console.log(retailer.retailer);

  try {
    const payload = JSON.stringify({
      body: {
        bill_id: billId,
        order_id,
        amount,
        quantity,
        product_name,
        product_manufactured,
        product_price,
        consumer_name: user.firstName + " " + user.lastName,
        consumer_contact: user.contact,
        consumer_address: user.address,
        consumer_email: user.email,
        retailer_name: name,
        retailer_contact: contact,
        retailer_email: email,
        retailer_address: address,
        consumer_id: user.id,
        retailer_id,
      },
    });

    const params = {
      FunctionName: "MakeBill",
      Payload: payload,
    };

    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const result =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;
    console.log("Bill Generated:", result.Item);
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    showAlert("error", "Payment Failed!");
    return { error: "Lambda invocation failed" };
  }
}

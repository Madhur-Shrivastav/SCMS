import getAWSLambda from "./getAWSLambda";

export default async function getRetailerTransactions(retailerId) {
  const lambda = getAWSLambda();
  const params = {
    FunctionName: "GetRetailerTransactions",
    Payload: JSON.stringify({ retailer_id: retailerId }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const transactions =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;

    const formattedTransactions = transactions.map((item) => ({
      bill_id: item.bill_id.S,
      consumer_id: item.consumer_id.S,
      retailer_id: item.retailer_id.S,
      order_id: item.order_id.S,
      amount: item.amount.N,
      quantity: item.quantity.N,
      product_name: item.product_name.S,
      product_manufactured: item.product_manufactured.S,
      time_date: item.time_date.S,
      consumer_name: item.consumer_name.S,
      consumer_email: item.consumer_email.S,
      consumer_contact: item.consumer_contact.S,
      consumer_address: item.consumer_address.S,
      retailer_name: item.retailer_name.S,
      retailer_contact: item.retailer_contact.S,
      retailer_email: item.retailer_email.S,
      retailer_address: item.retailer_address.S,
    }));
    console.log("Formatted Transactions:", formattedTransactions);

    return { transactions: formattedTransactions };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

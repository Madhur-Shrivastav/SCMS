import getAWSLambda from "./getAWSLambda";

export default async function getConsumerBills(consumerId) {
  const lambda = getAWSLambda();
  const params = {
    FunctionName: "GetConsumerBills",
    Payload: JSON.stringify({ consumer_id: consumerId }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const data = JSON.parse(response.Payload);

    const bills =
      typeof data.body === "string" ? JSON.parse(data.body) : data.body;

    const formattedBills = bills.map((item) => ({
      bill_id: item.bill_id.S,
      consumer_id: item.consumer_id.S,
      order_id: item.order_id.S,
      amount: item.amount.N,
      time_date: item.time_date.S,
    }));
    console.log("Formatted Bills:", formattedBills);

    return { bills: formattedBills };
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return { error: "Failed to fetch orders" };
  }
}

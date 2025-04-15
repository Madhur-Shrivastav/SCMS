import callGemini from "../chat/CallGemini";
import getBillDetails from "../lambda/GetBillDetails";
import getConsumerBills from "../lambda/GetConsumerBills";
import getConsumerOrders from "../lambda/GetConsumerOrders";
import getOrderDetails from "../lambda/GetOrderDetails";
import getRetailersByQuery from "../lambda/GetRetailersByQuery";
import getRetailerTransactions from "../lambda/GetRetailerTransactions";
import getRetailerOrders from "../lambda/GetRetailerOrders";
import getRetailerInventory from "../lambda/GetRetailerInventory";

export default async function handleFunctionCall(functionCall, user) {
  let result, dataKey, label;
  console.log(functionCall);

  switch (functionCall.name) {
    case "get_user_orders":
      if (user.role === "Consumer") {
        result = await getConsumerOrders(user.id);
      } else if (user.role === "Retailer") {
        result = await getRetailerOrders(user.id);
      }
      dataKey = "orders";
      label = "medicine orders";
      break;
    case "get_user_transactions_bills":
      if (user.role === "Consumer") {
        result = await getConsumerBills(user.id);
        dataKey = "bills";
        label = "medicine bills";
      } else if (user.role === "Retailer") {
        result = await getRetailerTransactions(user.id);
        dataKey = "transactions";
        label = "medicine transactions";
      }
      break;
    case "get_available_retailers":
      result = await getRetailersByQuery(user.city, user.state, "");
      dataKey = "retailers";
      label = "retailers";
      break;
    case "view_my_details":
      result = user;
      dataKey = null;
      label = "user";
      break;
    case "get_bill_details":
      result = await getBillDetails(
        functionCall?.args?.billId,
        functionCall?.args?.orderId
      );
      dataKey = "bill";
      label = "bill";
      break;
    case "get_transaction_details":
      result = await getBillDetails(
        functionCall?.args?.billId,
        functionCall?.args?.orderId
      );
      dataKey = "bill";
      label = "transaction";
      break;
    case "get_order_details":
      result = await getOrderDetails(functionCall?.args?.orderId);
      dataKey = "order";
      label = "order";
      break;
    case "get_retailer_inventory":
      let availableMedicines = await getRetailerInventory(user.id);
      result = {
        medicines: availableMedicines.medicines.map((med) => ({
          product_name: med.product_name,
          batch_added_at: med.batch_added_at,
          batch_id: med.batch_id,
          quantity: med.quantity,
          product_price: med.product_price,
        })),
      };
      dataKey = "medicines";
      label = "medicine";
      break;
    default:
      return "No data available.";
  }

  const targetData = dataKey ? result?.[dataKey] : result;
  if (!targetData || (Array.isArray(targetData) && targetData.length === 0)) {
    return `No ${label} found.`;
  }

  const summaryPrompt = `You are a helpful assistant. Format the following ${label} into a readable summary. Use separators. Currency is INR if applicable. Data: ${JSON.stringify(
    targetData,
    null,
    2
  )}`;
  const summaryResponse = await callGemini(summaryPrompt, []);
  return (
    summaryResponse?.candidates?.[0]?.content?.parts?.[0]?.text ||
    `Could not fetch ${label}.`
  );
}

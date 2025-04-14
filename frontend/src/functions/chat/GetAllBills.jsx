export default async function getAllBills(id) {
  const result = await getConsumerBills(id);

  if (result?.bills?.length > 0) {
    const summaryPrompt = `
You are a helpful assistant. Format the following list of medicine bills into a readable summary for the user. For each bill, include:
- Bill number (1, 2, 3...)
- Bill ID
- Product name
- Quantity
- Amount in ₹
- Retailer name
- Date (nicely formatted)
- Also include consumer name & address if available

Add a dashed separator between each bill.

Data:
${JSON.stringify(result.bills, null, 2)}
    `;

    const summaryResponse = await callGemini(summaryPrompt, []);
    messageText =
      summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not fetch bill summary.";
  }
}

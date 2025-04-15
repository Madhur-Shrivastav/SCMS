import {
  getAvailableRetailersFunctionDeclaration,
  getBillDetailsFunctionDeclaration,
  getOrderDetailsFunctionDeclaration,
  getUserOrdersFunctionDeclaration,
  getUserTransactionsOrBillsFunctionDeclaration,
  viewMyDetailsFunctionDeclaration,
} from "./FunctionDeclarations";
import getAIModel from "./getAIModel";

export default async function callGemini(prompt, updatedHistory) {
  const ai = getAIModel();

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
      ...updatedHistory,
    ],
    config: {
      tools: [
        {
          functionDeclarations: [
            getUserOrdersFunctionDeclaration,
            getAvailableRetailersFunctionDeclaration,
            viewMyDetailsFunctionDeclaration,
            getBillDetailsFunctionDeclaration,
            getOrderDetailsFunctionDeclaration,
            getUserTransactionsOrBillsFunctionDeclaration,
          ],
        },
      ],
    },
  });

  return response;
}

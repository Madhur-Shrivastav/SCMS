import { Type } from "@google/genai";

export const getUserOrdersFunctionDeclaration = {
  name: "get_user_orders",
  description: "Fetches all orders for a specified user.",
};
export const getUserTransactionsOrBillsFunctionDeclaration = {
  name: "get_user_transactions_bills",
  description: "Fetches all transactions or for a specified user.",
};

export const getAvailableRetailersFunctionDeclaration = {
  name: "get_available_retailers",
  description:
    "Fetches all the available retailers in the same city for a specified consumer.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        description:
          "Fetches all the available retailers in the same city for the specified consumer.",
      },
    },
  },
};

export const viewMyDetailsFunctionDeclaration = {
  name: "view_my_details",
  description:
    "Fetches the details of a specified consumer using their full context.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      user: {
        type: Type.OBJECT,
        description:
          "Consumer user context, passed implicitly. Do not ask the user for anything.",
        properties: {
          id: { type: Type.STRING },
          email: { type: Type.STRING },
          firstName: { type: Type.STRING },
          lastName: { type: Type.STRING },
          contact: { type: Type.STRING },
          city: { type: Type.STRING },
          state: { type: Type.STRING },
          role: { type: Type.STRING },
          address: { type: Type.STRING },
          profileImage: { type: Type.STRING },
          time: { type: Type.STRING },
          device: {
            type: Type.OBJECT,
            properties: {
              browser: { type: Type.STRING },
              os: { type: Type.STRING },
              device: { type: Type.STRING },
            },
          },
        },
      },
    },
  },
};
export const getBillDetailsFunctionDeclaration = {
  name: "get_bill_details",
  description: "Fetches the bill details for a specific order or bill.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      billId: {
        type: Type.STRING,
        description: "The unique identifier of the bill to be fetched.",
      },
      orderId: {
        type: Type.STRING,
        description:
          "The unique identifier of the order to which the bill was generated after completion.",
      },
    },
    required: ["billId", "orderId"],
  },
};
export const getTransactionDetailsFunctionDeclaration = {
  name: "get_transaction_details",
  description: "Fetches the transaction details for a specific transaction.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      billId: {
        type: Type.STRING,
        description: "The unique identifier of the transaction to be fetched.",
      },
      orderId: {
        type: Type.STRING,
        description:
          "The unique identifier of the order to which the bill was generated after transaction.",
      },
    },
    required: ["billId", "orderId"],
  },
};
export const getOrderDetailsFunctionDeclaration = {
  name: "get_order_details",
  description: "Fetches details for a specific order using orderId.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      orderId: {
        type: Type.STRING,
        description: "The ID of the order to be fetched.",
      },
    },
    required: ["orderId"],
  },
};

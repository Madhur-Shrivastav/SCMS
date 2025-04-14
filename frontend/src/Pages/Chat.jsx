import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { marked } from "marked";
import getConsumerBills from "../functions/lambda/GetConsumerBills";
import getConsumerOrders from "../functions/lambda/GetConsumerOrders";
import callGemini from "../functions/chat/CallGemini";
import getRetailersByQuery from "../functions/lambda/GetRetailersByQuery";
import getBillDetails from "../functions/lambda/GetBillDetails";
import getOrderDetails from "../functions/lambda/GetOrderDetails";

const Chat = () => {
  const { user } = useContext(UserContext);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  const consumerOptions = [
    "1. Get all my orders",
    "2. Get all my bills",
    "3. View a specific bill",
    "4. View a specific order",
    "5. View my details",
    "6. View available retailers in my city",
  ];

  const retailerOptions = [
    "1. Get all my orders",
    "2. Get all my transactions",
    "3. View a specific transaction",
    "4. View a specific order",
    "5. View my details",
    "6. My inventory details",
  ];

  const handleSend = async () => {
    if (userInput.trim() === "") return;

    const userMessage = { role: "user", parts: [{ text: userInput }] };

    const updatedHistory = [...chatHistory, userMessage];

    setChatHistory((prev) => {
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      return [...prev, { sender: "user", text: userInput }];
    });

    setIsLoading(true);

    try {
      const prompt = `
  You are a chatbot assistant for a medicine supply chain system. 
  You need to assist the ${user?.role}. 
  Options for a consumer are: ${consumerOptions} 
  Options for a retailer are: ${retailerOptions}
  If the ${user?.role} asks anything outside of the provided options, provide relevant information.
  Always provide helpful and relevant responses by maintaining full context of the conversation. Do not repeat the greeting every time.
`;

      const response = await callGemini(prompt, updatedHistory);

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];

        let messageText;

        if (functionCall.name === "get_consumer_bills") {
          const result = await getConsumerBills(user.id);
          const billsSummary =
            result?.bills?.length > 0
              ? `You are a helpful assistant. Format the following list of medicine bills into a readable summary, use separators... Data: ${JSON.stringify(
                  result.bills,
                  null,
                  2
                )}`
              : "";
          const summaryResponse = await callGemini(billsSummary, []);
          messageText =
            summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Could not fetch bills.";
        } else if (functionCall.name === "get_consumer_orders") {
          const result = await getConsumerOrders(user.id);

          const ordersSummary =
            result?.orders?.length > 0
              ? `You are a helpful assistant. Format the following list of medicine orders into a readable summary, use separators... Data: ${JSON.stringify(
                  result.orders,
                  null,
                  2
                )}`
              : "";
          const summaryResponse = await callGemini(ordersSummary, []);
          messageText =
            summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Could not fetch orders.";
        } else if (functionCall.name === "get_available_retailers") {
          const result = await getRetailersByQuery(user.city, user.state, "");
          const retailersSummary =
            result?.retailers?.length > 0
              ? `You are a helpful assistant. Format the following list of retailers into a readable summary, use separators... Data: ${JSON.stringify(
                  result.retailers,
                  null,
                  2
                )}`
              : "";
          const summaryResponse = await callGemini(retailersSummary, []);
          messageText =
            summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Could not fetch retailers.";
        } else if (functionCall.name === "view_my_details") {
          const userSummary = user
            ? `You are a helpful assistant. Format the following user into a readable summary, use separators... Data: ${JSON.stringify(
                user,
                null,
                2
              )}`
            : "";
          const summaryResponse = await callGemini(userSummary, []);
          messageText =
            summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Could not your details.";
        } else if (functionCall.name === "get_bill_details") {
          const result = await getBillDetails(
            functionCall?.args?.billId,
            functionCall?.args?.orderId
          );
          const billSummary = result?.bill
            ? `You are a helpful assistant. Format the following bill into a readable summary, and the amount's currency is INR use separators... Data: ${JSON.stringify(
                result.bill
              )}`
            : "";
          const summaryResponse = await callGemini(billSummary, []);
          messageText =
            summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Could not fetch bill summary.";
        } else if (functionCall.name === "get_order_details") {
          const result = await getOrderDetails(functionCall?.args?.orderId);
          const orderSummary = result?.order
            ? `You are a helpful assistant. Format the following order into a readable summary, and the amount's currency is INR use separators... Data: ${JSON.stringify(
                result.order
              )}`
            : "";
          const summaryResponse = await callGemini(orderSummary, []);
          messageText =
            summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Could not fetch order summary.";
        } else {
          messageText = "No data available.";
        }

        const botMessage = { sender: "bot", text: messageText };
        setChatHistory((prev) => {
          const updated = [...prev, botMessage];
          localStorage.setItem("chatHistory", JSON.stringify(updated));
          return updated;
        });
      } else {
        const reply = response.text || "Sorry, no response available.";
        const botMessage = { role: "model", parts: [{ text: reply }] };

        setChatHistory((prev) => {
          const updated = [...prev, { sender: "bot", text: reply }];
          localStorage.setItem("chatHistory", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      const errorMessage = { sender: "bot", text: "Something went wrong!" };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md flex flex-col h-[80vh] max-h-[600px] overflow-hidden">
        <h1 className="text-2xl font-bold text-center text-gray-800 py-4">
          Pharmly
        </h1>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl max-w-[80%] break-words ${
                message.sender === "user"
                  ? "ml-auto bg-lime-500 text-white"
                  : "bg-indigo-50 text-gray-800"
              }`}
            >
              <strong>{message.sender === "user" ? "You" : "Bot"}:</strong>{" "}
              {message.sender === "bot" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: marked(message.text) }}
                />
              ) : (
                message.text
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500 italic">typing...</div>
          )}
        </div>

        <div className="p-4 border-t flex flex-col items-center justify-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500 w-full"
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className="bg-lime-500 text-white px-4 py-2 rounded-full hover:bg-lime-400 transition w-full"
          >
            Send
          </button>
          <button
            onClick={() => {
              setChatHistory([]);
              localStorage.removeItem("chatHistory");
            }}
            className="bg-lime-500 text-white px-4 py-2 rounded-full hover:bg-lime-400 transition w-full"
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chat;

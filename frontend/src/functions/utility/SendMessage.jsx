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
export default async function sendMessage({
  userInput,
  user,
  chatHistory,
  setChatHistory,
  setIsLoading,
  setUserInput,
  callGemini,
  handleFunctionCall,
}) {
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
      const messageText = await handleFunctionCall(functionCall, user);

      const botMessage = { sender: "bot", text: messageText };
      setChatHistory((prev) => {
        const updated = [...prev, botMessage];
        localStorage.setItem("chatHistory", JSON.stringify(updated));
        return updated;
      });
    } else {
      const reply = response.text || "Sorry, no response available.";
      const botMessage = { sender: "bot", text: reply };

      setChatHistory((prev) => {
        const updated = [...prev, botMessage];
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
}

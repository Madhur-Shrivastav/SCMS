import { GoogleGenAI } from "@google/genai";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCfVMxZNBqQsSdrspROnaXTLzXWd82z5r8",
});

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
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a chatbot assistant for a medicine supply chain system. 
                You MUST continue the chat based on user role: ${user?.role}. 
                Respond only with numbered options when a new conversation starts. 
                Current task: Maintain full context of conversation. Do not repeat the greeting every time.
                Respond in a single paragraph.`,
              },
            ],
          },
          ...updatedHistory,
        ],
      });

      const reply = response.text || "Sorry, no response available.";

      const botMessage = { role: "model", parts: [{ text: reply }] };

      setChatHistory((prev) => {
        const updated = [...prev, { sender: "bot", text: reply }];
        localStorage.setItem(
          "chatHistory",
          JSON.stringify([...updatedHistory, botMessage])
        );
        return updated;
      });
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
    <section>
      <div className="app">
        {
          <div className="chat-container">
            <h1 className="chat-title">Pharmly</h1>

            <div className="chat-box">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.sender === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  <strong>{message.sender === "user" ? "You" : "Bot"}:</strong>{" "}
                  {message.text}
                </div>
              ))}

              {isLoading && <div className="loading">typing...</div>}
            </div>

            <div className="input-container">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="input-field"
                onKeyDown={handleKeyPress}
              />
              <button onClick={handleSend} className="send-button">
                Send
              </button>
            </div>
          </div>
        }
      </div>
    </section>
  );
};

export default Chat;

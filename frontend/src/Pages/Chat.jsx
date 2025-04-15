import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import ReactMarkdown from "react-markdown";
import callGemini from "../functions/chat/CallGemini";
import handleFunctionCall from "../functions/utility/HandleFunctionCall";
import sendMessage from "../functions/utility/SendMessage";

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter")
      sendMessage({
        userInput,
        user,
        chatHistory,
        setChatHistory,
        setIsLoading,
        setUserInput,
        callGemini,
        handleFunctionCall,
      });
  };
  const handleSend = () => {
    sendMessage({
      userInput,
      user,
      chatHistory,
      setChatHistory,
      setIsLoading,
      setUserInput,
      callGemini,
      handleFunctionCall,
    });
  };

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 text-gray-800 px-4 sm:px-6 md:px-10 py-10">
      <div className="flex flex-col w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <h1 className="text-center text-2xl font-bold pt-4">Pharmly</h1>

        <div className="flex flex-col flex-grow h-[60vh] sm:h-[65vh] md:h-[70vh] p-4 overflow-y-auto">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex w-full mt-2 space-x-3 ${
                message.sender === "user"
                  ? "max-w-[75%] ml-auto justify-end"
                  : "max-w-[75%]"
              }`}
            >
              {message.sender === "bot" && (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#9bd300] overflow-hidden">
                  <img
                    src="/assets/user.jpeg"
                    alt="bot"
                    className="object-cover h-full w-full"
                  />
                </div>
              )}

              <div>
                <div
                  className={`p-3 text-sm break-words ${
                    message.sender === "user"
                      ? "bg-[#9bd300] text-white rounded-l-lg rounded-br-lg"
                      : "bg-gray-100 text-black rounded-r-lg rounded-bl-lg"
                  }`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                <span className="text-xs text-gray-500 leading-none">
                  Just now
                </span>
              </div>

              {message.sender === "user" && (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#9bd300] overflow-hidden">
                  <img
                    src={user.profileImage}
                    alt="user"
                    className="object-cover h-full w-full"
                  />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex w-full mt-2 space-x-3 max-w-[75%]">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
              <div>
                <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg text-sm">
                  <p>typing...</p>
                </div>
                <span className="text-xs text-gray-500 leading-none">Bot</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <input
              className="rounded-full h-10 w-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#9bd300]"
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type your message…"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleSend}
                className="bg-[#9bd300] text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto hover:bg-[#9bd300c4]"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setChatHistory([]);
                  localStorage.removeItem("chatHistory");
                }}
                className="bg-[#9bd300] text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto hover:bg-[#9bd300c4]"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;

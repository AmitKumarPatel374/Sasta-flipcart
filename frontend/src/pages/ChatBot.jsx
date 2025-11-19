import NavbarFilter from "../components/NavbarFilter";
import apiInstance from "../config/apiInstance";
import React, { useEffect, useState, useRef } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am ShopMaster Assistant. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // add user message
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      // calling your backend using apiInstance
      const response = await apiInstance.post("/product/ask", {
        message: userInput,
      });

      if (response.data?.success) {
        setMessages((prev) => [...prev, { from: "bot", text: response.data.reply }]);
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: "Something went wrong. Try again." }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [...prev, { from: "bot", text: "Network error, please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <NavbarFilter />

      <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded-xl shadow-md h-[80vh] flex flex-col">

        <h1 className="text-2xl font-semibold text-gray-700 mb-3">
          ShopMaster Support Chat
        </h1>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-3 border rounded-lg bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex my-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
                  msg.from === "user"
                    ? "bg-black text-white"
                    : "bg-blue-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* Chat Input */}
        <form onSubmit={sendMessage} className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, login, returns, etc..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-black text-white rounded-lg shadow disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;

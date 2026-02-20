import { useEffect, useRef } from "react";

const MessagesList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log("Rendering MessagesList with messages:", messages);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 flex items-center justify-center">
        <p className="text-gray-400">No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex mb-4 ${msg.sent ? "justify-end" : "justify-start"}`}
        >
          <div className="max-w-[70%]">
            <div
              className={`px-4 py-2 rounded-2xl ${
                msg.sent
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-200 text-gray-900 rounded-bl-sm"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            <span
              className={`text-xs text-gray-500 mt-1 w-fit block ${msg.sent ? "justify-end" : "justify-start"}`}
            >
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;

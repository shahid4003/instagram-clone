import { FiSend, FiPlus, FiSmile, FiMic } from "react-icons/fi";

const MessageInput = ({ message, setMessage, onSend }) => {
  return (
    <div className="border-t border-gray-200 px-4 py-3 bg-white">
      <div className="flex items-center space-x-2">
        <button className="hover:scale-110 transition">
          <FiPlus size={24} />
        </button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSend()}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-500 text-gray-900"
          />
          <button className="hover:scale-110 transition">
            <FiSmile size={20} />
          </button>
        </div>
        {message.trim() ? (
          <button
            onClick={onSend}
            className="bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition"
          >
            <FiSend size={18} className="text-white" />
          </button>
        ) : (
          <button className="hover:scale-110 transition">
            <FiMic size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;

import { FiSend } from "react-icons/fi";

const EmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiSend size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-light mb-2 text-gray-900">
          Your Messages
        </h2>
        <p className="text-gray-500">
          Send private messages to friends or groups.
        </p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
          Send Message
        </button>
      </div>
    </div>
  );
};

export default EmptyState;

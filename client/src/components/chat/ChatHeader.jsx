import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";

const ChatHeader = ({ selectedChat, onBack }) => {
  const user = selectedChat;
  const displayName = user?.name || user?.username || "User";
  const avatar = user?.img;
  const initial = displayName.charAt(0).toUpperCase();

  if (!user) return null;

  return (
    <div className="h-[60px] border-b border-gray-200 px-4 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <button 
          className="md:hidden mr-3 hover:scale-110 transition"
          onClick={onBack}
        >
          <ArrowLeft size={24} />
        </button>

        {/* User Avatar */}
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-semibold">
                {initial}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* User Info */}
        <div className="ml-3">
          <div className="flex items-center">
            <span className="font-semibold">{displayName}</span>
          </div>
          <span className="text-xs text-gray-500">Active now</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button className="hover:scale-110 transition">
          <Phone size={20} />
        </button>
        <button className="hover:scale-110 transition">
          <Video size={20} />
        </button>
        <button className="hover:scale-110 transition">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

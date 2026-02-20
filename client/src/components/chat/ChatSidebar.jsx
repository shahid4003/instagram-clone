import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";

const ChatSidebar = ({ selectedChat, setSelectedChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const { data } = useQuery({
    queryKey: ["followings"],
    queryFn: () => api.get("/follow/following").then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
  useEffect(() => {
    if (data?.following) {
      const formattedUsers = data.following.map((item) => ({
        id: item.following.id,
        userId: item.following.id,
        name: item.following.name || item.following.username,
        username: item.following.username,
        avatar: item.following.img ?? "",
        isOnline: false,
        unread: 0,
        timestamp: "",
      }));
      setUsers(formattedUsers);
    }
  }, [data]);

  const filteredConversations = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full md:w-[350px] border-r border-gray-200 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="h-[60px] border-b border-gray-200 px-4 flex items-center justify-between">
        <h4 className="text-lg font-semibold">Chats</h4>
        <button className="hover:scale-110 transition">
          <FiPlus size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedChat(user)}
            className={`flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer transition ${
              selectedChat?.id === user.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{user.name}</span>
                <span className="text-xs text-gray-400">{user.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;

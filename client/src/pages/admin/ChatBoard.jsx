import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useFetch from "../../hooks/UseFetch";

import AdminLayout from "../../layouts/AdminLayout";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessagesList from "../../components/chat/MessagesList";
import MessageInput from "../../components/chat/MessageInput";
import EmptyState from "../../components/chat/EmptyState";

const ChatBoard = () => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io("http://localhost:3000");
  }

  const socket = socketRef.current;
  const [receivedMessages, setReceivedMessages] = useState([]);
  const { data: usermessages } = useFetch({ url: "/user/messages" });


  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const { data: userData } = useFetch({ url: "/user/me" });

  useEffect(() => {
    if (!selectedChat || !usermessages?.messages || !userData?.user?.id) return;
    const formatted = usermessages.messages
      .filter(
        (m) =>
          (m.senderId === userData.user.id &&
            m.receiverId === selectedChat.userId) ||
          (m.receiverId === userData.user.id &&
            m.senderId === selectedChat.userId),
      )
      .map((m) => ({
        id: m.id,
        text: m.content,
        timestamp: m.timestamp,
        sent: m.senderId === userData.user.id,
      }));

    setMessages(formatted);
    setReceivedMessages([]);
  }, [selectedChat, usermessages, userData?.user?.id]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      socket.emit("send_message", {
        senderId: userData.user.id,
        receiverId: selectedChat.userId,
        content: message,
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: message, sent: true, timestamp: new Date() },
      ]);
      setMessage("");
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessages((prev) => [
        ...prev,
        {
          id: data.id || Date.now(),
          text: data.content,
          sent: false,
          timestamp: data.timestamp || new Date(),
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  return (
    <AdminLayout icon_Sidebar={true}>
      <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] border border-gray-200 rounded-lg overflow-hidden bg-white w-full">
        {/* Sidebar */}
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-shrink-0`}>
          <ChatSidebar
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col w-full min-h-0">
            <ChatHeader selectedChat={selectedChat} onBack={() => setSelectedChat(null)} />
            <MessagesList
              messages={[...messages, ...receivedMessages].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
              )}
            />
            <MessageInput
              message={message}
              setMessage={setMessage}
              onSend={handleSendMessage}
            />
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <EmptyState />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ChatBoard;

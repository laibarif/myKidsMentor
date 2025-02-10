import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
import './scroll.css'

function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const senderId = user?.id;
  const [ReceiverNumber, setTutorPhoneNumber] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  // Detect if the screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to the latest message whenever `messages` change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch conversation history on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/history?userId=${senderId}`
        );
        setUsers(sortUsersByLastMessage(response.data?.conversations));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (senderId) fetchUsers();
  }, [senderId]);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      setTutorPhoneNumber(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchMessages = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/userMessage?senderId=${senderId}&receiverId=${id}`
      );
      // Sort messages by timestamp in ascending order
      const sortedMessages = response.data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    if (senderId === ReceiverNumber) {
      alert("You cannot send a message to yourself.");
      return;
    }

    const newMessage = {
      senderId,
      receiverId: ReceiverNumber,
      content: messageText,
      timestamp: new Date(),
    };

    // Optimistically update messages
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageText("");

    try {
      await axios.post("http://localhost:5000/api/messages/send", newMessage);

      // Update the users state to reflect the new last message and timestamp
      setUsers((prevUsers) => {
        const otherUserId =
          selectedUser.id === senderId ? selectedUser.receiverId : selectedUser.senderId;

        const existingConversationIndex = prevUsers.findIndex(
          (conv) => conv.receiverId === otherUserId
        );

        if (existingConversationIndex !== -1) {
          // Update the existing conversation
          const updatedConversation = {
            ...prevUsers[existingConversationIndex],
            lastMessage: newMessage.content,
            timestamp: newMessage.timestamp,
          };

          // Remove the old conversation
          const updatedUsers = [...prevUsers];
          updatedUsers.splice(existingConversationIndex, 1);

          // Add the updated conversation to the top of the list
          return sortUsersByLastMessage([updatedConversation, ...updatedUsers]);
        } else {
          // If conversation doesn't exist, add it
          return sortUsersByLastMessage([
            {
              receiverId: ReceiverNumber,
              name: selectedUser.name,
              profilePicture: selectedUser.profilePicture,
              lastMessage: newMessage.content,
              timestamp: newMessage.timestamp,
            },
            ...prevUsers,
          ]);
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      // Optionally, revert optimistic update if the request fails
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg !== newMessage)
      );
    }
  };

  const sortUsersByLastMessage = (users) => {
    return users.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Render conversation list (contacts)
  const renderConversationList = () => (
    <div className="w-full h-full bg-gray-100 overflow-y-auto custom-scrollbar">
      <div className="p-4 bg-green-600 text-white">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      <div className="p-4 space-y-3">
        {users.map((conv) => (
          <div
            key={conv.receiverId} // Ensure receiverId is unique per conversation
            onClick={() => setSelectedUser(conv)}
            className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition hover:bg-green-100 ${
              selectedUser && selectedUser.receiverId === conv.receiverId
                ? "bg-green-100"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={`${BASE_URL_IMAGE}uploads/${conv.profilePicture}`}
                alt={conv.profilePicture}
                className="w-12 h-12 rounded-full object-cover shadow-md"
              />
              <div>
                <p className="font-semibold text-base text-gray-800">
                  {conv.name}
                </p>
                <p className="text-sm text-gray-500 truncate w-40">
                  {conv.lastMessage}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatTimestamp(conv.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render chat area (conversation)
  const renderChatArea = () => (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-[10px] border-b bg-green-600 text-white flex items-center">
        {isMobile && (
          <button
            onClick={() => setSelectedUser(null)}
            className="mr-4 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <img
          src={`${BASE_URL_IMAGE}uploads/${selectedUser.profilePicture}`}
          alt={selectedUser.profilePicture}
          className="w-10 h-10 rounded-full mr-4"
        />
        <h2 className="text-2xl font-semibold">{selectedUser.name}</h2>
      </div>
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.senderId === senderId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs shadow-sm ${
                message.senderId === senderId
                  ? "bg-green-500 text-white rounded-bl-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-br-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs font-semibold text-right mt-1">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {/* Add a dummy div to anchor the scroll */}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 transition-colors rounded-full px-4 py-3 text-white font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  // Main render:
  return (
    <div className="h-[calc(100vh-104px)]">
      {isMobile ? (
        selectedUser ? (
          renderChatArea()
        ) : (
          renderConversationList()
        )
      ) : (
        <div className="flex h-full">
          <div className="w-1/3 border-r border-gray-300">
            {renderConversationList()}
          </div>
          <div className="w-2/3">
            {selectedUser ? (
              renderChatArea()
            ) : (
              <div className="flex items-center justify-center h-full bg-white">
                <p className="text-center text-gray-500 p-4">
                  Select a user to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 

export default Messages;
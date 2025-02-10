import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux to manage state
import axios from 'axios'; // Import axios
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null); // Store messages for the selected user
  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const senderId = user?.id;
  
  const senderPhoneNumber = user?.phoneNumber;
  const [receiverDetails, setReceiverDetails] = useState(null); // State to store the receiver's static details
const [ReceiverNumber,setTutorPhoneNumber]=useState(null)
  useEffect(() => {
    // Fetch users from the server
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/history?userId=${senderId}`);

        setUsers(response.data?.conversations);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
    
    
      
      // Fetch the messages for the selected conversation
      fetchMessages(selectedUser?.id);
      setTutorPhoneNumber(selectedUser?.id);
      // // Fetch receiver details (static details)
      // fetchReceiverDetails(selectedUser.userB);
    }
  }, [selectedUser]);

  const fetchReceiverDetails = async (receiverId) => {
    try {
      
      // Assuming receiver's details are available by receiverId
      const response = await axios.get(`http://localhost:5000/api/users/${ReceiverNumber}`);
      
      setReceiverDetails(response.data);
    } catch (error) {
      console.error('Error fetching receiver details:', error);
    }
  };

  const fetchMessages = async (id) => {
    try {
      
      const response = await axios.get(
`http://localhost:5000/api/messages/userMessage?senderId=${user?.id}&receiverId=${id}`
      );
     
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    
    if (!messageText.trim()) return;
    if (user?.id === ReceiverNumber) {
      alert("You cannot send a message to yourself.");
      return;
    }

   

    const newMessage = {
      senderId,
      receiverId: ReceiverNumber,
      content: messageText, 
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
    ]);
    setMessageText("");

    try {
      await axios.post("http://localhost:5000/api/messages/send", newMessage);
      fetchMessages(selectedUser.userB);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Conditional rendering based on selectedUser for mobile view */}
      {selectedUser ? (
        <div className="w-full h-full bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center space-x-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &#8592;
            </button>
            <img
              src={`${BASE_URL_IMAGE}uploads/${selectedUser.profilePicture}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
          </div>

          {/* Messages Container */}
          <div
            className="flex-1 p-4 space-y-4 overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === senderId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 rounded-lg shadow-sm max-w-xs ${
                    message.senderId === senderId
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t flex items-center space-x-2">
            <textarea
              className="flex-1 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows="2"
              placeholder="Type a message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>

            <button
              onClick={sendMessage}
              className="bg-teal-700 text-white py-2 px-4 rounded-md hover:bg-teal-800 transition"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-50 p-4 overflow-y-auto">
          <h2 className="font-semibold text-xl mb-4">Messages</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.receiverId}
                onClick={() => setSelectedUser(user)}
                className="block sm:flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`${BASE_URL_IMAGE}uploads/${user.profilePicture}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      {user.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTimestamp(user.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;

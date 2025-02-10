const { Op, Sequelize } = require('sequelize');
const MessageModel = require("../models/messageModel.js");
const User= require('../models/user.js')



// const sendMessage = async (req, res) => {
//   try {
//     const { senderPhoneNumber, receiverPhoneNumber, content } = req.body;

//     // Log input data for debugging
//     console.log(senderPhoneNumber, receiverPhoneNumber, content);

//     // Check if all required fields are provided
//     if (!senderPhoneNumber || !receiverPhoneNumber || !content) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Find the sender's userId by phone number
//     const sender = await User.findOne({
//       where: { phoneNumber: senderPhoneNumber }, // Find sender based on phone number
//     });

//     // Find the receiver's userId by phone number
//     const receiver = await User.findOne({
//       where: { phoneNumber: receiverPhoneNumber }, // Find receiver based on phone number
//     });

//     // If either sender or receiver is not found, return an error
//     if (!sender || !receiver) {
//       return res.status(404).json({ message: "Sender or Receiver not found" });
//     }

//     // Check if both sender and receiver phone numbers match the found users
//     if (sender.phoneNumber !== senderPhoneNumber || receiver.phoneNumber !== receiverPhoneNumber) {
//       return res.status(400).json({ message: "Phone number mismatch with user data" });
//     }

//     // Create the message using userIds and their phone numbers
//     const message = await MessageModel.create({
//       senderId: sender.id,
//       receiverId: receiver.id,
//       senderPhoneNumber: sender.phoneNumber,
//       receiverPhoneNumber: receiver.phoneNumber,
//       content: content
//     });

//     // Return success response with message data
//     res.status(201).json({ message: "Message sent", data: message });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Log input data for debugging
    console.log(senderId, receiverId, content);

    // Check if all required fields are provided
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the sender and receiver users by their userIds
    const sender = await User.findOne({
      where: { id: senderId },
    });

    const receiver = await User.findOne({
      where: { id: receiverId },
    });

    // If either sender or receiver is not found, return an error
    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }

    // Create the message using userIds
    const message = await MessageModel.create({
      senderId: sender.id,
      receiverId: receiver.id,
      senderPhoneNumber: sender.phoneNumber,
      receiverPhoneNumber: receiver.phoneNumber,
      content: content
    });

    // Return success response with message data
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





// const getMessages = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // Normalize sender and receiver IDs to group conversations consistently
//     const conversations = await MessageModel.findAll({
//       where: {
//         [Sequelize.Op.or]: [
//           { senderId: userId },
//           { receiverId: userId },
//         ],
//       },
//       attributes: [
//         [Sequelize.literal('LEAST(senderId, receiverId)'), 'userA'],
//         [Sequelize.literal('GREATEST(senderId, receiverId)'), 'userB'],
//       ],
//       group: ['userA', 'userB'],
//     });

//     if (conversations.length === 0) {
//       return res.status(404).json({ message: "No conversations found" });
//     }

//     // Extract unique user IDs from conversations
//     const userIds = [
//       ...new Set(
//         conversations.flatMap(({ dataValues: { userA, userB } }) => [userA, userB])
//       ),
//     ];

//     // Fetch user details
//     const users = await User.findAll({
//       where: { id: { [Sequelize.Op.in]: userIds } },
//       attributes: ['id', 'name', 'profilePicture', 'phoneNumber'], // Add phoneNumber if needed
//     });

//     // Create a mapping of user details by userId
//     const userDetails = users.reduce((acc, user) => {
//       acc[user.id] = user; // Map user ID to user details
//       return acc;
//     }, {});

//     // Get the latest message for each conversation
//     const latestMessages = [];
//     for (let { dataValues: { userA, userB } } of conversations) {
//       const lastMessage = await MessageModel.findOne({
//         where: {
//           [Sequelize.Op.or]: [
//             { senderId: userA, receiverId: userB },
//             { senderId: userB, receiverId: userA },
//           ],
//         },
//         order: [['timestamp', 'DESC']],
//         limit: 1,
//       });

//       if (lastMessage) {
//         latestMessages.push({ lastMessage, userA, userB });
//       }
//     }

//     // Construct response with details of only the other user
//     const messagesWithOtherUserDetails = latestMessages.map(({ lastMessage, userA, userB }) => {
//       // Determine the other user in the conversation
//       const otherUserId = userA === parseInt(userId) ? userB : userA;

//       return {
//         name: userDetails[otherUserId]?.name,
//         profilePicture: userDetails[otherUserId]?.profilePicture,
//         phoneNumber: userDetails[otherUserId]?.phoneNumber, // Add phone number
//         lastMessage: lastMessage.content,
//         timestamp: lastMessage.timestamp,
//       };
//     });

//     res.status(200).json({ conversations: messagesWithOtherUserDetails });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const getMessages = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Normalize sender and receiver IDs to group conversations consistently
    const conversations = await MessageModel.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      attributes: [
        [Sequelize.literal('LEAST(senderId, receiverId)'), 'userA'],
        [Sequelize.literal('GREATEST(senderId, receiverId)'), 'userB'],
      ],
      group: ['userA', 'userB'],
    });

    if (conversations.length === 0) {
      return res.status(404).json({ message: "No conversations found" });
    }

    // Extract unique user IDs from conversations
    const userIds = [
      ...new Set(
        conversations.flatMap(({ dataValues: { userA, userB } }) => [userA, userB])
      ),
    ];

    // Fetch user details
    const users = await User.findAll({
      where: { id: { [Sequelize.Op.in]: userIds } },
      attributes: ['id', 'name', 'profilePicture', 'phoneNumber'],
    });

    // Create a mapping of user details by userId
    const userDetails = users.reduce((acc, user) => {
      acc[user.id] = user; // Map user ID to user details
      return acc;
    }, {});

    // Get the latest message for each conversation
    const latestMessages = [];
    for (let { dataValues: { userA, userB } } of conversations) {
      const lastMessage = await MessageModel.findOne({
        where: {
          [Sequelize.Op.or]: [
            { senderId: userA, receiverId: userB },
            { senderId: userB, receiverId: userA },
          ],
        },
        order: [['timestamp', 'DESC']],
        limit: 1,
      });

      if (lastMessage) {
        latestMessages.push({ lastMessage, userA, userB });
      }
    }

    // Construct response with details of the other user
    const messagesWithOtherUserDetails = latestMessages.map(({ lastMessage, userA, userB }) => {
      // Determine the other user in the conversation
      const otherUserId = userA === parseInt(userId) ? userB : userA;

      return {
        id: otherUserId,
        name: userDetails[otherUserId]?.name,
        profilePicture: userDetails[otherUserId]?.profilePicture,
        phoneNumber: userDetails[otherUserId]?.phoneNumber,
        lastMessage: lastMessage.content,
        timestamp: lastMessage.timestamp,
      };
    });

    res.status(200).json({ conversations: messagesWithOtherUserDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// const getSpecficUserMessage = async (req, res) => {
//   try {
//     const { senderPhoneNumber, tutorPhoneNumber } = req.query;  // Get the phone numbers from query params

//     // Check if both phone numbers are provided
//     if (!senderPhoneNumber || !tutorPhoneNumber) {
//       return res.status(400).json({ message: "Both senderPhoneNumber and tutorPhoneNumber are required" });
//     }

//     // Find the sender's userId by phone number
//     const sender = await User.findOne({
//       where: { phoneNumber: senderPhoneNumber }, // Assuming you have a phoneNumber field in your User model
//     });

//     // Find the tutor's userId by phone number
//     const tutor = await User.findOne({
//       where: { phoneNumber: tutorPhoneNumber },
//     });

//     // If either user (sender or tutor) is not found, return an error
//     if (!sender || !tutor) {
//       return res.status(404).json({ message: "User(s) not found" });
//     }

//     // Now query the messages using their userIds
//     const messages = await MessageModel.findAll({
//       where: {
//         [Sequelize.Op.or]: [
//           { senderId: sender.id, receiverId: tutor.id },
//           { senderId: tutor.id, receiverId: sender.id }
//         ]
//       },
//       order: [["timestamp", "ASC"]] // Order by timestamp
//     });

//     // If no messages are found, return a 404
//     if (messages.length === 0) {
//       return res.status(404).json({ message: "No messages found between the users" });
//     }

//     // Return the found messages
//     res.status(200).json({ messages });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const getSpecficUserMessage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Both senderId and receiverId are required" });
    }

    // Find messages between sender and receiver
    const messages = await MessageModel.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      },
      order: [["timestamp", "ASC"]] // Order by timestamp
    });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found between the users" });
    }

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { sendMessage, getMessages,getSpecficUserMessage };


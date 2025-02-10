import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import "./scroll.css";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

const TutorDetail = () => {
  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const senderPhoneNumber = user?.phoneNumber;
  const { tutorId } = useParams();

  // State Management
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [tutor, setTutor] = useState(null);
  const [tutorPhoneNumber, setTutorPhoneNumber] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);

  const messagesEndRef = useRef(null);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Auto-scroll chat history to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Helper to check tutor availability for a given day and time
  const isAvailable = (day, timeRange) => {
    const dayMapping = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };
    return tutor.availability.some(
      (item) => item.day === dayMapping[day] && item.time === timeRange
    );
  };

  // Fetch tutor details
  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tutor/${tutorId}`
        );
        setTutor(response.data);
        setTutorPhoneNumber(response.data.phoneNumber);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorDetails();
  }, [tutorId]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/tutor/${tutorId}`
      );
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [tutorId]);

  // Calculate average rating
  const averageRating = (
    reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length || 0
  ).toFixed(1);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/userMessage?senderId=${user?.id}&receiverId=${tutorId}`
      );
      console.log("message", response.data);
      setMessages(response.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingMessages(false);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [senderPhoneNumber, tutorPhoneNumber, tutorId]);

  // Add a review
  const handleAddReview = async () => {
    // if (!rating || !comment.trim()) return; // Ensure rating and comment are provided
    const reviewData = {
      tutor_id: tutorId,
      parent_id: user?.id,
      rating: rating || null,
      comment: comment || null,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews/add",
        reviewData
      );
      console.log("Review added:", response.data);
      setComment("");
      setRating(0);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Send a message in chat
  const sendMessage = async () => {
    if (!messageText.trim()) return;
    const newMessage = {
      senderId: user?.id,
      receiverId: tutorId,
      senderPhoneNumber: senderPhoneNumber, // Ensure this is included
      content: messageText,
      timestamp: new Date(),
    };
    try {
      console.log(newMessage)
      const response = await axios.post(
        "http://localhost:5000/api/messages/send",
        newMessage
      );
      console.log("Message sent:", response.data);
      fetchMessages();
      setMessageText("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleSeeMoreReviews = () => {
    setVisibleReviews((prevVisible) => prevVisible + 4);
  };

  // Process certifications (JSON string or array)
  let certificationsArray = [];
  if (tutor) {
    if (typeof tutor.certifications === "string") {
      try {
        certificationsArray = JSON.parse(tutor.certifications);
      } catch (error) {
        console.error("Error parsing certifications:", error);
      }
    } else if (Array.isArray(tutor.certifications)) {
      certificationsArray = tutor.certifications;
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-5 lg:flex gap-10">
        <div className="w-10/12 p-5 rounded-md shadow-md mx-auto">
          <Skeleton variant="circular" width={96} height={96} />
          <Skeleton variant="text" width="60%" height={40} className="mt-4" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </div>
        <div className="relative">
          <Skeleton variant="rectangular" width={200} height={200} />
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-5 lg:flex gap-10 animate-fadeIn">
      {/* LEFT COLUMN: Tutor Details */}
      <div className="w-full xl:w-2/3 p-6 rounded-xl shadow-xl bg-gradient-to-r from-teal-100 to-teal-200 transition-all duration-300">
        {/* Tutor Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <img
            src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
            alt="Tutor"
            className="w-32 h-32 object-cover rounded-full border-4 border-teal-500 shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800">{tutor.name}</h1>
            <p className="text-xl text-gray-600">{tutor.title}</p>
            <p className="font-semibold text-green-600 text-lg">{`$${tutor.hourlyRates}/hr`}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-teal-700">About Me</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            {tutor.about || "No about info provided."}
          </p>
        </div>

        <div className="w-full flex flex-wrap justify-between mt-8">
          {/* Subjects Handled */}
          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-2xl font-bold text-teal-700 mb-3">
              Subjects Handled
            </h3>
            <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <ul className="list-disc list-inside space-y-2">
                {tutor.subjectsTaught.map((subject, index) => (
                  <li key={index} className="text-gray-800 font-medium">
                    {subject}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Grades Handled */}
          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-2xl font-bold text-teal-700 mb-3">
              Grades Handled
            </h3>
            <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <ul className="list-disc list-inside space-y-2">
                {tutor.gradesHandled.map((grade, index) => (
                  <li key={index} className="text-gray-800 font-medium">
                    {grade}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Ratings and Reviews Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-teal-700">
              Ratings & Reviews
            </h3>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-gray-600 hover:text-gray-800 transition duration-200"
            >
              ✏️
            </button>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-4xl font-bold text-gray-800">
              {averageRating}
            </span>
            <div className="flex text-yellow-500">
              {"★".repeat(Math.round(averageRating)) +
                "☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="text-gray-500">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
          <div className="mt-6 space-y-6">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="border p-6 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`${BASE_URL_IMAGE}uploads/${review.parent.profilePicture}`}
                    alt={review.parent.name}
                    className="w-12 h-12 rounded-full border-2 border-teal-500 shadow"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.parent.name}
                    </p>
                    <div className="flex text-yellow-500">
                      {"★".repeat(review.rating) +
                        "☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{review.comment}</p>
              </div>
            ))}
            {visibleReviews < reviews.length && (
              <button
                onClick={handleSeeMoreReviews}
                className="mt-4 text-teal-600 hover:text-teal-800 transition-colors duration-200 underline"
              >
                See more reviews
              </button>
            )}
          </div>
          {showReviewForm && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-inner">
              <h4 className="text-xl font-semibold mb-4 text-teal-700">
                Add a Review
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-3xl">
                  {"★".repeat(rating) + "☆".repeat(5 - rating)}
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-3xl ${
                        star <= rating ? "text-yellow-500" : "text-gray-300"
                      } transition-transform transform hover:scale-110`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddReview();
                  }
                }}
                placeholder="Write your review here..."
                className="w-full p-4 mt-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                rows="4"
              ></textarea>
              <button
                onClick={handleAddReview}
                className="w-full mt-4 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors duration-200"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>

        {/* Qualifications and City */}
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-1 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-teal-700 mb-3">
              Qualifications
            </h3>
            <p className="text-gray-800 leading-relaxed">
              {tutor.qualifications}
            </p>
          </div>
          <div className="flex-1 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-teal-700 mb-3">City</h3>
            <p className="text-gray-800">{tutor.city}</p>
          </div>
        </div>

        {/* Certifications */}
        {certificationsArray.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-teal-700">Certifications</h3>
            <ul className="flex flex-wrap gap-6 mt-4">
              {certificationsArray.map((certificate, index) => (
                <li key={index} className="group">
                  <Link
                    to={`${BASE_URL_IMAGE}uploads/${certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    <img
                      src={`${BASE_URL_IMAGE}uploads/${certificate}`}
                      alt={`Certification ${index + 1}`}
                      className="w-32 h-32 object-cover rounded border-2 border-teal-500 shadow group-hover:shadow-lg transition-shadow duration-300"
                    />
                  </Link>
                  <p className="mt-2 text-center text-sm text-gray-700">
                    {certificate.substring(certificate.lastIndexOf("-") + 1)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-8 text-gray-500">No certifications available.</p>
        )}

        {/* General Availability */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-teal-700">
            General Availability
          </h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-4 border">Time</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="p-4 border text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tutor?.availability?.map((item, rowIndex) => (
                  <tr
                    key={item.time}
                    className={`${
                      rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-teal-100 transition-colors duration-200`}
                  >
                    <td className="p-4 border text-gray-700 font-medium">
                      {item.time}
                    </td>
                    {daysOfWeek.map((day) => (
                      <td
                        key={day}
                        className={`p-4 border text-center ${
                          isAvailable(day, item.time)
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }`}
                      >
                        {isAvailable(day, item.time) ? "✓" : "✕"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Messages Section */}
      <div className="relative w-full xl:w-1/3 mt-10 xl:mt-0">
        {/* Improved Message Box */}
        {isMessageBoxVisible && (
          <div className="fixed bottom-20 right-5 z-50 w-96 h-[550px] flex flex-col bg-white rounded-lg shadow-2xl transition-transform duration-300 ease-in-out">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-teal-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <img
                  src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                  alt="Tutor"
                  className="w-10 h-10 rounded-full border-2 border-white shadow"
                />
                <span className="text-lg font-semibold">{tutor.name}</span>
              </div>
              <button
                onClick={() => setIsMessageBoxVisible(false)}
                className="text-white hover:text-gray-200 transition-colors duration-200"
                title="Close Chat"
              >
                {/* Close Icon */}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 custom-scrollbar">
              {loadingMessages ? (
                <p className="text-center text-gray-500">Loading messages...</p>
              ) : messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      message.senderPhoneNumber === senderPhoneNumber
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderPhoneNumber === senderPhoneNumber
                          ? "bg-teal-100 text-teal-800"
                          : "bg-blue-100 text-blue-800"
                      } shadow-md`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="block text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No conversation yet.
                </p>
              )}
              <div ref={messagesEndRef}></div>
            </div>
            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-100 rounded-b-lg">
              <textarea
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                rows="2"
              ></textarea>
              <button
                onClick={sendMessage}
                className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Floating Message Icon */}
        {!isMessageBoxVisible && (
          <div
            className="fixed bottom-5 right-5 bg-teal-600 text-white p-4 rounded-full cursor-pointer shadow-lg z-50 animate-bounce transition-transform hover:scale-110"
            onClick={() => setIsMessageBoxVisible(true)}
            title="Open Chat"
          >
            {/* Message Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M3 3C2.44772 3 2 3.44772 2 4V16C2 16.5523 2.44772 17 3 17H18L23 21V4C23 3.44772 22.5523 3 22 3H3ZM3 1C1.34315 1 0 2.34315 0 4V16C0 17.6569 1.34315 19 3 19H18L23 24V4C23 2.34315 21.6569 1 20 1H3Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDetail;

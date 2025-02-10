import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

const CheckReviews = () => {
  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const tutorId = user?.id;

  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper function to check availability for a specific day and time
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
    return tutor.availability?.some((item) => {
      if (item.day !== dayMapping[day]) return false;
      return item.time === timeRange;
    });
  };

  // Fetch Tutor details
  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/${tutorId}`);
        setTutor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorDetails();
  }, [tutorId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/tutor/${tutorId}`);
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchReviews();
  }, [tutorId]);

  // Calculate average rating
  const averageRating = (
    reviews.reduce((total, review) => total + review.rating, 0) / reviews.length || 0
  ).toFixed(1);

  const handleSeeMoreReviews = () => {
    setVisibleReviews((prevVisible) => prevVisible + 4);
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading...</p>;


  return (
    // Updated background with a vivid gradient and slight overlay for a glass-like feel
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-teal-100 to-green-200 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6 backdrop-blur-md bg-white/70 shadow-2xl rounded-lg p-6">
        {/* Tutor Profile and Details */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
              alt="Tutor"
              className="w-28 h-28 object-cover rounded-full border-4 border-green-600"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{tutor.name}</h1>
              <p className="text-gray-600 text-lg">{tutor.title}</p>
              <p className="font-semibold text-green-600 text-xl">{`$${tutor.hourlyRates}/hr`}</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
        </div>

        {/* Subjects & Grades */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-around">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold text-gray-800">Subjects Handled</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {tutor.subjectsTaught?.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Grades Handled</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {tutor.gradesHandled?.map((grade, index) => (
                  <li key={index}>{grade}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Ratings & Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Ratings & Reviews</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <span className="text-4xl font-bold text-gray-800">{averageRating}</span>
            <div className="text-yellow-400 text-3xl">
              {"★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="text-gray-500 text-lg">{`${reviews.length} review(s)`}</span>
          </div>
          <div className="space-y-4">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="border-b pb-4 mb-4 transition duration-200 hover:shadow-md rounded-lg px-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`${BASE_URL_IMAGE}uploads/${review.parent.profilePicture}`}
                    alt={review.parent.name}
                    className="w-14 h-14 object-cover rounded-full border"
                  />
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{review.parent.name}</p>
                    <div className="text-yellow-400 text-xl">
                      {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
            {visibleReviews < reviews.length && (
              <div className="text-center">
                <button
                  onClick={handleSeeMoreReviews}
                  className="mt-3 text-blue-600 underline hover:text-blue-800 transition"
                >
                  See more reviews
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Qualifications */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Qualifications</h2>
          <p className="text-gray-700">{tutor.qualifications}</p>
        </div>

        {/* General Availability */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">General Availability</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-teal-700 text-white">
                  <th className="border border-gray-300 p-3 text-left">Time</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="border border-gray-300 p-3 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tutor.availability?.map((item, rowIndex) => (
                  <tr
                    key={item.time}
                    className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-100 transition`}
                  >
                    <td className="border border-gray-300 p-3 text-gray-700 font-medium">
                      {item.time}
                    </td>
                    {daysOfWeek.map((day) => (
                      <td
                        key={day}
                        className={`border border-gray-300 p-3 text-center ${
                          isAvailable(day, item.time)
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }`}
                      >
                        {isAvailable(day, item.time) ? "✓" : "x"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckReviews;
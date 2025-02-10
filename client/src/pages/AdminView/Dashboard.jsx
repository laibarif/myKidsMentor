import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar, FaSpinner } from "react-icons/fa";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

function Dashboard() {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (tutorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/tutor/${tutorId}`
      );
      return response.data;
    } catch (err) {
      console.error(`Error fetching reviews for tutor ${tutorId}:`, err);
      setError(err.response?.data?.message || err.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/tutor/allprofile"
        );
        const tutorsData = response.data.tutors;

        // Fetch reviews for each tutor and calculate ratings
        const tutorsWithRatings = await Promise.all(
          tutorsData.map(async (tutor) => {
            const reviews = await fetchReviews(tutor.id);
            const averageRating = reviews.length
              ? (
                  reviews.reduce((total, review) => total + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : 0; // Default to 0 if no reviews
            return { ...tutor, reviews, averageRating };
          })
        );

        setTutors(tutorsWithRatings);
      } catch (error) {
        console.error("Error fetching tutors:", error);
        setError("An error occurred while fetching tutor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-700">
        Tutor Dashboard
      </h1>

      {/* Tutor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {loading ? (
          // Loading State
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse flex flex-col bg-white p-4 rounded-lg shadow-md"
            >
              <div className="bg-gray-300 h-40 w-full rounded-md mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))
        ) : tutors.length > 0 ? (
          // Display Tutor Cards
          tutors.map((tutor) => (
            <Link
              to={`/admin/tutorProfileDetail/${tutor.id}`}
              key={tutor.id}
              className="block transform transition-transform duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                {/* Profile Picture */}
                <div className="h-48 w-full">
                  <img
                    src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile Details */}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold text-teal-700 mb-2">
                    {tutor.name}
                  </h2>
                  <p className="text-gray-600 mb-2">{tutor.qualifications}</p>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 font-medium">
                      Subjects:
                    </span>
                    <div className="flex flex-wrap mt-1">
                      {tutor.subjectsTaught.map((subject, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-teal-100 text-teal-800 mr-2 mb-2 px-2.5 py-0.5 rounded"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hourly Rates & Rating */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-teal-700">
                        ${tutor.hourlyRates}
                        <span className="text-sm font-semibold text-gray-500">
                          /hr
                        </span>
                      </p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span key={index}>
                            {index < Math.round(tutor.averageRating) ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-yellow-400" />
                            )}
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {tutor.averageRating > 0
                            ? `${tutor.averageRating} / 5`
                            : "No Ratings"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {tutor.reviews.length > 0
                        ? `${tutor.reviews.length} Review(s)`
                        : "No Reviews Yet"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Error or No Tutors Found
          <div className="col-span-full text-center">
            <p className="text-red-500">{error || "No tutors found."}</p>
          </div>
        )}
      </div>

      {/* Optional: Add Pagination or Filters Here */}
    </div>
  );
}

export default Dashboard;
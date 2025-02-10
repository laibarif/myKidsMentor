import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaStar, FaRegStar, FaEllipsisV, FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

const TutorProfileDetail = () => {
  const { user } = useSelector((state) => state.auth); // Access user from Redux

  const [dropdownVisible, setDropdownVisible] = useState({});
  const dropdownRefs = useRef({});
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [tutorPhoneNumber, setTutorPhoneNumber] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper function to check availability for a specific day and time
  const isAvailable = (day, timeRange) => {
    // Mapping days to full names
    const dayMapping = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday"
    };

    // Check if tutor is available on the given day and within the time range
    return tutor.availability.some((item) => {
      // Match the day
      if (item.day !== dayMapping[day]) return false;

      // Check if the time range matches exactly
      return item.time === timeRange;
    });
  };

  const handleClickOutside = (event) => {
    for (const key in dropdownRefs.current) {
      if (
        dropdownRefs.current[key] &&
        !dropdownRefs.current[key].contains(event.target)
      ) {
        setDropdownVisible((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch Tutor details
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId]);

  // Calculate average rating
  const averageRating = (
    reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length || 0
  ).toFixed(1);

  const handleSeeMoreReviews = () => {
    setVisibleReviews((prevVisible) => prevVisible + 4); // Increment by 4
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/userReviewsByAdmin/${id}`
      );
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review); // Set the review to be edited
    setEditModalVisible(true); // Show the modal
  };

  const handleSaveEditedReview = async () => {
    const id = editingReview.id;
    try {
      await axios.put(
        `http://localhost:5000/api/admin/userReviewsByAdmin/${id}`,
        { comment: editingReview.comment }
      );
      fetchReviews();
      setEditModalVisible(false); // Hide the modal
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  let certificationsArray = [];

  // Check if tutor is available and certifications property exists
  if (tutor && tutor.certifications) {
    // If it's a string, parse it
    if (typeof tutor.certifications === "string") {
      try {
        certificationsArray = JSON.parse(tutor.certifications);
      } catch (error) {
        console.error("Error parsing certifications:", error);
      }
    } else if (Array.isArray(tutor.certifications)) {
      // If it's already an array, use it directly
      certificationsArray = tutor.certifications;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaStar className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 lg:flex lg:gap-10 bg-gray-100 min-h-screen">
      {/* LEFT COLUMN: Tutor Details */}
      <div className="lg:w-3/4 bg-white p-6 rounded-md shadow-md">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
            alt="Tutor"
            className="w-24 h-24 object-cover rounded-full border-2 border-teal-500 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-teal-700">{tutor.name}</h1>
            <p className="text-gray-600">{tutor.title}</p>
            <p className="font-semibold text-green-600 text-lg">{`$${tutor.hourlyRates}/hr`}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-teal-600">About Me</h2>
          <p className="text-gray-700 mt-2">{tutor.about}</p>
        </div>

        {/* Ratings and Reviews */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-teal-600">Ratings & Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold text-teal-700">{averageRating}</span>
            <div className="flex items-center text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.round(averageRating) ? (
                    <FaStar />
                  ) : (
                    <FaRegStar />
                  )}
                </span>
              ))}
            </div>
            <span className="text-gray-500">{`${reviews.length} Review(s)`}</span>
          </div>
          <div className="mt-4">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div key={review.id} className="border-b pb-3 mb-4 relative">
                <div className="flex items-center gap-4">
                  <img
                    src={`${BASE_URL_IMAGE}uploads/${review.parent.profilePicture}`}
                    alt={review.parent.name}
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">{review.parent.name}</p>
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index}>
                          {index < review.rating ? (
                            <FaStar />
                          ) : (
                            <FaRegStar />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Dropdown Menu Trigger */}
                  <div className="ml-auto relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                      onClick={() =>
                        setDropdownVisible((prev) => ({
                          ...prev,
                          [review.id]: !prev[review.id]
                        }))
                      }
                      aria-label="Options"
                    >
                      <FaEllipsisV />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownVisible[review.id] && (
                      <div
                        ref={(el) => (dropdownRefs.current[review.id] = el)}
                        className="absolute right-0 top-full mt-2 w-32 bg-white border rounded-md shadow-lg z-10"
                      >
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <FaTrash className="mr-2" />
                          Delete
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-blue-500"
                          onClick={() => handleEditReview(review)}
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mt-3">{review.comment}</p>
              </div>
            ))}
            {visibleReviews < reviews.length && (
              <button
                onClick={handleSeeMoreReviews}
                className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
              >
                See More Reviews
              </button>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
              <button
                onClick={() => setEditModalVisible(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close Modal"
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-semibold mb-4 text-teal-600">Edit Comment</h2>
              <textarea
                value={editingReview.comment}
                onChange={(e) =>
                  setEditingReview((prev) => ({
                    ...prev,
                    comment: e.target.value
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="4"
              />
              <div className="flex gap-4 mt-4 justify-end">
                <button
                  onClick={handleSaveEditedReview}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditModalVisible(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Qualifications */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-teal-600">Qualifications</h2>
          <p className="text-gray-700 mt-2">{tutor.qualifications}</p>
        </div>

        {/* Certifications Section */}
        {tutor && tutor.certifications && certificationsArray.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-teal-600">Certifications</h2>
            <ul className="flex flex-wrap gap-6 mt-4">
              {certificationsArray.map((certificate, index) => (
                <li key={index} className="group relative">
                  <Link
                    to={`${BASE_URL_IMAGE}uploads/${certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={`${BASE_URL_IMAGE}uploads/${certificate}`}
                      alt={`Certification ${index + 1}`}
                      className="w-32 h-32 object-cover border rounded-md shadow-md transition-transform transform group-hover:scale-105"
                    />
                  </Link>
                  <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    View Certification
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 text-gray-500">No certifications available.</p>
        )}

        {/* General Availability */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-teal-600">General Availability</h2>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 border-collapse border">
              <thead>
                <tr>
                  <th className="border p-3 bg-teal-500 text-white">Time</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="border p-3 bg-teal-500 text-white">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tutor?.availability?.map((item) => (
                  <tr key={item.time} className="hover:bg-gray-100">
                    <td className="border p-3 font-semibold text-center">{item.time}</td>
                    {daysOfWeek.map((day) => (
                      <td key={day} className="border p-3 text-center">
                        {isAvailable(day, item.time) ? (
                          <span className="text-green-500 font-bold">✓</span>
                        ) : (
                          <span className="text-red-500 font-bold">✕</span>
                        )}
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

export default TutorProfileDetail;

// {tutor.certifications && tutor.certifications.length > 0 && (
//     <div className="mt-5">
//       <h2 className="text-xl font-semibold">Certifications</h2>
//       <ul className="mt-3">
//         {tutor.certifications.map((certificate, index) => (
//           <li key={index} className="mb-2">
//             {/* Display image preview if it's an image file */}
//             <a
//               href={`${BASE_URL_IMAGE}uploads/${certificate}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 underline"
//             >
//               {/* Show image as thumbnail for certificates */}
//               <img
//                 src={`${BASE_URL_IMAGE}uploads/${certificate}`}
//                 alt={`Certification ${index + 1}`}
//                 className="w-16 h-16 object-cover border rounded"
//               />
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}

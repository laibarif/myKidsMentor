import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
import pencilimg from '../../assests/pencil-5798875.jpg'
import { FaSpinner, FaSearch, FaTimes, FaUndo } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function Dashboard() {
  const [tutorsWithReviews, setTutorsWithReviews] = useState([]);
  const [filters, setFilters] = useState({
    subject: "all",
    level: "all",
    price: "all",
    city: "",
    day: "",
    time: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]); // Store availability array
  const [loading, setLoading] = useState(false); // Loading state

  const updateAvailability = (selectedDay, selectedTime) => {
    if (selectedDay && selectedTime) {
      setAvailability([{ day: selectedDay, time: selectedTime }]);
    } else {
      setAvailability([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };

      // If the day or time changes, update availability
      if (name === "day" || name === "time") {
        updateAvailability(newFilters.day, newFilters.time); // Use newFilters, not filters
      }

      return newFilters;
    });
  };

  const handleApplyFilters = async () => {
    // Reset messages and errors
    setMessage("");
    setError(null);
    setLoading(true);

    try {
      // Construct the query params based on the selected filters
      const filterParams = {};

      if (filters.subject !== "all") {
        filterParams.subjectsTaught = filters.subject;
      }

      if (filters.level !== "all") {
        filterParams.gradesHandled = filters.level;
      }

      if (filters.price !== "all") {
        filterParams.hourlyRates = filters.price;
      }

      if (filters.city.trim() !== "") {
        filterParams.city = filters.city;
      }

      if (availability.length > 0) {
        filterParams.availability = JSON.stringify(availability); // Convert array to string
      }

      console.log("Filter Params:", filterParams);

      // If no filters are applied, inform the user
      if (Object.keys(filterParams).length === 0) {
        toast.info("Please select at least one filter to apply.");
        setLoading(false); // Ensure loading state is reset
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/filterTutor/filter",
        { params: filterParams }
      );

      console.log("Response:", response);

      // Ensure that the response contains valid data
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        const filteredTutors = response.data.data;

        // Fetch reviews for each filtered tutor and attach averageRating
        const tutorsWithReviews = await Promise.all(
          filteredTutors.map(async (tutor) => {
            const reviews = await fetchReviews(tutor.id); // Fetch reviews for each tutor

            // Calculate average rating
            const averageRating = reviews.length
              ? (
                  reviews.reduce((total, review) => total + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : 0; // Default to 0 if no reviews

            return { ...tutor, reviews, averageRating };
          })
        );

        setTutorsWithReviews(tutorsWithReviews); // Update tutors with reviews and ratings
        toast.success("Filters applied successfully!");
      } else {
        setTutorsWithReviews([]); // Clear tutors if no data matches filters
        setMessage(
          response.data.message || "No tutors found matching the filters."
        ); // Set message
        toast.info("No tutors found matching the filters.");
      }
    } catch (err) {
      console.error("Error fetching filtered tutors:", err);
      setTutorsWithReviews([]); // Clear tutors in case of error
      setError(
        "An error occurred while fetching tutors. Please try again later."
      ); // Display a generic error message
      toast.error("no match tutor filters.");
    } finally {
      setLoading(false); // End loading state
    }
  };

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

  const fetchAllTutors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tutor/allprofile"
      );
      const tutorsData = response.data.tutors;

      // Fetch reviews for each tutor and attach them
      const tutorsWithReviews = await Promise.all(
        tutorsData.map(async (tutor) => {
          const reviews = await fetchReviews(tutor.id); // Fetch reviews for each tutor

          // Calculate average rating
          const averageRating = reviews.length
            ? (
                reviews.reduce((total, review) => total + review.rating, 0) /
                reviews.length
              ).toFixed(1)
            : 0; // Default to 0 if no reviews

          return { ...tutor, reviews, averageRating };
        })
      );

      setTutorsWithReviews(tutorsWithReviews);
      setMessage("");
    } catch (error) {
      console.error("Error fetching tutors:", error);
      setError("Failed to load tutors. Please try again later.");
    
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tutors on component mount
  useEffect(() => {
    fetchAllTutors();
  }, []);

  // Handler to reset all filters and fetch all tutors
  const handleResetFilters = () => {
    setFilters({
      subject: "all",
      level: "all",
      price: "all",
      city: "",
      day: "",
      time: ""
    });
    setAvailability([]);
    setTutorsWithReviews([]);
    setMessage("");
    toast.info("Filters have been reset.");
    fetchAllTutors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-teal-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        

        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-start gap-6">
          <h2 className="text-3xl font-bold text-teal-700 mb-4">Filter Tutors</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subject Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="subject" className="mb-2 font-semibold text-teal-600">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Subjects</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="urdu">Urdu</option>
                <option value="biology">Biology</option>
                <option value="history">History</option>
                <option value="chemistry">Chemistry</option>
                <option value="physics">Physics</option>
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="level" className="mb-2 font-semibold text-teal-600">
                Level
              </label>
              <select
                id="level"
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Levels</option>
                <option value="grade1">GRADE-1</option>
                <option value="grade2">GRADE-2</option>
                <option value="grade3">GRADE-3</option>
                <option value="grade4">GRADE-4</option>
                <option value="grade5">GRADE-5</option>
                <option value="grade6">GRADE-6</option>
                <option value="grade7">GRADE-7</option>
                <option value="grade8">GRADE-8</option>
                <option value="grade9">GRADE-9</option>
                <option value="grade10">GRADE-10</option>
              </select>
            </div>

            {/* Price Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="price" className="mb-2 font-semibold text-teal-600">
                Price ($/hr)
              </label>
              <select
                id="price"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                className="p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Prices</option>
                <option value="20">20$</option>
                <option value="25">25$</option>
                <option value="30">30$</option>
                <option value="35">35$</option>
                <option value="40">40$</option>
                <option value="45">45$</option>
                <option value="50">50$</option>
                <option value="55">55$</option>
                <option value="60">60$</option>
              </select>
            </div>

            {/* City Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="city" className="mb-2 font-semibold text-teal-600">
                City
              </label>
              <select
                id="city"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Cities</option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
                <option value="rawalpindi">Rawalpindi</option>
                <option value="faisalabad">Faisalabad</option>
                <option value="peshawar">Peshawar</option>
                <option value="quetta">Quetta</option>
                <option value="multan">Multan</option>
                <option value="sialkot">Sialkot</option>
                <option value="hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Day Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="day" className="mb-2 font-semibold text-teal-600">
                Day
              </label>
              <select
                id="day"
                name="day"
                value={filters.day}
                onChange={handleFilterChange}
                className="p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Any Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            {/* Time Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="time" className="mb-2 font-semibold text-teal-600">
                Time
              </label>
              <select
                id="time"
                name="time"
                value={filters.time}
                onChange={handleFilterChange}
                className="p-3 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Any Time</option>
                <option value="9AM">9AM</option>
                <option value="10AM">10AM</option>
                <option value="11AM">11AM</option>
                <option value="12PM">12PM</option>
                <option value="1PM">1PM</option>
                <option value="2PM">2PM</option>
                <option value="3PM">3PM</option>
                <option value="4PM">4PM</option>
                <option value="5PM">5PM</option>
              </select>
            </div>
          </div>

          {/* Apply Filters and Clear Filters Buttons */}
          <div className="w-full flex flex-col md:flex-row items-center gap-4 mt-6">
            <button
              onClick={handleApplyFilters}
              aria-label="Apply Filters"
              className={`w-full md:w-auto flex items-center justify-center bg-teal-600 text-white p-3 font-semibold rounded-md hover:bg-teal-500 transition duration-200 shadow-md ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaSearch className="mr-2" />
              )}
              {loading ? "Applying Filters..." : "Apply Filters"}
            </button>
            {/* Reset Filters Button */}
        
          <button
            onClick={handleResetFilters}
            aria-label="Reset Filters"
            className="flex items-center bg-red-500 text-white px-4 py-2 font-semibold rounded-md hover:bg-red-600 transition duration-200 shadow-md"
          >
            <FaUndo className="mr-2" />
            Reset Filters
          </button>
        
          </div>

          {message && (
            <div className="w-full text-center text-gray-700 text-sm font-semibold mt-4" role="status">
              {message}
            </div>
          )}
        </div>

        {/* Tutor Cards */}
        <section className="mt-16">
          <h2 className="text-center text-4xl font-extrabold text-teal-800 mb-12">
            {filters.subject === "all" && filters.level === "all"
              ? "List of Verified Tutors"
              : "Filtered Tutors"}
          </h2>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-teal-600 text-5xl" />
            </div>
          )}

          {/* Tutor Grid */}
          {!loading && tutorsWithReviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorsWithReviews.map((tutor) => (
                <Link
                  to={`/parent/tutorDetail/${tutor.id}`}
                  key={tutor.id}
                  className="block transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-teal-300"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    {/* Profile Picture */}
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                      {tutor.profilePicture ? (
                        <img
                          src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                          alt={`${tutor.name}'s Profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={pencilimg}
                          alt="Default Profile"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Profile Details */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-teal-700 hover:text-teal-600 transition-colors duration-200">
                        {tutor.name}
                      </h3>
                      <p className="text-gray-600 mt-3">{tutor.qualifications}</p>
                      <div className="mt-4">
                        {/* Badges for Subjects */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tutor.subjectsTaught.map((subject, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full"
                            >
                              {capitalizeFirstLetter(subject)}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700">
                          <span className="font-semibold">City:</span> {capitalizeFirstLetter(tutor.city)}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Email:</span> {tutor.email}
                        </p>
                      </div>
                    </div>

                    {/* Hourly Rates & Rating */}
                    <div className="flex justify-between items-center p-6 bg-teal-50">
                      <div>
                        <span className="text-xl font-semibold text-teal-600">
                          ${tutor.hourlyRates}
                        </span>
                        <span className="text-sm text-gray-600"> /hr</span>
                      </div>
                      <div className="flex items-center">
                        {/* Star Icon */}
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.377 2.454a1 1 0 00-.364 1.118l1.286 3.974c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.377 2.454c-.784.57-1.838-.197-1.54-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.422 9.401c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.974z" />
                        </svg>
                        <span className="ml-2 text-gray-700 font-medium">
                          {tutor.averageRating > 0
                            ? `${tutor.averageRating} / 5`
                            : "No Ratings"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Tutors Found */}
          {!loading && tutorsWithReviews.length === 0 && message && (
            <div className="flex flex-col items-center justify-center mt-16">
              {/* SVG Illustration */}
              <svg
                className="w-24 h-24 text-gray-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A2 2 0 013 15.236V6.764a2 2 0 012-2h4m8 12l5.447-2.724A2 2 0 0121 15.236V6.764a2 2 0 00-1.553-1.988L13 4m0 0V4a2 2 0 00-2 2v.5M13 4v16m0 0h6m-6 0H7"
                />
              </svg>
              <p className="text-2xl text-gray-600">{message}</p>
            </div>
          )}
        </section>
      </main>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-6 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} My Kids Mentor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
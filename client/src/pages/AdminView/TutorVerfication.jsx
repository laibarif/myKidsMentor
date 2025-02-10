import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaCheck, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

function TutorVerification() {
  const [unverifiedTutors, setUnverifiedTutors] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;
  const dropdownRefs = useRef({});

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/getUnverifiedTutors/${id}`
      );
      setSelectedTutor(response.data?.tutor);
      setPopupIsOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tutor details");
    }
  };
  useEffect(() => {
    if (selectedTutor) {
      console.log("Selected Tutor Certifications:", selectedTutor?.certifications || "no");
    }
  }, [selectedTutor]);
  const closePopup = () => {
    setPopupIsOpen(false);
    setSelectedTutor(null);
  };

  const fetchUnverifiedTutors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/unverified-tutors"
      );
      setUnverifiedTutors(response.data.unverifiedTutors);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverifiedTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/approve-tutor/${id}`);
      toast.success("Tutor approved successfully!");
      fetchUnverifiedTutors(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve tutor");
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(unverifiedTutors.length / itemsPerPage);
  const currentData = unverifiedTutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle Click Outside for Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      for (const key in dropdownRefs.current) {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key].contains(event.target)
        ) {
          dropdownRefs.current[key].classList.add("hidden");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaEye className="animate-spin text-5xl text-teal-500" />
      </div>
    );
  }
 // Process certifications (JSON string or array)
 let certificationsArray = [];
 if (selectedTutor) {
   if (typeof selectedTutor.certifications === "string") {
     try {
       certificationsArray = JSON.parse(selectedTutor.certifications);
     } catch (error) {
       console.error("Error parsing certifications:", error);
     }
   } else if (Array.isArray(selectedTutor.certifications)) {
     certificationsArray = selectedTutor.certifications;
   }
 }
 
  return (
    <div className="container mx-auto px-4 sm:px-8 py-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="py-8">
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-teal-700">
            Unverified Tutors
          </h2>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Qualification
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    View Detail
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-teal-500 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((tutor) => (
                    <tr key={tutor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <img
                              className="w-full h-full rounded-full object-cover"
                              src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                              alt={tutor.name}
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {tutor.name}
                            </p>
                            <p className="text-gray-600 whitespace-no-wrap">
                              {tutor.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {tutor.city}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {tutor.qualifications}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <button
                          onClick={() => handleViewDetails(tutor.id)}
                          className="flex items-center text-teal-600 hover:text-teal-800 font-medium"
                        >
                          <FaEye className="mr-2" /> View Detail
                        </button>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <button
                          onClick={() => handleApprove(tutor.id)}
                          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                          <FaCheck className="mr-2" /> Approve
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                    >
                      No unverified tutors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="px-5 py-5 bg-white border-t flex flex-col sm:flex-row items-center sm:justify-between">
              <span className="text-xs sm:text-sm text-gray-900">
                Showing {currentData.length} of {unverifiedTutors.length} Entries
              </span>
              <div className="inline-flex mt-2 sm:mt-0">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <FaChevronLeft /> Prev
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${
                    currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
            {/* Detail Popup */}
            {popupIsOpen && selectedTutor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative overflow-y-auto max-h-screen transform transition-transform duration-300 scale-100">
                  <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                  {/* Header Section */}
                  <div className="text-center mb-6">
                    <img
                      src={`${BASE_URL_IMAGE}uploads/${selectedTutor.profilePicture}`}
                      alt={`${selectedTutor.name}'s profile`}
                      className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-teal-500 shadow-md"
                    />
                    <h2 className="text-2xl font-bold mt-4 text-teal-700">
                      {selectedTutor.name}
                    </h2>
                    <p className="text-gray-600">{selectedTutor.email}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-teal-600">
                        Basic Info
                      </h3>
                      <p>
                        <span className="font-medium">City:</span> {selectedTutor.city}
                      </p>
                      <p>
                        <span className="font-medium">Gender:</span> {selectedTutor.gender}
                      </p>
                      <p>
                        <span className="font-medium">Postcode:</span> {selectedTutor.postcode}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {selectedTutor.phoneNumber}
                      </p>
                    </div>

                    {/* Professional Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-teal-600">
                        Professional Details
                      </h3>
                      <p>
                        <span className="font-medium">Qualifications:</span>{" "}
                        {selectedTutor.qualifications}
                      </p>
                      <p>
                        <span className="font-medium">Teaching Experience:</span>{" "}
                        {selectedTutor.teachingExperience} years
                      </p>
                      <p>
                        <span className="font-medium">Hourly Rates:</span>{" "}
                        ${selectedTutor.hourlyRates}
                      </p>
                      <h4 className="text-md font-semibold mt-4 text-teal-600">
                        Subjects Taught:
                      </h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {selectedTutor.subjectsTaught.map((subject, index) => (
                          <li key={index}>{subject}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-teal-600">
                        Additional Details
                      </h3>
                      <h4 className="text-md font-semibold mt-2 text-teal-600">
                        Grades Handled:
                      </h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {selectedTutor.gradesHandled.map((grade, index) => (
                          <li key={index}>{grade}</li>
                        ))}
                      </ul>
                      <h4 className="text-md font-semibold mt-4 text-teal-600">
                        Availability:
                      </h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {selectedTutor.availability.map((slot, index) => (
                          <li key={index}>
                            {slot.day} at {slot.time}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Certifications */}
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

                  {/* Close Button */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={closePopup}
                      className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Error Message */}
            {error && (
              <div className="mt-4 text-center text-red-500">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorVerification;
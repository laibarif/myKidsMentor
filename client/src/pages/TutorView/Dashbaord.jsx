import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

const Dashboard = () => {
  const [formData, setFormData] = useState({
    id: "",
    phoneNumber: "",
    profilePicture: null,
    subjectsTaught: [],
    gradesHandled: [],
    certifications: "",
    qualifications: "",
    hourlyRates: "",
    availability: [],
    city: "",
    postcode: ""
  });

  const gradeOptions = [
    { value: "grade1", label: "Grade 1" },
    { value: "grade2", label: "Grade 2" },
    { value: "grade3", label: "Grade 3" },
    { value: "grade4", label: "Grade 4" }
  ];

  const subjectOptions = [
    { value: "math", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" }
  ];

  const handleSubjectsChange = (selectedOptions) => {
    const newSubjects = selectedOptions.map((option) => option.value);
    // Merge new subjects with previously selected ones, ensuring uniqueness
    setFormData({
      ...formData,
      subjectsTaught: [...new Set([...formData.subjectsTaught, ...newSubjects])]
    });
  };

  const filteredSubjectOptions = subjectOptions.filter(
    (option) => !formData.subjectsTaught.includes(option.value)
  );

  const handleGradesChange = (selectedOptions) => {
    const newGrades = selectedOptions.map((option) => option.value);
    // Merge new grades ensuring uniqueness
    setFormData({
      ...formData,
      gradesHandled: [...new Set([...formData.gradesHandled, ...newGrades])]
    });
  };

  const filteredGradeOptions = gradeOptions.filter(
    (option) => !formData.gradesHandled.includes(option.value)
  );

  const removeSubject = (subjectToRemove) => {
    setFormData((prev) => ({
      ...prev,
      subjectsTaught: prev.subjectsTaught.filter(
        (subject) => subject !== subjectToRemove
      )
    }));
  };

  const removeGrade = (gradeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      gradesHandled: prev.gradesHandled.filter((grade) => grade !== gradeToRemove)
    }));
  };

  const [newAvailability, setNewAvailability] = useState({ day: "", time: "" });

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addAvailability = () => {
    if (newAvailability.day && newAvailability.time) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, newAvailability]
      }));
      setNewAvailability({ day: "", time: "" });
    } else {
      alert("Please fill in both day and time.");
    }
  };

  const removeAvailability = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "profilePicture") {
        setFormData({
          ...formData,
          profilePicture: files[0]
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("hourlyRates", formData.hourlyRates);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("postcode", formData.postcode);

    if (formData.qualifications) {
      formDataToSend.append("qualifications", JSON.stringify(formData.qualifications));
    }

    formData.availability.forEach((item, index) => {
      formDataToSend.append(`availability[${index}]`, JSON.stringify(item));
    });
    formData.subjectsTaught.forEach((subject) => {
      formDataToSend.append("subjectsTaught[]", subject);
    });
    formData.gradesHandled.forEach((grade) => {
      formDataToSend.append("gradesHandled[]", grade);
    });
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    console.log(...formDataToSend.entries());

    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:5000/api/tutor/profile/${formData.id}`;
      const response = await axios.put(apiUrl, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...response.data.tutor
      }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating profile!");
    }
  };

  // Fetch the tutor profile on component mount
  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/tutor/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData(response.data);
      } catch (error) {
        console.error(
          "Error fetching tutor profile:",
          error.response?.data || error.message
        );
      }
    };
    fetchTutorProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-teal-100 to-green-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700 drop-shadow-lg">
            Update Your Profile
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Manage and refine your teaching profile with ease.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-2xl p-8 transition-all">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
                required
              />
            </div>
            {/* Subjects Taught */}
            <div>
              <label htmlFor="subjectsTaught" className="block mb-2 text-sm font-medium text-gray-900">
                Subjects Taught
              </label>
              <Select
                id="subjectsTaught"
                options={filteredSubjectOptions}
                isMulti
                onChange={handleSubjectsChange}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select Subjects"
              />
              <div className="mt-2 space-y-2">
                {formData.subjectsTaught.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-gray-800">{subject}</span>
                    <button
                      onClick={() => removeSubject(subject)}
                      className="text-red-600 text-sm hover:underline"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Grades Handled */}
            <div>
              <label htmlFor="gradesHandled" className="block mb-2 text-sm font-medium text-gray-900">
                Grades Handled
              </label>
              <Select
                id="gradesHandled"
                options={filteredGradeOptions}
                isMulti
                onChange={handleGradesChange}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select Grades"
              />
              <div className="mt-2 space-y-2">
                {formData.gradesHandled.map((grade) => (
                  <div
                    key={grade}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-gray-800">{grade}</span>
                    <button
                      onClick={() => removeGrade(grade)}
                      className="text-red-600 text-sm hover:underline"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Qualifications */}
            <div>
              <label htmlFor="qualifications" className="block mb-2 text-sm font-medium text-gray-900">
                Qualifications
              </label>
              <input
                type="text"
                id="qualification"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
                required
              />
            </div>
            {/* Hourly Rate */}
            <div>
              <label htmlFor="hourlyRates" className="block mb-2 text-sm font-medium text-gray-900">
                Hourly Rate
              </label>
              <select
                id="hourlyRates"
                name="hourlyRates"
                value={formData.hourlyRates}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
                required
              >
                <option value="" disabled>
                  Select hourly rate
                </option>
                <option value="20">20$</option>
                <option value="25">25$</option>
                <option value="30">30$</option>
                <option value="40">40$</option>
                <option value="50">50$</option>
                <option value="60">60$</option>
              </select>
            </div>
            {/* City */}
            <div>
              <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">
                City
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
                required
              >
                <option value="">Select City</option>
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
            {/* Postcode */}
            <div>
              <label htmlFor="postcode" className="block mb-2 text-sm font-medium text-gray-900">
                Postcode
              </label>
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
                required
              />
            </div>
            {/* Profile Picture */}
            <div className="sm:col-span-2">
              <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium text-gray-900">
                Upload Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500 transition"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload an image or document for your profile picture.
              </p>
            </div>
            {/* Availability */}
            <div className="sm:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Availability
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <select
                    name="day"
                    value={newAvailability.day}
                    onChange={handleAvailabilityChange}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-1/2 p-2.5 transition"
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g., 12:00 PM - 4:00 PM"
                    value={newAvailability.time}
                    onChange={handleAvailabilityChange}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
                  />
                  <button
                    type="button"
                    onClick={addAvailability}
                    className="bg-teal-700 text-white px-3 py-1 rounded-lg transition transform hover:scale-105"
                  >
                    Add
                  </button>
                </div>
                {/* Display Added Availability */}
                <ul className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
                  {formData.availability.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-md shadow-md hover:shadow-lg transition-shadow"
                    >
                      <span className="text-gray-700 font-medium">
                        {item.day}: <span className="font-semibold">{item.time}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAvailability(index)}
                        className="text-red-600 text-sm font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Submit Button */}
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="w-full md:w-1/2 px-4 py-3 bg-teal-700 text-white text-xl font-bold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition transform hover:scale-105"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
import React, { useState } from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const TutorRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "tutor",
    password: "",
    profilePicture: "",
    qualifications: "",
    subjectsTaught: [],
    gradesHandled: [],
    teachingExperience: "",
    hourlyRates: "",
    availability: [],
    certifications: "",
    city: "",
    postcode: "",
  });
  const gradeOptions = [
    { value: "grade1", label: "Grade 1" },
    { value: "grade2", label: "Grade 2" },
    { value: "grade3", label: "Grade 3" },
    { value: "grade4", label: "Grade 4" },
  ];

  const subjectOptions = [
    { value: "math", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
  ];
  const handleSubjectsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subjectsTaught: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    });
  };

  const handleGradesChange = (selectedOptions) => {
    setFormData({
      ...formData,
      gradesHandled: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    });
  };

  const [newAvailability, setNewAvailability] = useState({ day: "", time: "" });

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAvailability = () => {
    if (newAvailability.day && newAvailability.time) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, newAvailability],
      }));
      setNewAvailability({ day: "", time: "" });
    } else {
      alert("Please fill in both day and time.");
    }
  };

  const removeAvailability = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.name &&
          formData.email &&
          formData.phoneNumber &&
          formData.password
        );
      case 2:
        return (
          formData.subjectsTaught &&
          formData.gradesHandled &&
          formData.teachingExperience
        );
      case 3:
        return formData.hourlyRates && formData.availability && formData.city;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("teachingExperience", formData.teachingExperience);
    formDataToSend.append("hourlyRates", formData.hourlyRates);
    formDataToSend.append("qualifications", formData.qualifications);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("postcode", formData.postcode);
    formDataToSend.append("gender", formData.gender);
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }
    if (formData.certifications) {
      formDataToSend.append("certifications", formData.certifications);
    }
    formData.availability.forEach((item, index) => {
      formDataToSend.append(`availability[${index}]`, JSON.stringify(item));
    });
    // Append arrays to FormData
    if (formData.subjectsTaught.length > 0) {
      formData.subjectsTaught.forEach((subject) => {
        formDataToSend.append("subjectsTaught[]", subject);
      });
    } else {
      formDataToSend.append("subjectsTaught[]", "");
    }

    if (formData.gradesHandled.length > 0) {
      formData.gradesHandled.forEach((grade) => {
        formDataToSend.append("gradesHandled[]", grade);
      });
    } else {
      formDataToSend.append("gradesHandled[]", "");
    }

    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Registration successful!");

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          role: "tutor",
          password: "",
          profilePicture: "",
          qualifications: "",
          subjectsTaught: [],
          gradesHandled: [],
          teachingExperience: "",
          hourlyRates: "",
          availability: [],
          certifications: "",
          city: "",
          postcode: "",
        });
        navigate("/loginTutor");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // Show specific backend message
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center py-6">
      <div className="bg-white rounded-lg shadow-xl shadow-slate-950 p-6 md:p-10 w-full md:w-1/2 mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-teal-700">
          Tutor Registration Form
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                  step <= currentStep
                    ? "text-green-600 bg-green-200"
                    : "text-green-600 bg-green-200 opacity-50"
                }`}
              >
                {["Personal Info", "Accedmic Info", "Availablity"][step - 1]}
              </span>
            ))}
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
            <div
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <form
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {currentStep === 1 && (
            <div>
              <div className="mb-3">
                <label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="fileUpload"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  aria-describedby="file_help"
                />
                <p id="file_help" className="mt-1 text-sm text-gray-500">
                  Please upload a file (e.g., image, document).
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-3">
                <label
                  htmlFor="subjectsTaught"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Subjects Taught
                </label>
                <Select
                  id="subjectsTaught"
                  options={subjectOptions}
                  isMulti
                  onChange={handleSubjectsChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Subjects"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="gradesHandled"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Grades Handled
                </label>
                <Select
                  id="gradesHandled"
                  options={gradeOptions}
                  isMulti
                  onChange={handleGradesChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Grades"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Teching Experience
                </label>
                <input
                  type="text"
                  id="teachingExperience"
                  name="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Qualification
                </label>
                <input
                  type="text"
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="qualifications"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Certificate
                </label>
                <input
                  type="file"
                  name="certifications"
                  multiple
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  aria-describedby="certifications_help"
                />
                <p
                  id="certifications_help"
                  className="mt-1 text-sm text-gray-500"
                >
                  Please upload a PDF, Word document, or image of your
                  certifications.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-3">
                <label
                  htmlFor="hourlyRates"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Hourly Rate
                </label>
                <select
                  id="hourlyRates"
                  name="hourlyRates"
                  value={formData.hourlyRates}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
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

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Availability
                </label>
                <div className="flex gap-2 mb-2">
                  <select
                    name="day"
                    value={newAvailability.day}
                    onChange={handleAvailabilityChange}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
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
                    placeholder="e.g., 12:00PM  4:00PM"
                    value={newAvailability.time}
                    onChange={handleAvailabilityChange}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 w-full"
                  />
                  <button
                    type="button"
                    onClick={addAvailability}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg"
                  >
                    Add
                  </button>
                </div>

                {/* Display Added Availability */}
                <ul className="list-disc pl-5">
                  {formData.availability.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {item.day}: {item.time}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAvailability(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city} // Assuming you're using formData for managing state
                  onChange={handleChange} // Handles the form input change
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
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

              <div className="mb-3">
                <label
                  htmlFor="postcode"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Postcode
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:shadow-outline"
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:shadow-outline"
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            )}
          </div>
          <p className="text-right pt-6 text-teal-700 font-semibold">
            Already have account ?
            <Link
              to="/loginTutor"
              className="ml-1 hover:text-teal-600 hover:underline hover:underline-offset-4"
            >
              Login here
            </Link>
            <b className="px-5">Or</b>
            <Link to="/landing" class="hover:underline">
              Go to landing page?
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TutorRegistration;

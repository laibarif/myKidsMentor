import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parentRegister from "../../assests/parentLogin.jpeg";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    profilePicture: null,
    role: "parent",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

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
      setFormData({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        profilePicture: "",
      });
      setTimeout(() => {
        navigate("/loginParent");
      }, 3000);
    } catch (error) {
      if (error.response) {
        // Server responded with an error status
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        // Network or other error
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center items-center font-[sans-serif] bg-rose-50 lg:h-screen p-6">
        <div className="grid md:grid-cols-2 items-center gap-y-8 bg-white max-w-7xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md overflow-hidden">
          <div className="w-full h-full">
            <img
              src={parentRegister}
              alt="Register illustration"
              className="w-full h-full"
            />
          </div>

          <form onSubmit={handleSubmit} className="sm:p-8 p-4 w-full">
            <div className="mb-12">
              <h3 className="text-teal-700 text-4xl font-bold text-center">
                Parent Registration
              </h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  First Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter Email Address"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="*****************"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Profile Picture
                </label>
                <input
                  name="profilePicture"
                  type="file"
                  onChange={handleFileChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="py-3 px-6 text-sm tracking-wide font-semibold rounded-md text-white bg-teal-700 hover:bg-teal-600 focus:outline-none transition-all"
              >
                Sign up
              </button>
              <p className="flex justify-center text-sm text-teal-700 font-semibold pt-6">
                Already registered?
                <Link
                  to="/loginParent"
                  className="ml-1 hover:text-teal-500 hover:underline hover:underline-offset-4"
                >
                  Login here
                </Link>
                <b className="px-5">Or</b>
                <Link to="/landing" class="hover:underline">
                  Go to landing page?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;

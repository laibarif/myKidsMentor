import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice.js";
import logo from "../../assests/Logo.svg";
import {
  FaUserCheck,
  FaTachometerAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg"; // Import the CgProfile icon
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

function Footer() {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("isAuthenticated", "false");
    dispatch(logout());
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white shadow-md dark:bg-gray-800">
        <div className="px-4 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <Link
              to="/admin/tutorVerfication"
              className="flex items-center gap-x-2 text-teal-700"
            >
              <img alt="Logo" src={logo} className="h-10 w-auto" />
              <h1 className="hidden sm:flex items-center text-2xl font-bold">
                Mykids Mentor
              </h1>
            </Link>

            <div className="flex items-center gap-x-4">
              <button
                onClick={toggleSidebar}
                className="sm:hidden p-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isSidebarOpen ? (
                  <FaTimes className="w-6 h-6 text-teal-700" />
                ) : (
                  <FaBars className="w-6 h-6 text-teal-700" />
                )}
              </button>

              <span className="hidden sm:block font-semibold uppercase">
                {user?.name}
              </span>

               {
                user.profile_picture ? (
                  <button
                  onClick={toggleDropdown}
                  className="flex items-center p-2 rounded-full bg-gray-800 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
               
                    <img
                      alt="User"
                      src={`${BASE_URL_IMAGE}uploads/${user?.profile_picture}`}
                      className="w-8 h-8 rounded-full object-cover "
                    />
                  
                </button>
                )
                :
                (
                  <button
                  onClick={toggleDropdown}
                  className="flex items-center p-2 rounded-full focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                 <CgProfile className="w-8 h-8 text-gray-500" />
                  
                </button>
                )
               }
             
                
              
              {isDropdownOpen && (
                <div className="absolute top-12 right-4 z-50 bg-white rounded-lg shadow-lg dark:bg-gray-700">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      {user?.email}
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-white shadow-lg border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 hover:bg-teal-100 dark:text-white dark:hover:bg-teal-600 rounded-md transition-colors"
              >
                <FaTachometerAlt className="w-5 h-5" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/tutorVerfication"
                className="flex items-center p-2 text-gray-900 hover:bg-teal-100 dark:text-white dark:hover:bg-teal-600 rounded-md transition-colors"
              >
                <FaUserCheck className="w-5 h-5" />
                <span className="ml-3">Tutor Verification</span>
              </Link>
            </li>

            {/* Add more sidebar items here with appropriate icons */}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Footer;

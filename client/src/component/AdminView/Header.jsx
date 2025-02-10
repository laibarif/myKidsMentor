import React, { useState } from 'react';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar Toggle and Brand */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center p-2 transition-colors text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 mr-3"
            >
              {menuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiOutlineMenu className="w-6 h-6" />
              )}
              <span className="ml-2 font-medium">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
            </button>
            <a href="/" className="flex items-center">
              <img
                className="h-8 w-8 mr-2"
                src="https://flowbite.com/docs/images/logo.svg"
                alt="Logo"
              />
              <span className="text-xl font-semibold text-gray-800">YourBrand</span>
            </a>
          </div>
          {/* Right: User Profile */}
          <div className="flex items-center">
            <button
              type="button"
              className="flex items-center bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="User Profile"
              />
            </button>
            {/* Dropdown can be implemented here if required */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
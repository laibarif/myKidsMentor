import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assests/Logo.svg";
function Footer() {
  return (
    <footer class="w-full ">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <div class="border-b border-gray-200 "></div>

        <div class="grid grid-cols-2 min-[690px]:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-8 pt-14 pb-8 max-w-xs mx-auto min-[690px]:max-w-2xl lg:max-w-full">
          <div class="col-span-full mb-10 lg:col-span-2 lg:mb-0">
            <Link
              to="/landing"
              className="-m-1.5 p-1.5 flex gap-x-2 text-teal-700"
            >
              <img alt="" src={logo} className="h-14 w-auto" />
              <h1 className="hidden sm:flex items-center text-2xl font-bold">
                Mykids Mentor
              </h1>
            </Link>
            <p className="pt-14 text-gray-600">Copyright Reserved MyKidsMenotr @2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

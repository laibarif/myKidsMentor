import React from "react";
import { Link } from "react-router-dom";
import parentLogin from "../../assests/parentLogin.jpeg";
import tutorLogin from "../../assests/tutorLogin.jpg";
import adminLogin from "../../assests/adminlogin.jpeg";
import { SlArrowLeftCircle } from "react-icons/sl";
function LoginFormCards() {
  return (
    <> 
      <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100">
        <Link to="/landing" className="absolute top-4 left-4">
          <button className="p-2 bg-teal-700 text-white font-extrabold rounded hover:bg-teal-600 hover:scale-105 transition-all duration-300 ease-in-out flex gap-x-2">
            <SlArrowLeftCircle className="mt-1 text-2xl group-hover:rotate-[-20deg] transition-transform duration-300" />
            <p className="mt-1">Back</p>
          </button>
        </Link>

        <div class="grid  gap-8 md:grid-cols-3 mt-10 mb-10 md:mt-0 md:mb-0">
          <div class="w-10/12 mx-auto md:mx-0 shadow-xl rounded-lg overflow-hidden shadow-slate-400 transition-transform duration-300 ease-in-out hover:translate-y-[-10px] bg-white">
            <img
              src={adminLogin}
              alt="Tutor"
              class="w-full h-52 object-cover"
            />
            <div class="p-6 text-center">
              <h2 class="text-xl font-bold text-teal-700">Admin</h2>
              <p class="mt-2 text-gray-600">This only for Admin login.</p>
              <Link to="/loginAdmin">
                <button class="mt-4 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-600">
                  Login as Admin
                </button>
              </Link>
            </div>
          </div>

          <div class="w-10/12 mx-auto md:mx-0 shadow-xl rounded-lg overflow-hidden shadow-slate-400 transition-transform duration-300 ease-in-out hover:translate-y-[-10px] bg-white">
            <img
              src={tutorLogin}
              alt="Tutor"
              class="w-full h-52 object-cover"
            />
            <div class="p-6 text-center">
              <h2 class="text-xl font-bold text-teal-700">Tutor</h2>
              <p class="mt-2 text-gray-600">Access your teaching dashboard</p>
              <Link to="/loginTutor">
                <button class="mt-4 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-600">
                  Login as Tutor
                </button>
              </Link>
            </div>
          </div>

          <div class="w-10/12 mx-auto md:mx-0 shadow-xl rounded-lg overflow-hidden shadow-slate-400 transition-transform duration-300 ease-in-out hover:translate-y-[-10px] bg-white">
            <img
              src={parentLogin}
              alt="Parent"
              class="w-full h-52 object-cover"
            />
            <div class="p-6 text-center">
              <h2 class="text-xl font-bold text-teal-700">Parent</h2>
              <p class="mt-2 text-gray-600">Access your parent portal</p>
              <Link to="/loginParent">
                <button class="mt-4 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-600">
                  Login as Parent
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginFormCards;

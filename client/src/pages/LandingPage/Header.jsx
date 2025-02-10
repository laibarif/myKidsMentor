import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../assests/Logo.svg";


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="border border-b-2 shadow-md shadow-slate-500 sticky top-0 z-50 bg-gradient-to-r from-gray-50 to-gray-100">
      <nav
        aria-label="Global"
        className="w-full flex items-center justify-between p-2 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link
            to="/landing"
            className="-m-1.5 p-1.5 flex gap-x-2 text-teal-700"
          >
            <img alt="" src={logo} className="h-20 w-auto" />
            <h1 className="hidden sm:flex items-center text-2xl font-bold">
              Mykids Mentor
            </h1>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12 my-auto">
            <Link
              to="/parent/Register"
              className="text-md font-bold text-teal-700"
            >
              Find a tutor
            </Link>
          
            <Link
              to="/tutor/Register"
              className="text-md font-bold text-teal-700"
            >
              Become a tutor
            </Link>
          </PopoverGroup>
        <div className=" lg:flex lg:flex-1 lg:justify-end gap-x-5">
          
          <button className="bg-teal-700 text-white px-5 rounded-md">
            <Link
              to="/logins"
              className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold"
            >
              Login
            </Link>
          </button>
          <button className="bg-teal-700 text-white px-5 rounded-md hidden xl:block">
            <Link
              to="/Signups"
              className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold  "
            >
              Signup
            </Link>
          </button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/home" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src={logo} className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/parent/Register"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-teal-700 hover:text-teal-600"
                >
                  Find Tutor
                </Link>
               
                <Link
                  to="/tutor/Register"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-teal-700 hover:text-teal-600"
                >
                  Become a tutor
                </Link>
              </div>
              <div className="py-6 flex justify-between">
                <button className="bg-teal-700 text-white px-5 rounded-md">
                  <Link
                    to="/logins"
                    className="-mx-3  rounded-lg px-3 py-2 text-base/7 font-semibold  hover:text-teal-600"
                  >
                    Login
                  </Link>
                </button>
                <button className="bg-teal-700 text-white px-5 rounded-md">
                  <Link
                    to="/Signups"
                    className="-mx-3  rounded-lg px-3 py-2 text-base/7 font-semibold  hover:text-teal-600"
                  >
                    sign up
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}

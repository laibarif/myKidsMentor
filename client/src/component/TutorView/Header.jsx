import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice.js";
import logo from "../../assests/Logo.svg";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("Logging out...");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("isAuthenticated", "false");

    dispatch(logout());
  };
  return (
    <div className="bg-white shadow-sm shadow-slate-400">
      <nav
        aria-label="Global"
        className="w-full flex items-center justify-between p-2 lg:px-4"
      >
        <div className="flex lg:flex-1">
          <Link
            to="/tutor/dashboard"
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
        <PopoverGroup className="hidden lg:flex lg:gap-x-8 ">
          <Link
            to="/tutor/dashboard"
            className="text-md font-semibold text-teal-700 hover:text-teal-900"
          >
            Tutor Profile
          </Link>
          <Link
            to="/tutor/documents"
            className="text-md font-semibold text-teal-700 hover:text-teal-900"
          >
            Add Documents
          </Link>
          <Link
            to="/tutor/messages"
            className="text-md font-semibold text-teal-700 hover:text-teal-900"
          >
            Messages
          </Link>
          <Link
            to="/tutor/reviews"
            className="text-md font-semibold text-teal-700 hover:text-teal-900"
          >
            Reviews & Rating
          </Link>
        </PopoverGroup>
        <div className=" lg:flex lg:flex-1 lg:justify-end gap-x-5 items-center">
          <Menu as="div" className="relative ml-1">
            <div className="flex gap-x-2 items-center">
              <span className="font-bold uppercase pr-2">{user?.name}</span>
              <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src={`${BASE_URL_IMAGE}uploads/${user?.profilePicture}`}
                  className="size-10 rounded-full"
                />
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <MenuItem>
                <button
                  onClick={handleLogout}
                  className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
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
            <div className="flex lg:flex-1">
              <Link
                to="/tutor/dashboard"
                className="-m-1.5 p-1.5 flex gap-x-2 text-teal-700"
              >
                <img alt="" src={logo} className="h-20 w-auto" />
                <h1 className="hidden sm:flex items-center text-2xl font-bold">
                  Mykids Mentor
                </h1>
              </Link>
            </div>
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
              <div className="space-y-2 py-6 ">
                <Link
                  to="/tutor/dashboard"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 "
                >
                  Tutor Profile
                </Link>
                <Link
                  to="/tutor/documents"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 "
                >
                  Add Documents
                </Link>
                <Link
                  to="/tutor/messages"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 "
                >
                  Messsage
                </Link>
                <Link
                  to="/tutor/reviews"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 "
                >
                  Reviews & Rating
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}

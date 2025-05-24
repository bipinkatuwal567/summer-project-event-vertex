import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import {
  CalendarPlus2,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import Logo from "../assets/logo2.png";
import { Link, useLocation } from "react-router";

const UserDashSideBar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const location = useLocation();

  const handleSignout = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "GET" });
      const data = await response.json();

      if (response.ok) {
        dispatch(signOutSuccess());
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <aside className="hidden py-2 md:w-1/3 lg:w-1/5 md:block">
      <div className="sticky px-6 flex flex-col gap-2 text-sm border-r border-indigo-100 font-inter top-12 h-full bg-white rounded-md py-2">
        <Link className="flex gap-2 items-center" to={"/"}>
          <img src={Logo} className="w-8" alt="Logo" />
          <h3 className="text-lg font-semibold">Event Vertex</h3>
        </Link>

        <div className="flex gap-2 items-center border-b border-blue-100 pb-6 mt-4">
          <img
            className="w-12 h-12 rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <div className="flex mt-4 flex-col gap-1">
            <p className="capitalize font-medium text-sm">
              {currentUser.username}
            </p>
            <p
              className={`text-xs self-start py-1 rounded-full px-2 text-white ${currentUser.role === "attendee"
                  ? "bg-blue-500"
                  : "bg-orange-500"
                }`}
            >
              {currentUser.role === "attendee" ? "Attendee" : "Organizer"}
            </p>
          </div>
        </div>

        <div className="flex font-inter flex-col gap-1 mt-4">
          {currentUser.role === "organizer" ? (
            <>
              <Link to={"/user-dashboard?tab=dashboard"}>
                <li
                  className={`${tab === "dashboard"
                      ? "bg-primary-blue text-white"
                      : "bg-white text-gray-500"
                    } flex cursor-pointer items-center px-4 py-3  rounded-md hover:bg-primary-blue hover:text-white text-gray-500 transition duration-200`}
                >
                  {" "}
                  <span>
                    {" "}
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                  </span>{" "}
                  Dashboard
                </li>
              </Link>

              <Link to={"/user-dashboard?tab=myevents"}>
                <li
                  className={`${tab === "myevents"
                      ? "bg-primary-blue text-white"
                      : "bg-white text-gray-500"
                    } flex cursor-pointer items-center px-4 py-3  rounded-md hover:bg-primary-blue hover:text-white text-gray-500 transition duration-200`}
                >
                  {" "}
                  <span>
                    {" "}
                    <Home className="w-5 h-5 mr-2" />
                  </span>{" "}
                  My Events
                </li>
              </Link>

              <Link to={"/user-dashboard?tab=event"}>
                <li
                  className={`${tab === "event"
                      ? "bg-primary-blue text-white"
                      : "bg-white text-gray-500"
                    } flex cursor-pointer items-center px-4 py-3  rounded-md hover:bg-primary-blue hover:text-white text-gray-500 transition duration-200`}
                >
                  {" "}
                  <span>
                    {" "}
                    <CalendarPlus2 className="w-5 h-5 mr-2" />
                  </span>{" "}
                  Create an event
                </li>
              </Link>
            </>
          ) : null}

          {currentUser.role === "attendee" ? (
            <Link to={"/user-dashboard?tab=my"}>
              <li
                className={`${tab === "my"
                    ? "bg-primary-blue text-white"
                    : "bg-white text-gray-500"
                  } flex cursor-pointer items-center px-4 py-3  rounded-md hover:bg-primary-blue hover:text-white text-gray-500 transition duration-200`}
              >
                {" "}
                <span>
                  {" "}
                  <Home className="w-5 h-5 mr-2" />
                </span>{" "}
                My Registrations
              </li>
            </Link>
          ) : null}

          <Link to={"/user-dashboard?tab=profile"}>
            <li
              className={`${tab === "profile"
                  ? "bg-primary-blue text-white"
                  : "bg-white text-gray-500"
                } flex cursor-pointer items-center px-4 py-3  rounded-md hover:bg-primary-blue hover:text-white text-gray-500 transition duration-200`}
            >
              <span>
                <Settings className="w-5 h-5 mr-2" />
              </span>
              Account settings
            </li>
          </Link>

          <li
            className="flex cursor-pointer items-center px-4 py-3 hover:bg-primary-blue hover:text-white text-gray-500 rounded-md transition duration-200"
            onClick={handleSignout}
          >
            <span>
              <LogOut className="w-5 h-5 mr-2" />
            </span>{" "}
            Sign out
          </li>
        </div>
      </div>
    </aside>
  );
};

export default UserDashSideBar;

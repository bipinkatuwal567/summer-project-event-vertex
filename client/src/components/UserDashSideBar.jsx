import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import {
  CalendarPlus2,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Calendar,
} from "lucide-react";
import Logo from "../assets/logo2.png";
import { Link, useLocation } from "react-router-dom";

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
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Menu items based on user role
  const getMenuItems = () => {
    const items = [];

    if (currentUser.role === "organizer") {
      items.push(
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="w-5 h-5" />,
          path: "/user-dashboard?tab=dashboard"
        },
        {
          id: "myevents",
          label: "My Events",
          icon: <Calendar className="w-5 h-5" />,
          path: "/user-dashboard?tab=myevents"
        },
        {
          id: "event",
          label: "Create Event",
          icon: <CalendarPlus2 className="w-5 h-5" />,
          path: "/user-dashboard?tab=event"
        }
      );
    } else {
      items.push({
        id: "my",
        label: "My Registrations",
        icon: <Home className="w-5 h-5" />,
        path: "/user-dashboard?tab=my"
      });
    }

    // Common items for all users
    items.push({
      id: "profile",
      label: "Account Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/user-dashboard?tab=profile"
    });

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="hidden md:block md:w-1/4 lg:w-1/5">
      <div className="fixed px-5 flex flex-col gap-2 text-sm border-r border-indigo-100 font-inter min-h-screen bg-white rounded-md py-5 shadow-sm">
        {/* Logo section */}
        <div className="flex items-center mb-6">
          <Link className="flex gap-2 items-center" to="/">
            <img src={Logo} className="w-8" alt="Logo" />
            <h3 className="text-lg font-semibold">Event Vertex</h3>
          </Link>
        </div>

        {/* User profile section */}
        <div className="flex gap-3 items-center border-b border-blue-100 pb-5 mb-5">
          <div className="relative">
            <img
              className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover"
              src={currentUser.profilePicture}
              alt={`${currentUser.username}'s profile`}
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          
          <div className="flex flex-col">
            <p className="capitalize font-medium text-sm">
              {currentUser.username}
            </p>
            <p
              className={`text-xs self-start py-1 rounded-full px-2 text-white ${
                currentUser.role === "attendee"
                  ? "bg-blue-500"
                  : "bg-orange-500"
              }`}
            >
              {currentUser.role === "attendee" ? "Attendee" : "Organizer"}
            </p>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link key={item.id} to={item.path}>
              <div
                className={`
                  flex items-center px-4 py-3 rounded-lg cursor-pointer
                  ${tab === item.id 
                    ? "bg-primary-blue text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                  }
                  transition-all duration-200
                `}
              >
                <div className="mr-3">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
          
          {/* Sign out button */}
          <button
            onClick={handleSignout}
            className="flex items-center px-4 py-3 mt-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <div className="mr-3">
              <LogOut className="w-5 h-5" />
            </div>
            <span>Sign out</span>
          </button>
        </nav>
        
        {/* Help section at bottom */}
        <div className="mt-auto bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-medium text-indigo-700 mb-1">Need help?</h4>
          <p className="text-xs text-indigo-600">Contact our support team for assistance.</p>
          <a href="mailto:support@eventvertex.com" className="text-xs font-medium text-indigo-700 mt-2 inline-block hover:underline">
            support@eventvertex.com
          </a>
        </div>
      </div>
    </aside>
  );
};

export default UserDashSideBar;

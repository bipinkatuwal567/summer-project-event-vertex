import React, { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router'
import UserDashSideBar from '../components/UserDashSideBar';
import UserProfile from '../components/UserProfile';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../components/ui/Avatar';
import EventForm from './EventForm';
import MyRegistrations from '../components/MyRegistrations';
import OrganizerMyEvents from '../components/OrganizerMyEvents';
import OrganizerDashboard from '../components/OrganizerDashboard';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabURL = urlParams.get("tab");
    if (tabURL) {
      setTab(tabURL);
    }
  }, [location.search])

  // Protect organizer-only tabs
  const isOrganizerTab = ["dashboard", "myevents", "event"].includes(tab);
  if (isOrganizerTab && (!currentUser || currentUser.role !== "organizer")) {
    return <Navigate to="/user-dashboard?tab=profile" replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Sidebar */}
      <UserDashSideBar />

      {/* Dashboard Main Content */}
      <div className='w-full flex flex-col py-1 md:w-2/3 lg:w-3/4'>
        <div className='self-end py-2'>
          <Avatar />
        </div>

        <div className='px-6'>
          {tab === "dashboard" && currentUser.role === "organizer" && <OrganizerDashboard />}
          {tab === "myevents" && currentUser.role === "organizer" && <OrganizerMyEvents />}
          {tab === "profile" && <UserProfile />}
          {tab === "event" && currentUser.role === "organizer" && <EventForm />}
          {tab === "my" && <MyRegistrations />}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

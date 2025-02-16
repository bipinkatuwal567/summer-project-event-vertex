import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice';
import { LogOut } from 'lucide-react';

const UserDashSideBar = () => {
  const dispatch = useDispatch();
  

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
  }
  return (
    <aside className="hidden py-0 md:w-1/3 lg:w-1/5 md:block">
      <div className="sticky flex flex-col gap-2 text-sm border-r border-indigo-100 top-12 h-full bg-white rounded-md py-2">
        <h2 className="mb-4 mt-2 text-2xl font-semibold text-center">Event Vertex</h2>
        <div className='flex flex-col gap-1'>
          <li className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-md">Account settings</li>
          <li className="flex items-center px-3 py-2.5 font-bold hover:bg-white text-indigo-900 border-gray-100 hover:border-x-gray-200 border rounded-md" onClick={handleSignout}>Sign out <LogOut className='w-4 ml-2' /></li>
        </div>
      </div>
    </aside>
  )
}

export default UserDashSideBar
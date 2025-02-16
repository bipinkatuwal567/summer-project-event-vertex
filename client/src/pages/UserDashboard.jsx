import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import UserDashSideBar from '../components/UserDashSideBar';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const [formData, setFormData] = useState({})
  const { currentUser } = useSelector(state => state.user)
  const imageRef = useRef();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  console.log(formData);
  


  // const location = useLocation();
  // const [tab, setTab] = useState("");

  // useEffect(() => {
  //     const urlParams = new URLSearchParams(location.search);
  //     const tabURL = urlParams.set("tab");
  //     if (tabURL) {
  //         setTab(tabURL);
  //     }
  // }, [location.search])

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return;
      if (!file.type.startsWith('image/')) {
        setImageFileUploadError('Please upload an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setImageFileUploadError('File must be less than 2MB');
        return;
      }
      setImage(file)
      setImageUrl(URL.createObjectURL(file));
  }


  const uploadImage = async () => {
    if(!image) return null; // No image selected return early
    const data = new FormData();
    data.append("file", image)
    data.append("upload_preset", uploadPreset)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      ); 

      const responseData = await response.json();

      if(!response.ok){
        throw new Error("Failed to upload image to Cloudinary", responseData.message)
      }

      console.log("cloudinary data", responseData.secure_url);
      
      setImageUrl(responseData.secure_url); // Save the cloudinary image URL
      setFormData({...formData, profilePicture: responseData.secure_url}) // Add URL to form data
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  
  return (
    <div className="bg-gray-100 w-full flex flex-col gap-5 px-3 md:px-2 lg:px-2 md:flex-row text-[#161931]">
      {/* Sidebar */}
      <UserDashSideBar />

      {/* Main Content */}
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-0">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <p className='text-slate-400 mb-2'>Pages / Account Settings</p>
            <h2 className="text-2xl font-bold sm:text-3xl ">Account Settings</h2>

            <div className="grid max-w-2xl mx-auto mt-8">
              {/* Profile Picture Section */}
              <input className='hidden' type="file" accept='image/*' name="image" id="image" ref={imageRef} onChange={handleImageUpload} />
              <div className="flex flex-col items-center justify-center space-y-5 sm:flex-row sm:space-y-0" onClick={() => imageRef.current.click()}>
                <img className="object-cover w-40 cursor-pointer h-40 p-1 rounded-full ring-2 ring-indigo-300"
                  src={imageUrl || currentUser?.profilePicture} />

              </div>

              {/* Profile Form */}
              <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-indigo-900">Your Username</label>
                    <input type="text" id='username' className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm placeholder-slate-800 rounded-lg p-2.5 w-full" defaultValue={currentUser?.username} onChange={handleChange} />
                  </div>

                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">Your Email</label>
                  <input type="email" id='email' className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg p-2.5 w-full"
                    defaultValue={currentUser?.email} onChange={handleChange} />
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-indigo-900">Your Password</label>
                  <input type="text" id='password' className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg p-2.5 w-full" placeholder="********" onChange={handleChange} />
                </div>

                <div className="flex mt-6">
                  <button className="text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard
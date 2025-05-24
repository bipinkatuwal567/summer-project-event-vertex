import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { updateFailure, updateSuccess } from '../redux/user/userSlice';
import { User, Mail, Lock, Upload, Loader2 } from 'lucide-react';

const UserProfile = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({})
  const { currentUser } = useSelector(state => state.user)
  const imageRef = useRef();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageFileUploadError('Please upload an image file');
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setImageFileUploadError('File must be less than 2MB');
      toast.error('File must be less than 2MB');
      return;
    }
    setImage(file)
    setImageUrl(URL.createObjectURL(file));
    setImageFileUploadError(null);
  }


  const uploadImage = async () => {
    if (!image) return null; // No image selected return early

    try {
      toast.loading('Uploading image...');
      const data = new FormData();
      data.append("file", image)
      data.append("upload_preset", uploadPreset)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const responseData = await response.json();
      toast.dismiss();

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary", responseData.message)
      } else {
        toast.success('Image uploaded successfully');
        return responseData.secure_url;
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to upload image');
      return null;
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    try {
      let imageURLToSave = currentUser.profilePicture;

      if (image) {
        const uploadedImageUrl = await uploadImage();
        if (uploadedImageUrl) {
          imageURLToSave = uploadedImageUrl;
        }
      }

      const updateData = { ...formData, profilePicture: imageURLToSave };

      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        setUpdateUserError(data.message);
        toast.error(data.message);
        dispatch(updateFailure());
      } else {
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully");
        setUpdateUserSuccess("Profile updated successfully");
      }
    } catch (error) {
      console.log(error.message);
      setUpdateUserError("Failed to update profile");
      toast.error("Failed to update profile");
      dispatch(updateFailure());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position='bottom-right' />

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm pb-6 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-start">Account Settings</h2>
        <p className="text-gray-500 mt-1">Manage your profile information and account preferences</p>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Profile Picture Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 flex flex-col items-center justify-center border-b border-gray-100">
          <div className="relative group">
            <img
              src={imageUrl || currentUser?.profilePicture}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
            />
            <div
              onClick={() => imageRef.current.click()}
              className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              <Upload className="text-white" size={24} />
            </div>
          </div>

          <input
            className='hidden'
            type="file"
            accept='image/*'
            name="image"
            id="image"
            ref={imageRef}
            onChange={handleImageUpload}
          />

          <button
            onClick={() => imageRef.current.click()}
            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
          >
            <Upload size={14} /> Change Photo
          </button>

          {imageFileUploadError && (
            <p className="text-red-500 text-xs mt-2">{imageFileUploadError}</p>
          )}
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <User size={16} className="mr-2 text-indigo-600" />
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                defaultValue={currentUser?.username}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Mail size={16} className="mr-2 text-indigo-600" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                defaultValue={currentUser?.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Lock size={16} className="mr-2 text-indigo-600" />
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter new password to change"
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to keep your current password</p>
            </div>

            {/* Status Messages */}
            {updateUserSuccess && (
              <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm">
                {updateUserSuccess}
              </div>
            )}

            {updateUserError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                {updateUserError}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary-blue hover:bg-hover-blue text-white font-medium rounded-lg transition duration-300 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

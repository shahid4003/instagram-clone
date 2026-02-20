import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { uploadMedia } from "../utils/uploadtos3";

const Avatar = ({ userInfo, editable = true }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setFileToUpload(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageSrc || !fileToUpload || !userInfo) return;
    try {
      setIsUploading(true);
      await uploadMedia(fileToUpload, null, userInfo, true);
      setShowPopup(false);
      setImageSrc(null);
      setFileToUpload(null);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };
  const avatarContent = (
    <span className="relative block rounded-full bg-white p-[3px]">
      {imageSrc || userInfo?.avatar ? (
        <img
          className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full"
          src={imageSrc || userInfo.avatar}
          alt="Profile"
        />
      ) : (
        <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-600">
          {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
      {editable && (
        <span className="absolute bottom-1 right-1 rounded-full bg-white p-1.5 shadow-md border border-gray-200">
          <Pencil className="w-4 h-4 text-gray-600" />
        </span>
      )}
    </span>
  );

  return (
    <div className="relative inline-block">
      {editable ? (
        <button
          type="button"
          onClick={() => setShowPopup(true)}
          className="group relative"
          aria-label="Change profile photo"
        >
          {avatarContent}
        </button>
      ) : (
        <div className="group relative" aria-label="Profile photo">
          {avatarContent}
        </div>
      )}

      {showPopup && editable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Change Profile Photo
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload a new photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />

              {imageSrc && (
                <div className="flex items-center gap-4">
                  <img
                    src={imageSrc}
                    alt="Uploaded preview"
                    className="w-20 h-20 rounded-full object-cover border border-gray-200"
                  />
                  <p className="text-sm text-gray-500">Preview</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageSrc || isUploading}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;

import React, { useState, useEffect } from "react";
import { User, Moon, Sun, Upload } from "lucide-react";
import { useModal } from "../hooks/useModal";
import NotificationModal from "./NotificationModal";
import { useTheme } from "./AppLayout";

const UserProfile: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const { modalState, hideModal, showSuccess, showError } = useModal();

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedPicture = localStorage.getItem("profilePicture");
    setName(savedName || "Guest User");
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  const handleSaveName = () => {
    if (!name.trim()) return;

    localStorage.setItem("userName", name);
    setIsEditingName(false);
    showSuccess("Name Updated", "Your name has been saved.");
    
    // Trigger a storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };

  const handleThemeToggle = () => {
    const newDarkMode = !isDarkMode;
    toggleTheme(newDarkMode);
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Invalid File", "Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("File Too Large", "Please select an image smaller than 5MB.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setProfilePicture(dataUrl);
        localStorage.setItem("profilePicture", dataUrl);
        showSuccess(
          "Profile Picture Updated",
          "Your profile picture has been successfully updated.",
        );
        
        // Trigger a storage event to update other components
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      showError(
        "Upload Failed",
        "Failed to upload profile picture. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Profile Settings
      </h2>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Profile Picture
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                <User size={48} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div>
              <label
                htmlFor="profile-picture-upload"
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
              >
                <Upload size={18} />
                <span>
                  {profilePicture ? "Change Picture" : "Upload Picture"}
                </span>
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Max size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Personal Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            {isEditingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setName(localStorage.getItem("userName") || "Guest User");
                  }}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-800 dark:text-white">{name}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Appearance
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-white">
              Dark Mode
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Toggle between light and dark theme
            </p>
          </div>
          <button
            onClick={handleThemeToggle}
            className={`relative inline-flex h-8 w-14 items-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform bg-white transition-transform ${
                isDarkMode ? "translate-x-7" : "translate-x-1"
              }`}
            >
              {isDarkMode ? (
                <Moon size={16} className="m-1 text-blue-600" />
              ) : (
                <Sun size={16} className="m-1 text-gray-600" />
              )}
            </span>
          </button>
        </div>
      </div>

      <NotificationModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type as "success" | "error" | "warning" | "info"}
      />
    </div>
  );
};

export default UserProfile;

import React, { useEffect, useState } from "react";
import {
  Dumbbell,
  Calendar,
  User,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

interface MobileNavigationProps {
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPath,
  isOpen,
  onToggle,
}) => {
  const [userName, setUserName] = useState("Guest User");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedPicture = localStorage.getItem("profilePicture");
    if (savedName) setUserName(savedName);
    if (savedPicture) setProfilePicture(savedPicture);
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/exercises", label: "Exercise Library", icon: Dumbbell },
    { path: "/workouts", label: "Workouts", icon: Calendar },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <img 
              src="/assets/generated/active-plus-logo-with-text-transparent.dim_200x200.png" 
              alt="Active+" 
              className="h-8 w-auto"
            />
          </div>

          <button
            onClick={onToggle}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-[70] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img 
                src="/assets/generated/active-plus-logo-with-text-transparent.dim_200x200.png" 
                alt="Active+" 
                className="h-8 w-auto"
              />
            </div>
            <button
              onClick={onToggle}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-700 p-3">
            <div className="flex items-center space-x-2">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="bg-blue-100 dark:bg-blue-900 p-1">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {userName}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={onToggle}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                  isActive(path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-xs">
          © 2026 - Vansh.
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="h-16 lg:hidden" />
    </>
  );
};

export default MobileNavigation;

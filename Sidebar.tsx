import React, { useEffect, useState } from "react";
import { Dumbbell, Calendar, User, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface SidebarProps {
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
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
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/assets/generated/active-plus-logo-with-text-transparent.dim_200x200.png" 
            alt="Active+" 
            className="h-12 w-auto"
          />
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
  );
};

export default Sidebar;

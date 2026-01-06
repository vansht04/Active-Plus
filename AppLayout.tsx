import React, { useState, useEffect, createContext, useContext } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { useRouter } from "@tanstack/react-router";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: (darkMode: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within AppLayout");
  }
  return context;
};

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Theme management - stored locally
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? saved === "true" : true;
  });

  // Apply theme to document root
  const applyTheme = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Set dark mode as default on initial load
  useEffect(() => {
    applyTheme(isDarkMode);
  }, []);

  // Apply theme whenever isDarkMode changes
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  const handleThemeToggle = (newDarkMode: boolean) => {
    setIsDarkMode(newDarkMode);
    applyTheme(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const currentPath = router.state.location.pathname;

  const themeContextValue: ThemeContextType = {
    isDarkMode,
    toggleTheme: handleThemeToggle,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar currentPath={currentPath} />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <MobileNavigation
            currentPath={currentPath}
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default AppLayout;

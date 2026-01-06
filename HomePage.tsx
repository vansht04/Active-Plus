import React from "react";
import { Link } from "@tanstack/react-router";
import { Dumbbell, Calendar, User, Plus, Edit, TrendingUp, Image } from "lucide-react";

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Dumbbell,
      title: "Exercise Library",
      description: "Create and manage your custom exercise library with detailed descriptions and exercise types.",
      link: "/exercises",
      linkText: "Go to Exercises",
    },
    {
      icon: Calendar,
      title: "Workout Management",
      description: "Create workouts by selecting exercises, set target reps and sets, and track your progress over time.",
      link: "/workouts",
      linkText: "View Workouts",
    },
    {
      icon: User,
      title: "Profile & Settings",
      description: "Customize your profile with a picture, manage your name, and toggle between light and dark themes.",
      link: "/profile",
      linkText: "Edit Profile",
    },
  ];

  const steps = [
    {
      number: 1,
      icon: Plus,
      title: "Add Exercises",
      description: "Start by adding exercises to your library. Choose from strength, cardio, and other types.",
    },
    {
      number: 2,
      icon: Calendar,
      title: "Create Workouts",
      description: "Build workouts by selecting exercises and setting target reps, sets, and duration.",
    },
    {
      number: 3,
      icon: Edit,
      title: "Track Progress",
      description: "During workouts, mark exercises as complete and track actual sets completed.",
    },
    {
      number: 4,
      icon: TrendingUp,
      title: "Review & Repeat",
      description: "Review your workout history and copy previous workouts to repeat them.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img 
            src="/assets/generated/active-plus-logo-with-text-transparent.dim_200x200.png" 
            alt="Active+ Logo" 
            className="w-48 h-48"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to Active+
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal fitness companion for tracking workouts, managing exercises, and achieving your fitness goals.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mb-4">
              <feature.icon size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {feature.description}
            </p>
            <Link
              to={feature.link}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {feature.linkText}
              <span className="ml-2">→</span>
            </Link>
          </div>
        ))}
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center"
            >
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                {step.number}
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <step.icon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Additional Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 flex-shrink-0">
              <Edit size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                Edit Workouts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Add new exercises to existing workouts or modify workout details anytime.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 flex-shrink-0">
              <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                Copy Workouts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Quickly duplicate previous workouts to repeat your favorite routines.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 flex-shrink-0">
              <TrendingUp size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Monitor your actual sets completed vs. target sets for each exercise.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-pink-100 dark:bg-pink-900 p-2 flex-shrink-0">
              <Image size={20} className="text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                Profile Picture
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Upload and manage your profile picture to personalize your experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Begin your fitness journey by creating your first exercise or workout today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/exercises"
            className="bg-white text-blue-600 px-6 py-3 hover:bg-blue-50 transition-colors font-medium inline-block"
          >
            Add Your First Exercise
          </Link>
          <Link
            to="/workouts"
            className="bg-blue-700 text-white px-6 py-3 hover:bg-blue-800 transition-colors font-medium inline-block"
          >
            Create a Workout
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2026 - Vansh. All rights reserved.</p>
      </div>
    </div>
  );
};

export default HomePage;

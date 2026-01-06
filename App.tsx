import React from "react";
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import ExerciseLibrary from "./components/ExerciseLibrary";
import Workouts from "./components/Workouts";
import UserProfile from "./components/UserProfile";
import WorkoutEditor from "./components/WorkoutEditor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

// Create root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

// Create routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const exercisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exercises",
  component: ExerciseLibrary,
});

const workoutsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workouts",
  component: Workouts,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: UserProfile,
});

const editWorkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workouts/$workoutId/edit",
  component: WorkoutEditor,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  exercisesRoute,
  workoutsRoute,
  profileRoute,
  editWorkoutRoute,
]);

// Create router
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

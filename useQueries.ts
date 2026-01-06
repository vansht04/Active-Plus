import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type {
  Exercise,
  Workout,
  UserProfile,
  ExercisePerformance,
  WorkoutStatus,
} from "../backend";
import { ExternalBlob, ExerciseType } from "../backend";

// User profile queries
export function useUserProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.saveUserProfile(name, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useUpdateProfilePicture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (picture: ExternalBlob) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.updateProfilePicture(picture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Dark mode toggle
export function useToggleDarkMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.toggleDarkMode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Exercise queries
export function useExercises() {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercises();
    },
    enabled: !!actor && !isFetching,
  });
}

// Map frontend exercise type strings to backend enum
const mapExerciseType = (type: string): ExerciseType => {
  const lowerType = type.toLowerCase();
  if (lowerType === "strength") return ExerciseType.strength;
  if (lowerType === "cardio") return ExerciseType.cardio;
  // Default to strength for any other type
  return ExerciseType.strength;
};

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      exerciseType,
      description,
    }: {
      name: string;
      exerciseType: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const mappedType = mapExerciseType(exerciseType);
      return actor.addExercise(name, mappedType, description || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

export function useRemoveExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeExercise(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

// Workout queries
export function useWorkoutHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkoutHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// Local storage for performance data since backend doesn't provide retrieval
interface PerformanceData {
  reps?: number;
  targetSets?: number;
  actualSets?: number;
  duration?: number;
  exerciseType: string;
}

interface WorkoutPerformanceLocal {
  [workoutId: string]: {
    [exerciseId: string]: PerformanceData;
  };
}

// Helper to get performance data from local storage
const getLocalPerformanceData = (): WorkoutPerformanceLocal => {
  try {
    const data = localStorage.getItem("workoutPerformance");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Helper to save performance data to local storage
const saveLocalPerformanceData = (data: WorkoutPerformanceLocal) => {
  try {
    localStorage.setItem("workoutPerformance", JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save performance data to local storage:", error);
  }
};

export function useCreateWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exerciseIds,
      performanceData,
    }: {
      exerciseIds: bigint[];
      performanceData: Record<string, PerformanceData>;
    }) => {
      if (!actor) throw new Error("Actor not available");

      // Prepare exercise performances array
      const exercisePerformances: ExercisePerformance[] = exerciseIds.map((exerciseId) => {
        const performance = performanceData[exerciseId.toString()];
        return {
          exerciseId,
          reps: BigInt(performance.reps || 0),
          targetSets: BigInt(performance.targetSets || 0),
          actualSets: BigInt(performance.actualSets || 0),
          duration: BigInt(performance.duration || 0),
          completionStatus: "inProgress" as WorkoutStatus,
        };
      });

      // Create the workout with all exercise performances
      const workoutId = await actor.createWorkout(exercisePerformances);

      // Store performance data locally for retrieval
      const localData = getLocalPerformanceData();
      localData[workoutId.toString()] = performanceData;
      saveLocalPerformanceData(localData);

      return workoutId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["exerciseCompletion"] });
      queryClient.invalidateQueries({ queryKey: ["actualSets"] });
    },
  });
}

export function useDeleteWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      
      // Remove from local storage
      const localData = getLocalPerformanceData();
      delete localData[id.toString()];
      saveLocalPerformanceData(localData);
      
      return actor.deleteWorkout(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["exerciseCompletion"] });
      queryClient.invalidateQueries({ queryKey: ["actualSets"] });
    },
  });
}

export function useCopyWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (originalWorkoutId: bigint) => {
      if (!actor) throw new Error("Actor not available");

      // Use the backend copyWorkout function which copies performance data
      const newWorkoutId = await actor.copyWorkout(originalWorkoutId);

      // Copy performance data in local storage
      const localData = getLocalPerformanceData();
      const originalPerformance = localData[originalWorkoutId.toString()];
      if (originalPerformance) {
        // Copy performance data but reset actual sets
        const copiedPerformance: Record<string, PerformanceData> = {};
        for (const [exerciseId, data] of Object.entries(originalPerformance)) {
          copiedPerformance[exerciseId] = {
            ...data,
            actualSets: 0,
          };
        }
        localData[newWorkoutId.toString()] = copiedPerformance;
        saveLocalPerformanceData(localData);
      }

      return newWorkoutId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["exerciseCompletion"] });
      queryClient.invalidateQueries({ queryKey: ["actualSets"] });
    },
  });
}

// Get performance data from local storage
export function useWorkoutPerformanceLocal(workoutId: bigint | null) {
  return useQuery<Record<string, PerformanceData> | null>({
    queryKey: ["workoutPerformanceLocal", workoutId?.toString()],
    queryFn: () => {
      if (!workoutId) return null;
      const localData = getLocalPerformanceData();
      return localData[workoutId.toString()] || null;
    },
    enabled: !!workoutId,
  });
}

// Add exercise performance to workout
export function useAddExercisePerformance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workoutId,
      exercisePerformance,
    }: {
      workoutId: bigint;
      exercisePerformance: ExercisePerformance;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.addExercisePerformance(workoutId, exercisePerformance);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["actualSets"] });
    },
  });
}

// Backend-based actual sets storage
export function useUpdateActualSets() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workoutId,
      exerciseId,
      actualSets,
    }: {
      workoutId: bigint;
      exerciseId: bigint;
      actualSets: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateActualSets(workoutId, exerciseId, BigInt(actualSets));
      
      // Also update local storage
      const localData = getLocalPerformanceData();
      if (localData[workoutId.toString()]?.[exerciseId.toString()]) {
        localData[workoutId.toString()][exerciseId.toString()].actualSets = actualSets;
        saveLocalPerformanceData(localData);
      }
      
      return { workoutId, exerciseId, actualSets };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "actualSets",
          variables.workoutId.toString(),
          variables.exerciseId.toString(),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["workoutPerformanceLocal", variables.workoutId.toString()],
      });
    },
  });
}

// Get actual sets completed for a specific exercise from backend
export function useActualSets(workoutId: bigint, exerciseId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ["actualSets", workoutId.toString(), exerciseId.toString()],
    queryFn: async () => {
      if (!actor) return 0;
      const result = await actor.getActualSets(workoutId, exerciseId);
      return Number(result);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

// Add exercise to existing workout - creates a new workout with combined exercises
export function useAddExerciseToWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workoutId,
      exerciseIds,
      performanceData,
    }: {
      workoutId: bigint;
      exerciseIds: bigint[];
      performanceData: Record<string, PerformanceData>;
    }) => {
      if (!actor) throw new Error("Actor not available");

      // Get the current workout to retrieve existing exercises
      const workouts = await actor.getWorkoutHistory();
      const currentWorkout = workouts.find((w) => w.id === workoutId);

      if (!currentWorkout) {
        throw new Error("Workout not found");
      }

      // Get existing performance data from local storage
      const localData = getLocalPerformanceData();
      const existingPerformance = localData[workoutId.toString()] || {};

      // Combine existing and new exercise performances
      const combinedPerformances: ExercisePerformance[] = [
        ...currentWorkout.exercisePerformances,
        ...exerciseIds.map((exerciseId) => {
          const performance = performanceData[exerciseId.toString()];
          return {
            exerciseId,
            reps: BigInt(performance.reps || 0),
            targetSets: BigInt(performance.targetSets || 0),
            actualSets: BigInt(performance.actualSets || 0),
            duration: BigInt(performance.duration || 0),
            completionStatus: "inProgress" as WorkoutStatus,
          };
        }),
      ];

      // Create a new workout with all exercises
      const newWorkoutId = await actor.createWorkout(combinedPerformances);

      // Update local storage with combined performance data
      const combinedPerformance = {
        ...existingPerformance,
        ...performanceData,
      };
      localData[newWorkoutId.toString()] = combinedPerformance;
      delete localData[workoutId.toString()];
      saveLocalPerformanceData(localData);

      // Delete the original workout
      await actor.deleteWorkout(workoutId);

      return {
        success: true,
        workoutId: newWorkoutId,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workoutPerformanceLocal"] });
      queryClient.invalidateQueries({ queryKey: ["exerciseCompletion"] });
      queryClient.invalidateQueries({ queryKey: ["actualSets"] });
    },
  });
}

// Exercise completion queries using backend
export function useMarkExerciseComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workoutId,
      exerciseId,
    }: {
      workoutId: bigint;
      exerciseId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.markExerciseComplete(workoutId, exerciseId);
      return { workoutId, exerciseId, completed: true };
    },
    onSuccess: (_, variables) => {
      // Invalidate all exercise completion queries for this workout
      queryClient.invalidateQueries({
        queryKey: ["exerciseCompletion", variables.workoutId.toString()],
      });
      // Invalidate the specific exercise completion query
      queryClient.invalidateQueries({
        queryKey: [
          "exerciseCompletion",
          variables.workoutId.toString(),
          variables.exerciseId.toString(),
        ],
      });
      // Invalidate all exercises completed query for this workout
      queryClient.invalidateQueries({
        queryKey: ["allExercisesCompleted", variables.workoutId.toString()],
      });
      // Invalidate workouts to refresh overall workout completion status
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useMarkExerciseIncomplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workoutId,
      exerciseId,
    }: {
      workoutId: bigint;
      exerciseId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.markExerciseIncomplete(workoutId, exerciseId);
      return { workoutId, exerciseId, completed: false };
    },
    onSuccess: (_, variables) => {
      // Invalidate all exercise completion queries for this workout
      queryClient.invalidateQueries({
        queryKey: ["exerciseCompletion", variables.workoutId.toString()],
      });
      // Invalidate the specific exercise completion query
      queryClient.invalidateQueries({
        queryKey: [
          "exerciseCompletion",
          variables.workoutId.toString(),
          variables.exerciseId.toString(),
        ],
      });
      // Invalidate all exercises completed query for this workout
      queryClient.invalidateQueries({
        queryKey: ["allExercisesCompleted", variables.workoutId.toString()],
      });
      // Invalidate workouts to refresh overall workout completion status
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

// Helper function to check if an exercise is completed using backend
export function useIsExerciseCompleted(workoutId: bigint, exerciseId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: [
      "exerciseCompletion",
      workoutId.toString(),
      exerciseId.toString(),
    ],
    queryFn: async () => {
      if (!actor) return false;
      return await actor.isExerciseCompleted(workoutId, exerciseId);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// Helper function to check if all exercises in a workout are completed using backend
export function useAreAllExercisesCompleted(workoutId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["allExercisesCompleted", workoutId.toString()],
    queryFn: async () => {
      if (!actor) return false;
      return await actor.areAllExercisesCompleted(workoutId);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

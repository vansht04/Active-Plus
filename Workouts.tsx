import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Copy, Trash2, Edit, Calendar } from "lucide-react";
import {
  useWorkoutHistory,
  useDeleteWorkout,
  useCopyWorkout,
  useExercises,
  useWorkoutPerformanceLocal,
} from "../hooks/useQueries";
import { useModal, useConfirmationModal } from "../hooks/useModal";
import NotificationModal from "./NotificationModal";
import ConfirmationModal from "./ConfirmationModal";
import WorkoutCreator from "./WorkoutCreator";
import { ExerciseType } from "../backend";

const Workouts: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const { data: workouts = [], isLoading: workoutsLoading } = useWorkoutHistory();
  const { data: exercises = [] } = useExercises();
  const deleteWorkoutMutation = useDeleteWorkout();
  const copyWorkoutMutation = useCopyWorkout();

  const { modalState, hideModal, showSuccess, showError } = useModal();
  const {
    isOpen: confirmationOpen,
    confirmationData,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
  } = useConfirmationModal();

  const handleDelete = async (workoutId: bigint) => {
    showConfirmation(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      async () => {
        try {
          await deleteWorkoutMutation.mutateAsync(workoutId);
          showSuccess(
            "Workout Deleted",
            "The workout has been successfully deleted.",
          );
        } catch (error) {
          console.error("Failed to delete workout:", error);
          showError("Error", "Failed to delete workout. Please try again.");
        }
      },
      { type: "danger", confirmText: "Delete", cancelText: "Cancel" },
    );
  };

  const handleCopy = async (workoutId: bigint) => {
    try {
      await copyWorkoutMutation.mutateAsync(workoutId);
      showSuccess(
        "Workout Copied",
        "The workout has been successfully copied. You can now start the new workout.",
      );
    } catch (error) {
      console.error("Failed to copy workout:", error);
      showError("Error", "Failed to copy workout. Please try again.");
    }
  };

  const handleEdit = (workoutId: bigint) => {
    navigate({ to: "/workouts/$workoutId/edit", params: { workoutId: workoutId.toString() } });
  };

  const handleWorkoutCreated = () => {
    setShowCreateForm(false);
    showSuccess(
      "Workout Created",
      "Your workout has been successfully created!",
    );
  };

  const getExerciseName = (exerciseId: bigint) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.name || "Unknown Exercise";
  };

  const getExerciseType = (exerciseId: bigint): ExerciseType => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.exerciseType || ExerciseType.strength;
  };

  const WorkoutCard = ({ workout }: { workout: any }) => {
    const { data: performanceData } = useWorkoutPerformanceLocal(workout.id);

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(Number(workout.timestamp) / 1000000).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Workout #{workout.id.toString()}
            </h3>
            {workout.completed && (
              <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1">
                Completed
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleEdit(workout.id)}
              className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleCopy(workout.id)}
              disabled={copyWorkoutMutation.isPending}
              className="bg-green-600 text-white px-3 py-2 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm"
            >
              {copyWorkoutMutation.isPending ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <Copy size={14} />
              )}
              <span>Copy</span>
            </button>
            <button
              onClick={() => handleDelete(workout.id)}
              disabled={deleteWorkoutMutation.isPending}
              className="bg-red-600 text-white px-3 py-2 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm"
            >
              {deleteWorkoutMutation.isPending ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <Trash2 size={14} />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {workout.exercisePerformances.map((performance: any) => {
            const exerciseType = getExerciseType(performance.exerciseId);
            const localPerf = performanceData?.[performance.exerciseId.toString()];

            return (
              <div
                key={performance.exerciseId.toString()}
                className="bg-gray-50 dark:bg-gray-700 p-3 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {getExerciseName(performance.exerciseId)}
                  </h4>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1">
                    {exerciseType}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                  {exerciseType === ExerciseType.strength ? (
                    <>
                      <div>
                        <span className="font-medium">Reps:</span> {localPerf?.reps || Number(performance.reps)}
                      </div>
                      <div>
                        <span className="font-medium">Sets:</span>{" "}
                        {Number(performance.actualSets)}/{localPerf?.targetSets || Number(performance.targetSets)}
                      </div>
                    </>
                  ) : (
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {localPerf?.duration || Number(performance.duration)} min
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (workoutsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Workouts
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          data-create-workout
          className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>Create Workout</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <WorkoutCreator onWorkoutCreated={handleWorkoutCreated} />
        </div>
      )}

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No workouts yet. Create your first workout to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts
            .slice()
            .sort((a, b) => Number(b.timestamp - a.timestamp))
            .map((workout) => (
              <WorkoutCard key={workout.id.toString()} workout={workout} />
            ))}
        </div>
      )}

      <NotificationModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type as "success" | "error" | "warning" | "info"}
      />

      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmationData.title}
        message={confirmationData.message}
        type={confirmationData.type}
        confirmText={confirmationData.confirmText}
        cancelText={confirmationData.cancelText}
        isLoading={deleteWorkoutMutation.isPending}
      />
    </div>
  );
};

export default Workouts;

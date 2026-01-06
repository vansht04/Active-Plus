import React, { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Check, X } from "lucide-react";
import {
  useWorkoutHistory,
  useExercises,
  useAddExerciseToWorkout,
  useMarkExerciseComplete,
  useMarkExerciseIncomplete,
  useIsExerciseCompleted,
  useUpdateActualSets,
  useActualSets,
  useWorkoutPerformanceLocal,
} from "../hooks/useQueries";
import { useModal } from "../hooks/useModal";
import NotificationModal from "./NotificationModal";
import { ExerciseType } from "../backend";

const WorkoutEditor: React.FC = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams({ from: "/workouts/$workoutId/edit" });
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<bigint[]>([]);
  const [performanceData, setPerformanceData] = useState<
    Record<string, { reps?: number; targetSets?: number; duration?: number; exerciseType: string }>
  >({});

  const { data: workouts = [] } = useWorkoutHistory();
  const { data: exercises = [] } = useExercises();
  const addExerciseMutation = useAddExerciseToWorkout();
  const markCompleteMutation = useMarkExerciseComplete();
  const markIncompleteMutation = useMarkExerciseIncomplete();
  const updateActualSetsMutation = useUpdateActualSets();

  const { modalState, hideModal, showSuccess, showError } = useModal();

  const workout = workouts.find((w) => w.id.toString() === workoutId);
  const { data: performanceDataLocal } = useWorkoutPerformanceLocal(workout?.id || null);

  const handleFinish = () => {
    navigate({ to: "/workouts" });
  };

  const handleAddExercises = async () => {
    if (selectedExercises.length === 0 || !workout) return;

    try {
      await addExerciseMutation.mutateAsync({
        workoutId: workout.id,
        exerciseIds: selectedExercises,
        performanceData,
      });
      setSelectedExercises([]);
      setPerformanceData({});
      setShowAddExercise(false);
      showSuccess(
        "Exercises Added",
        "The exercises have been successfully added to your workout.",
      );
    } catch (error) {
      console.error("Failed to add exercises:", error);
      showError("Error", "Failed to add exercises. Please try again.");
    }
  };

  const toggleExerciseSelection = (exerciseId: bigint, exerciseType: ExerciseType) => {
    const idStr = exerciseId.toString();
    if (selectedExercises.some((id) => id === exerciseId)) {
      setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
      const newData = { ...performanceData };
      delete newData[idStr];
      setPerformanceData(newData);
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
      setPerformanceData({
        ...performanceData,
        [idStr]: {
          reps: exerciseType === ExerciseType.strength ? 10 : undefined,
          targetSets: exerciseType === ExerciseType.strength ? 3 : undefined,
          duration: exerciseType === ExerciseType.cardio ? 30 : undefined,
          exerciseType,
        },
      });
    }
  };

  const updatePerformanceData = (
    exerciseId: string,
    field: string,
    value: number,
  ) => {
    setPerformanceData({
      ...performanceData,
      [exerciseId]: {
        ...performanceData[exerciseId],
        [field]: value,
      },
    });
  };

  const handleToggleComplete = async (exerciseId: bigint, isCompleted: boolean) => {
    if (!workout) return;

    try {
      if (isCompleted) {
        await markIncompleteMutation.mutateAsync({
          workoutId: workout.id,
          exerciseId,
        });
      } else {
        await markCompleteMutation.mutateAsync({
          workoutId: workout.id,
          exerciseId,
        });
      }
    } catch (error) {
      console.error("Failed to toggle exercise completion:", error);
      showError("Error", "Failed to update exercise status. Please try again.");
    }
  };

  const handleActualSetsChange = async (
    exerciseId: bigint,
    actualSets: number,
  ) => {
    if (!workout) return;

    try {
      await updateActualSetsMutation.mutateAsync({
        workoutId: workout.id,
        exerciseId,
        actualSets,
      });
    } catch (error) {
      console.error("Failed to update actual sets:", error);
    }
  };

  const ExerciseCompletionToggle = ({
    workoutId,
    exerciseId,
  }: {
    workoutId: bigint;
    exerciseId: bigint;
  }) => {
    const { data: isCompleted = false } = useIsExerciseCompleted(
      workoutId,
      exerciseId,
    );

    return (
      <button
        onClick={() => handleToggleComplete(exerciseId, isCompleted)}
        disabled={
          markCompleteMutation.isPending || markIncompleteMutation.isPending
        }
        className={`px-3 py-2 transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm ${
          isCompleted
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500"
        }`}
      >
        {isCompleted ? <Check size={14} /> : <X size={14} />}
        <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
      </button>
    );
  };

  const ActualSetsInput = ({
    workoutId,
    exerciseId,
    targetSets,
  }: {
    workoutId: bigint;
    exerciseId: bigint;
    targetSets: number;
  }) => {
    const { data: actualSets = 0 } = useActualSets(workoutId, exerciseId);
    const [localValue, setLocalValue] = useState(actualSets);

    React.useEffect(() => {
      setLocalValue(actualSets);
    }, [actualSets]);

    const handleChange = (value: number) => {
      setLocalValue(value);
      handleActualSetsChange(exerciseId, value);
    };

    return (
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Actual Sets:
        </label>
        <input
          type="number"
          min="0"
          max={targetSets}
          value={localValue}
          onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          / {targetSets}
        </span>
      </div>
    );
  };

  if (!workout) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Workout not found.</p>
          <button
            onClick={handleFinish}
            className="mt-4 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  const getExerciseName = (exerciseId: bigint) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.name || "Unknown Exercise";
  };

  const getExerciseType = (exerciseId: bigint): ExerciseType => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise?.exerciseType || ExerciseType.strength;
  };

  const availableExercises = exercises.filter(
    (exercise) =>
      !workout.exercisePerformances.some(
        (perf) => perf.exerciseId === exercise.id,
      ),
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={handleFinish}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Workouts</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Workout #{workout.id.toString()}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {new Date(Number(workout.timestamp) / 1000000).toLocaleDateString()}
        </p>
      </div>

      {/* Current Exercises */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Exercises in Workout
        </h3>
        <div className="space-y-4">
          {workout.exercisePerformances.map((performance) => {
            const exerciseType = getExerciseType(performance.exerciseId);
            const localPerf = performanceDataLocal?.[performance.exerciseId.toString()];

            return (
              <div
                key={performance.exerciseId.toString()}
                className="bg-gray-50 dark:bg-gray-700 p-4 border-l-4 border-blue-500"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                      {getExerciseName(performance.exerciseId)}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                      {exerciseType === ExerciseType.strength ? (
                        <>
                          <div>
                            <span className="font-medium">Reps:</span>{" "}
                            {localPerf?.reps || Number(performance.reps)}
                          </div>
                          <div>
                            <span className="font-medium">Target Sets:</span>{" "}
                            {localPerf?.targetSets || Number(performance.targetSets)}
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
                  <div className="flex flex-col gap-2">
                    <ExerciseCompletionToggle
                      workoutId={workout.id}
                      exerciseId={performance.exerciseId}
                    />
                    {exerciseType === ExerciseType.strength && (
                      <ActualSetsInput
                        workoutId={workout.id}
                        exerciseId={performance.exerciseId}
                        targetSets={localPerf?.targetSets || Number(performance.targetSets)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Exercise Section */}
      {!showAddExercise ? (
        <button
          onClick={() => setShowAddExercise(true)}
          className="w-full bg-blue-600 text-white px-4 py-3 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={18} />
          <span>Add More Exercises</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Add Exercises
            </h3>
            <button
              onClick={() => {
                setShowAddExercise(false);
                setSelectedExercises([]);
                setPerformanceData({});
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {availableExercises.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              All exercises have been added to this workout.
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {availableExercises.map((exercise) => {
                  const isSelected = selectedExercises.some(
                    (id) => id === exercise.id,
                  );
                  const idStr = exercise.id.toString();

                  return (
                    <div
                      key={exercise.id.toString()}
                      className="bg-gray-50 dark:bg-gray-700 p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleExerciseSelection(exercise.id, exercise.exerciseType)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800 dark:text-white">
                              {exercise.name}
                            </h4>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1">
                              {exercise.exerciseType}
                            </span>
                          </div>

                          {isSelected && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                              {exercise.exerciseType === ExerciseType.strength ? (
                                <>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Reps
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={performanceData[idStr]?.reps || 10}
                                      onChange={(e) =>
                                        updatePerformanceData(
                                          idStr,
                                          "reps",
                                          parseInt(e.target.value) || 1,
                                        )
                                      }
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Target Sets
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={performanceData[idStr]?.targetSets || 3}
                                      onChange={(e) =>
                                        updatePerformanceData(
                                          idStr,
                                          "targetSets",
                                          parseInt(e.target.value) || 1,
                                        )
                                      }
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                  </div>
                                </>
                              ) : (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Duration (min)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={performanceData[idStr]?.duration || 30}
                                    onChange={(e) =>
                                      updatePerformanceData(
                                        idStr,
                                        "duration",
                                        parseInt(e.target.value) || 1,
                                      )
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddExercises}
                  disabled={
                    selectedExercises.length === 0 ||
                    addExerciseMutation.isPending
                  }
                  className="flex-1 bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {addExerciseMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>Add Selected Exercises</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddExercise(false);
                    setSelectedExercises([]);
                    setPerformanceData({});
                  }}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

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

export default WorkoutEditor;

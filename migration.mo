import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type ExerciseType = {
    #strength;
    #cardio;
  };

  type OldExercise = {
    id : Nat;
    name : Text;
    exerciseType : ExerciseType;
    description : ?Text;
    owner : Principal;
  };

  type WorkoutStatus = {
    #inProgress;
    #finished;
    #finishedIncomplete;
  };

  type ExercisePerformance = {
    exerciseId : Nat;
    reps : Nat;
    targetSets : Nat;
    actualSets : Nat;
    duration : Nat;
    completionStatus : WorkoutStatus;
  };

  type OldWorkout = {
    id : Nat;
    exercisePerformances : [ExercisePerformance];
    timestamp : Time.Time;
    completed : Bool;
    owner : Principal;
  };

  type OldUserProfile = {
    name : Text;
    darkMode : Bool;
    profilePicture : ?Storage.ExternalBlob;
  };

  type NewUserProfile = {
    name : Text;
    darkMode : Bool;
    profilePicture : ?Storage.ExternalBlob;
  };

  type AdminOldActor = {
    nextExerciseId : Nat;
    nextWorkoutId : Nat;
    exercises : Map.Map<Nat, OldExercise>;
    workouts : Map.Map<Nat, OldWorkout>;
    userRoles : Map.Map<Principal, UserRole>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    adminAssigned : Bool;
  };

  type NewExercise = {
    id : Nat;
    name : Text;
    exerciseType : ExerciseType;
    description : ?Text;
  };

  type NewWorkout = {
    id : Nat;
    exercisePerformances : [ExercisePerformance];
    timestamp : Time.Time;
    completed : Bool;
  };

  type GuestNewActor = {
    nextExerciseId : Nat;
    nextWorkoutId : Nat;
    exercises : Map.Map<Nat, NewExercise>;
    workouts : Map.Map<Nat, NewWorkout>;
    userProfile : ?NewUserProfile;
  };

  public func run(adminOldActor : AdminOldActor) : GuestNewActor {
    {
      nextExerciseId = adminOldActor.nextExerciseId;
      nextWorkoutId = adminOldActor.nextWorkoutId;
      exercises = adminOldActor.exercises.map<Nat, OldExercise, NewExercise>(
        func(_id, oldExercise) {
          {
            id = oldExercise.id;
            name = oldExercise.name;
            exerciseType = oldExercise.exerciseType;
            description = oldExercise.description;
          };
        }
      );
      workouts = adminOldActor.workouts.map<Nat, OldWorkout, NewWorkout>(
        func(_id, oldWorkout) {
          {
            id = oldWorkout.id;
            exercisePerformances = oldWorkout.exercisePerformances;
            timestamp = oldWorkout.timestamp;
            completed = oldWorkout.completed;
          };
        }
      );
      userProfile = null;
    };
  };
};

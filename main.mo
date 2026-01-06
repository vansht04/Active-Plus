import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ExerciseType = {
    #strength;
    #cardio;
  };

  type Exercise = {
    id : Nat;
    name : Text;
    exerciseType : ExerciseType;
    description : ?Text;
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

  type Workout = {
    id : Nat;
    exercisePerformances : [ExercisePerformance];
    timestamp : Time.Time;
    completed : Bool;
  };

  type UserProfile = {
    name : Text;
    darkMode : Bool;
    profilePicture : ?Storage.ExternalBlob;
  };

  var nextExerciseId : Nat = 0;
  var nextWorkoutId : Nat = 0;
  var exercises = Map.empty<Nat, Exercise>();
  var workouts = Map.empty<Nat, Workout>();
  var userProfile : ?UserProfile = null;

  func initializeDefaultExercises() {
    let defaultExercises : [(Text, ExerciseType, ?Text)] = [
      ("Push-ups", #strength, ?"Push-up exercise"),
      ("Squats", #strength, ?"Squat exercise"),
      ("Plank", #strength, ?"Plank exercise"),
      ("Jumping Jacks", #cardio, ?"Jumping Jack exercise"),
      ("Lunges", #strength, ?"Lunge exercise"),
    ];

    for ((name, exerciseType, description) in defaultExercises.values()) {
      let id = nextExerciseId;
      exercises.add(id, {
        id;
        name;
        exerciseType;
        description;
      });
      nextExerciseId += 1;
    };
  };

  public func addExercise(name : Text, exerciseType : ExerciseType, description : ?Text) : async Nat {
    let id = nextExerciseId;
    let exercise : Exercise = {
      id;
      name;
      exerciseType;
      description;
    };
    exercises.add(id, exercise);
    nextExerciseId += 1;
    id;
  };

  public func removeExercise(id : Nat) : async Bool {
    switch (exercises.get(id)) {
      case (?_) {
        exercises.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  public query func getAllExercises() : async [Exercise] {
    exercises.values().toArray();
  };

  public shared ({ caller }) func createWorkout(exercisePerformances : [ExercisePerformance]) : async Nat {
    let id = nextWorkoutId;
    let workout : Workout = {
      id;
      exercisePerformances;
      timestamp = Time.now();
      completed = false;
    };
    workouts.add(id, workout);
    nextWorkoutId += 1;
    id;
  };

  public shared ({ caller }) func completeWorkout(id : Nat) : async Bool {
    switch (workouts.get(id)) {
      case null { false };
      case (?workout) {
        let updatedWorkout : Workout = {
          id = workout.id;
          exercisePerformances = workout.exercisePerformances;
          timestamp = workout.timestamp;
          completed = true;
        };
        workouts.add(id, updatedWorkout);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteWorkout(id : Nat) : async Bool {
    switch (workouts.get(id)) {
      case (?_) {
        workouts.remove(id);
        true;
      };
      case null { false };
    };
  };

  public query func getWorkoutHistory() : async [Workout] {
    workouts.values().toArray();
  };

  public shared ({ caller }) func saveUserProfile(name : Text, profilePicture : ?Storage.ExternalBlob) : async () {
    userProfile := ?{ name; darkMode = true; profilePicture };
  };

  public shared ({ caller }) func addExercisePerformance(workoutId : Nat, exercisePerformance : ExercisePerformance) : async () {
    switch (workouts.get(workoutId)) {
      case (?workout) {
        let updatedPerformances = workout.exercisePerformances.concat([exercisePerformance]);
        let updatedWorkout = {
          id = workout.id;
          exercisePerformances = updatedPerformances;
          timestamp = workout.timestamp;
          completed = workout.completed;
        };
        workouts.add(workoutId, updatedWorkout);
      };
      case null {};
    };
  };

  public shared ({ caller }) func markExerciseComplete(workoutId : Nat, exerciseId : Nat) : async () {
    switch (workouts.get(workoutId)) {
      case (?workout) {
        let updatedPerformances = workout.exercisePerformances.map(
          func(performance) {
            if (performance.exerciseId == exerciseId) {
              {
                performance with
                completionStatus = #finished;
              };
            } else {
              performance;
            };
          }
        );
        let allCompleted = updatedPerformances.foldLeft(
          true,
          func(acc, performance) {
            acc and (performance.completionStatus == #finished);
          },
        );
        let updatedWorkout = {
          id = workout.id;
          exercisePerformances = updatedPerformances;
          timestamp = workout.timestamp;
          completed = allCompleted;
        };
        workouts.add(workoutId, updatedWorkout);
      };
      case null {};
    };
  };

  public shared ({ caller }) func markExerciseIncomplete(workoutId : Nat, exerciseId : Nat) : async () {
    switch (workouts.get(workoutId)) {
      case (?workout) {
        let updatedPerformances = workout.exercisePerformances.map(
          func(performance) {
            if (performance.exerciseId == exerciseId) {
              {
                performance with
                completionStatus = #inProgress;
              };
            } else {
              performance;
            };
          }
        );
        let updatedWorkout = {
          id = workout.id;
          exercisePerformances = updatedPerformances;
          timestamp = workout.timestamp;
          completed = false;
        };
        workouts.add(workoutId, updatedWorkout);
      };
      case null {};
    };
  };

  public query func isExerciseCompleted(workoutId : Nat, exerciseId : Nat) : async Bool {
    switch (workouts.get(workoutId)) {
      case (?workout) {
        let performance = workout.exercisePerformances.find(func(p) { p.exerciseId == exerciseId });
        switch (performance) {
          case (?perf) {
            perf.completionStatus == #finished;
          };
          case (null) { false };
        };
      };
      case null { false };
    };
  };

  public query func areAllExercisesCompleted(workoutId : Nat) : async Bool {
    switch (workouts.get(workoutId)) {
      case (?workout) {
        workout.exercisePerformances.foldLeft(
          true,
          func(acc, perf) {
            acc and (perf.completionStatus == #finished);
          },
        );
      };
      case null { false };
    };
  };

  public shared ({ caller }) func copyWorkout(originalWorkoutId : Nat) : async Nat {
    switch (workouts.get(originalWorkoutId)) {
      case null {
        0;
      };
      case (?originalWorkout) {
        let newWorkoutId = nextWorkoutId;
        let newWorkout : Workout = {
          id = newWorkoutId;
          exercisePerformances = originalWorkout.exercisePerformances.map(
            func(perf) {
              {
                perf with
                completionStatus = #inProgress;
              };
            }
          );
          timestamp = Time.now();
          completed = false;
        };

        workouts.add(newWorkoutId, newWorkout);
        nextWorkoutId += 1;
        newWorkoutId;
      };
    };
  };

  public shared ({ caller }) func toggleDarkMode() : async () {
    switch (userProfile) {
      case (null) {};
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          darkMode = not profile.darkMode;
          profilePicture = profile.profilePicture;
        };
        userProfile := ?updatedProfile;
      };
    };
  };

  public shared ({ caller }) func updateActualSets(workoutId : Nat, exerciseId : Nat, actualSets : Nat) : async () {
    switch (workouts.get(workoutId)) {
      case (?workout) {
        let updatedPerformances = workout.exercisePerformances.map(
          func(perf) {
            if (perf.exerciseId == exerciseId) {
              {
                perf with
                actualSets;
              };
            } else {
              perf;
            };
          }
        );
        let updatedWorkout = {
          id = workout.id;
          exercisePerformances = updatedPerformances;
          timestamp = workout.timestamp;
          completed = workout.completed;
        };
        workouts.add(workoutId, updatedWorkout);
      };
      case null {};
    };
  };

  public func getActualSets(workoutId : Nat, exerciseId : Nat) : async Nat {
    switch (workouts.get(workoutId)) {
      case (?workout) {
        let performance = workout.exercisePerformances.find(func(p) { p.exerciseId == exerciseId });
        switch (performance) {
          case (?perf) { perf.actualSets };
          case (null) { 0 };
        };
      };
      case null { 0 };
    };
  };

  public shared ({ caller }) func updateProfilePicture(picture : Storage.ExternalBlob) : async () {
    switch (userProfile) {
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          darkMode = profile.darkMode;
          profilePicture = ?picture;
        };
        userProfile := ?updatedProfile;
      };
      case null {};
    };
  };

  public query ({ caller }) func getProfilePicture() : async ?Storage.ExternalBlob {
    switch (userProfile) {
      case (?profile) { profile.profilePicture };
      case null { null };
    };
  };

  public query ({ caller }) func getUserProfile() : async ?UserProfile {
    userProfile;
  };

  public shared ({ caller }) func initialize() : async () {
    if (userProfile == null) {
      let defaultProfile : UserProfile = {
        name = "";
        darkMode = true;
        profilePicture = null;
      };
      userProfile := ?defaultProfile;
      initializeDefaultExercises();
    };
  };
};

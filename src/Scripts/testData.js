// TEST DATA

c1 = new Muscle("Core", 10, 10);
u1 = new Muscle("Upper", 15, 10);
l1 = new Muscle("Lower", 20, 10);
c2 = new Muscle("Core", 35, 10);
u2 = new Muscle("Upper", 30, 10);
l2 = new Muscle("Lower", 25, 10);
c3 = new Muscle("Core", 35, 10);
u3 = new Muscle("Upper", 40, 10);
l3 = new Muscle("Lower", 10, 10);

e1 = new Exercise(
  "Bodyweight Squat",
  "REPS",
  10,
  "Easy",
  "www.youtube.com",
  [c2, u2, l2],
  null,
  null,
  null,
  "desc"
);
e2 = new Exercise(
  "Plank",
  "SECS",
  20,
  "Easy",
  "www.youtube.com",
  [c1, u1, l1],
  null,
  null,
  null,
  "desc"
);

e3 = new Exercise(
  "Wallsit",
  "SECS",
  20,
  "Easy",
  "www.youtube.com",
  [c3, u3, l3],
  e1,
  e2,
  null,
  "desc"
);
e4 = new Exercise(
  "Lunges",
  "REPS",
  3,
  "Easy",
  "www.youtube.com",
  [c2, u1, l3],
  e2,
  e3,
  2,
  "desc"
);
e5 = new Exercise(
  "Push up",
  "REPS",
  2,
  "Easy",
  "www.youtube.com",
  [c1, u2, l3],
  e3,
  e1,
  null,
  "desc"
);
e6 = new Exercise(
  "Jumping Jack",
  "REPS",
  10,
  "Easy",
  "www.youtube.com",
  [c3, u2, l3],
  e4,
  e2,
  3,
  "desc"
);

eList = [e1, e2, e3, e4, e5, e6];
// eList = [e1];

w = new Workout("ABS", eList, "Beginner", "Medium", "3000");

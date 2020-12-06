//LOAD ANY OR ALL THE OTHER MODELS TO BE LOADED Like pushups? or squats here?

//SQUAT CLASSIFICATIOJ
let SCOptions = {
  inputs: 34, //17 pairs, single pose
  outputs: 2, //since the 2 labels- wallsit and plankl
  task: "classification",
  debug: true,
};
sClassifier = ml5.neuralNetwork(SCOptions);
const sModelInfo = {
  model: `../build/squatModel/model.json`,
  metadata: "../build/squatModel/model_meta.json",
  weights: "../build/squatModel/model.weights.bin",
};

sClassifier.load(sModelInfo, SCLoaded);
function modelLoaded() {
  console.log("PoseNet Model Loaded");
}
function SCLoaded() {
  console.log(" squat classification ready!");
}
function PCLoaded() {
  console.log(" pushup classification ready!");
}
function PWCLoaded() {
  console.log(" plank/wallsit classification ready!");
}

//PUSHUP CLASSIFICATION
let PCOptions = {
  inputs: 34, //17 pairs, single pose
  outputs: 2, //since the 2 labels- wallsit and plankl
  task: "classification",
  debug: true,
};
pClassifier = ml5.neuralNetwork(PCOptions);
const pModelInfo = {
  model: "../build/puModel/model.json",
  metadata: "../build/puModel/model_meta.json",
  weights: "../build/puModel/model.weights.bin",
};
pClassifier.load(pModelInfo, PCLoaded);

//PLANKWALL CLASSIFICATION
let PWCOptions = {
  inputs: 34, //17 pairs, single pose
  outputs: 3, //since the 2 labels- wallsit and plankl
  task: "classification",
  debug: true,
};
pwClassifier = ml5.neuralNetwork(PWCOptions);
const pwModelInfo = {
  model: "../build/pwsModel/model.json",
  metadata: "../build/pwsModel/model_meta.json",
  weights: "../build/pwsModel/model.weights.bin",
};

pwClassifier.load(pwModelInfo, PWCLoaded);

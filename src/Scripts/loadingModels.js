//LOAD ANY OR ALL THE OTHER MODELS TO BE LOADED Like pushups? or squats here?

//SQUAT CLASSIFICATIOJ
let squatModelOpts = {
  inputs: 34, //17 pairs, single pose
  outputs: 2, //since the 2 labels- wallsit and plankl
  task: "classification",
  debug: true,
};
let squatClassifier = ml5.neuralNetwork(squatModelOpts);
const sModelInfo = {
  model: "../Models/squatModel-final/model.json",
  metadata: "../Models/squatModel-final/model_meta.json",
  weights: "../Models/squatModel-final/model.weights.bin",
};
squatClassifier.load(sModelInfo, SCLoaded);

//PUSHUP CLASSIFICATION
let PCOptions = {
  inputs: 34, //17 pairs, single pose
  outputs: 2, //since the 2 labels- wallsit and plankl
  task: "classification",
  debug: true,
};
let pushupClassifier = ml5.neuralNetwork(PCOptions);
const pushupModelInfo = {
  model: "../Models/pushupsModel-final/model.json",
  metadata: "../Models/pushupsModel-final/model_meta.json",
  weights: "../Models/pushupsModel-final/model.weights.bin",
};
pushupClassifier.load(pushupModelInfo, PCLoaded);

//PLANK CLASSIFICATION
let plankOpts = {
  inputs: 34, //17 pairs, single pose
  outputs: 2, //since the 2 labels- wallsit and plankl
  task: "classification",
  debug: true,
};
let plankClassifier = ml5.neuralNetwork(plankOpts);
const pModelInfo = {
  model: "../Models/plankModel-final/model.json",
  metadata: "../Models/plankModel-final/model_meta.json",
  weights: "../Models/plankModel-final/model.weights.bin",
};

plankClassifier.load(pModelInfo, PWCLoaded);

//WALLSIT CLASSIFICATION

let wallsitOpts = {
  inputs: 34, //17 pairs, single pose
  outputs: 2, //since the 2 labels- wallsit and plankl
  task: "classification",
  debug: true,
};
let wallsitClassifier = ml5.neuralNetwork(wallsitOpts);
const wModelInfo = {
  model: "../Models/wallsitModel-final/model.json",
  metadata: "../Models/wallsitModel-final/model_meta.json",
  weights: "../Models/wallsitModel-final/model.weights.bin",
};
s;

plankClassifier.load(pwModelInfo, WCLoaded);

function SCLoaded() {
  console.log(" squat classification ready!");
}
function PCLoaded() {
  console.log(" pushup classification ready!");
}
function PWCLoaded() {
  console.log(" plank classification ready!");
}
function WCLoaded() {
  console.log(" wallsit classification ready!");
}

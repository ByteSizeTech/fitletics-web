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
  model: "../src/Models/squatModel-final/model.json",
  metadata: "../src/Models/squatModel-final/model_meta.json",
  weights: "../src/Models/squatModel-final/model.weights.bin",
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
  model: "../src/Models/pushupsModel-final/model.json",
  metadata: "../src/Models/pushupsModel-final/model_meta.json",
  weights: "../src/Models/pushupsModel-final/model.weights.bin",
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
  model: "../src/Models/plankModel-final/model.json",
  metadata: "../src/Models/plankModel-final/model_meta.json",
  weights: "../src/Models/plankModel-final/model.weights.bin",
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
  model: "../src/Models/wallsitModel-final/model.json",
  metadata: "../src/Models/wallsitModel-final/model_meta.json",
  weights: "../src/Models/wallsitModel-final/model.weights.bin",
};

wallsitClassifier.load(wModelInfo, WCLoaded);

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

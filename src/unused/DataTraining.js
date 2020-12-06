let PWClassifier;

function setup() {
  let options = {
    inputs: 34,
    outputs: 2,
    task: "classification",
    debug: true,
  };
  PWClassifier = ml5.neuralNetwork(options);
  PWClassifier.loadData("../../build/Dataset/PWData.json", dataReady);
}

function dataReady() {
  console.log(PWClassifier.data);
  // PWClassifier.normalizeData();
  const trainingOptions = {
    epochs: 16,
    batchSize: 16,
    learningRate: 0.00011,
  };
  PWClassifier.train(trainingOptions, whileTraining, doneTraining);
}
function whileTraining() {
  console.log(`epoch: ${epoch}, loss:${loss}`);
}
function doneTraining() {
  console.log("model trained");
  // PWClassifier.save();
}

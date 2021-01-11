# Fitletics-web

## About
Fitletics is our capstone project which is a framework that helps the users keep up with their fitness goals. This is done by a web component that helps with the real-time tracking of exercises as well as an [Android app](https://github.com/ByteSizeTech/fitletics-android) that recommends workouts based on the body type and current fitness level of the user which then provides analytics on the past sessions <br>

This is the website module that handles scanning the user's body to determine the body type along with having them tracked in real-time using the webcam. The body analysis is handled by a CNN trained on the [SOMASET from Kaggle](https://www.kaggle.com/vicolab/somaset) which had about 100k images along with the [market-1505](https://www.aitribune.com/dataset/2018051063)  dataset with a further 1.5k images. For the real-time rep counting, we implemented [Google's PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet) which is lightweight, yet accurate for detecting the different poses while in a workout 

## Getting Started
<b>Clone the repository </b>
``` 
git clone https://github.com/ByteSizeTech/fitletics-web.git
```

## Directory Structure
```
    ├── build                   # HTML files and support dirs
    │   ├── Images		# Support images
    │   ├── JsonData         	# Support json files for models
    └── ...
    ├── src
    │   ├── Models		# Body analysis' & Supported exercise's models 
    │   ├── Scripts         	# JavaScript logic files and classes
    └── └── styles         	# .css for page styling
```	

import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OptionSwitch from "../core/OptionSwitch";
import FaceMap from "./FaceMap";
import ChooseImageButton from "../core/ChooseImageButton";
import { detectFace } from "../mlkit";

const FaceDetection = () => {
  const [images, setImages] = useState([]);
  const [showFrame, setShowFrame] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const [image1Selected, setImage1Selected] = useState(false);
  const [image2Selected, setImage2Selected] = useState(false);
  const [report, setReport] = useState("");

  const Separator = () => <View style={styles.separator} />;

  const handleReset = () => {
    setImages([]);
    setShowFrame(false);
    setShowLandmarks(false);
    setShowContours(false);
    setImage1Selected(false);
    setImage2Selected(false);
    setReport("");
  };

  const removeImage = (index, faceName) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    if (faceName === "face1") {
      setImage1Selected(false);
    } else if (faceName === "face2") {
      setImage2Selected(false);
    }
    setReport("");
  };

  const handleChoose = async (currentImage, faceName) => {
    if (currentImage) {
      try {
        // Detection options
        const options = {
          performanceMode: "accurate",
          landmarkMode: "all",
          contourMode: "all",
          classificationMode: "all",
          minFaceSize: 0.1,
          trackingEnabled: true,
        };

        // Perform face detection
        const result = await detectFace(currentImage.path, options);
        const faceData = result[0]; // Get the first detected face
        if (faceData) {
          // Create a single object with the image and face data
          const imageDetail = {
            image: currentImage,
            faceName,
            faceData, // Directly storing the result from face detection
          };

          // Update the state with the new imageDetail object
          setImages((prev) => [...prev, imageDetail]);
          if (faceName === "face1") {
            setImage1Selected(true);
          } else if (faceName === "face2") {
            setImage2Selected(true);
          }
          setReport("");
        } else {
          setReport({ Face: "No face detected" });
        }
        // Optionally log the result for debugging
        // console.log("detectFace result:", JSON.stringify(result));
      } catch (error) {
        console.error("Error in handleChoose:", error);
      }
    } else {
      console.error("no image found");
    }
  };

  function calculateFaceSimilarity(basicMetrics, landmarkDistances, maxTolerableDistance = 300) {
    // Basic Metrics Contribution
    const basicScore = (basicMetrics?.leftEyeOpenSimilarity + basicMetrics?.rightEyeOpenSimilarity + basicMetrics?.smileSimilarity + basicMetrics.rotationSimilarity?.average) / 4;
    const threshold = 0.7; // Adjust this threshold based on your requirements
    // Landmark Distances Contribution
    const totalLandmarkDistance = Object.values(landmarkDistances).reduce((sum, value) => sum + value, 0);
    const averageLandmarkDistance = totalLandmarkDistance / Object.keys(landmarkDistances).length;
    const landmarkScore = Math.max(0, 1 - averageLandmarkDistance / maxTolerableDistance);

    // Weights for Scores
    const alpha = 0.5; // Weight for basic metrics
    const beta = 0.5; // Weight for landmark distances

    // Overall Similarity Score
    const overallScore = alpha * basicScore + beta * landmarkScore;

    // Probability Estimate
    const probability = overallScore;

    // Return result
    return {
      basicScore,
      landmarkScore,
      overallScore,
      probability,
      isSamePerson: probability > threshold, // You can adjust this threshold based on your requirements
    };
  }

  function compareTwoFaces(faceData1, faceData2) {
    if (!faceData1 || !faceData2) {
      console.error("Missing face data");
      return null;
    }

    // Basic Metrics
    const basicMetrics = {
      smileSimilarity: 1 - Math.abs(faceData1.smilingProbability - faceData2.smilingProbability),
      leftEyeOpenSimilarity: 1 - Math.abs(faceData1.leftEyeOpenProbability - faceData2.leftEyeOpenProbability),
      rightEyeOpenSimilarity: 1 - Math.abs(faceData1.rightEyeOpenProbability - faceData2.rightEyeOpenProbability),
      rotationSimilarity: {
        x: 1 - Math.abs(faceData1.rotationX - faceData2.rotationX) / 360,
        y: 1 - Math.abs(faceData1.rotationY - faceData2.rotationY) / 360,
        z: 1 - Math.abs(faceData1.rotationZ - faceData2.rotationZ) / 360,
      },
    };

    // Calculate Average Rotation Similarity
    basicMetrics.rotationSimilarity.average = (basicMetrics.rotationSimilarity.x + basicMetrics.rotationSimilarity.y + basicMetrics.rotationSimilarity.z) / 3;

    // Landmarks
    const landmarkDistances = {};
    let totalLandmarkDistance = 0;
    let landmarkCount = 0;

    if (faceData1.landmarks && faceData2.landmarks) {
      Object.keys(faceData1.landmarks).forEach((key) => {
        if (faceData1.landmarks[key].position && faceData2.landmarks[key]?.position) {
          const point1 = faceData1.landmarks[key].position;
          const point2 = faceData2.landmarks[key].position;

          const distance = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
          landmarkDistances[key] = distance;
          totalLandmarkDistance += distance;
          landmarkCount++;
        }
      });
    }

    // Normalize landmark score (assuming max acceptable distance is 100)
    const averageLandmarkDistance = totalLandmarkDistance / landmarkCount;
    const landmarkScore = Math.max(0, 1 - averageLandmarkDistance / 100);

    // Overall Score
    const overallScore = {
      basicMetrics: (basicMetrics.smileSimilarity + basicMetrics.leftEyeOpenSimilarity + basicMetrics.rightEyeOpenSimilarity + basicMetrics.rotationSimilarity.average) / 4,
      landmarks: landmarkScore,
    };

    overallScore.total = overallScore.basicMetrics * 0.5 + overallScore.landmarks * 0.5;

    return {
      basicMetrics,
      landmarkDistances,
      overallScore,
    };
  }

  const handleCompareFaces = () => {
    // Assuming 'images' contains the objects with faceData for both images
    if (images.length === 2) {
      const faceData1 = images[0].faceData;
      const faceData2 = images[1].faceData;

      if (faceData1 && faceData2) {
        const comparisonResult = compareTwoFaces(faceData1, faceData2);
        const similarityResult = calculateFaceSimilarity(comparisonResult.basicMetrics, comparisonResult.landmarkDistances);
        setReport({ comparisonResult: comparisonResult, similarityResult: similarityResult });
        // console.log("Comparison Result:", comparisonResult);
        // console.log("Similarity Result:", similarityResult);
        // Do something with the comparison result, e.g., display similarity
      } else {
        console.error("Face data is missing for one or both images.");
      }
    } else {
      console.error("Two images are required to compare faces.");
    }
  };

  const renderObject = (obj) => {
    return Object.entries(obj).map(([key, value], index) => (
      <View key={index} style={{ marginBottom: 5 }}>
        <Text style={styles.keyText}>{key}:</Text>
        {typeof value === "object" && value !== null ? <View style={{ marginLeft: 10 }}>{renderObject(value)}</View> : <Text style={styles.valueText}>{String(value)}</Text>}
      </View>
    ));
  };

  // console.log("compare report :", JSON.stringify(report));
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", marginVertical: 10, paddingHorizontal: 10 }}>GOOGLE ML-KIT - FACE DETECTION</Text>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.imagesContainer}>
          {images?.length > 0 && (
            <View>
              {images?.map((item, index) => {
                return (
                  <View style={{ marginBottom: 10 }} key={index}>
                    <TouchableOpacity style={styles.removeContainer} onPress={() => removeImage(index, item?.faceName)}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: item?.image?.path }} style={styles.image} />
                    <FaceMap
                      key={Math.random()}
                      face={item?.faceData}
                      width={item.image?.width}
                      height={item.image?.height}
                      showFrame={showFrame}
                      showContours={showContours}
                      showLandmarks={showLandmarks}
                    />
                  </View>
                );
              })}
              <View style={styles.switchContainer}>
                <OptionSwitch label="Show Frame" value={showFrame} onChange={setShowFrame} />
                <OptionSwitch label="Show Landmarks" value={showLandmarks} onChange={setShowLandmarks} />
                <OptionSwitch label="Show Contours" value={showContours} onChange={setShowContours} />
              </View>
            </View>
          )}
        </View>
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 10 }}>
          {!image1Selected && (
            <View>
              <Text style={styles.chooseText}>Choose Image 1</Text>
              <View style={styles.flexRow}>
                <ChooseImageButton type={"camera"} title={"Open Camera"} onChoose={(currentImage) => handleChoose(currentImage, "face1")} />
                <ChooseImageButton title={"Open Gallery"} onChoose={(currentImage) => handleChoose(currentImage, "face1")} />
              </View>
            </View>
          )}
          <Separator />
          {!image2Selected && (
            <View>
              <Text style={styles.chooseText}>Choose Image 2</Text>
              <View style={styles.flexRow}>
                <ChooseImageButton type={"camera"} title={"Open Camera"} onChoose={(currentImage) => handleChoose(currentImage, "face2")} />
                <ChooseImageButton title={"Open Gallery"} onChoose={(currentImage) => handleChoose(currentImage, "face2")} />
              </View>
            </View>
          )}

          {report && (
            <View>
              <Text style={styles.header}>Detection Results:</Text>
              <Text style={styles.reportText}>{renderObject(report)} </Text>
            </View>
          )}
          {image1Selected && image2Selected && (
            <TouchableOpacity onPress={handleCompareFaces} style={styles.compareContaier}>
              <Text style={styles.compareText}>Compare</Text>
            </TouchableOpacity>
          )}
          {image2Selected && image1Selected && (
            <TouchableOpacity onPress={handleReset} style={styles.compareContaier}>
              <Text style={styles.compareText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" },
  imagesContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" },
  switchContainer: { flexWrap: "wrap", flexDirection: "row", alignItems: "center", marginTop: 20 },
  image: {
    aspectRatio: 1,
    width: "100%",
    resizeMode: "contain",
    backgroundColor: "black",
  },
  removeContainer: { zIndex: 10, right: 0, padding: 5, position: "absolute" },
  removeText: { fontSize: 12, fontWeight: "500", color: "red" },
  compareText: { color: "white", fontSize: 16, fontWeight: "600" },
  chooseText: { color: "black", fontSize: 16, fontWeight: "400" },
  reportText: { color: "black", fontSize: 14, paddingHorizontal: 10, marginVertical: 10 },
  compareContaier: { width: "90%", height: 45, alignSelf: "center", marginBottom: 10, borderRadius: 5, backgroundColor: "tomato", justifyContent: "center", alignItems: "center" },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  keyText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  valueText: {
    fontSize: 14,
    color: "#333",
  },
});

export default FaceDetection;

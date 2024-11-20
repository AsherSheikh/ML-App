import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import PreviewImage from "../core/PreviewImage";
import OptionSwitch from "../core/OptionSwitch";
import FaceMap from "./FaceMap";
import ChooseImageButton from "../core/ChooseImageButton";
import { detectFace } from "../mlkit";

const FaceDetection = () => {
  const [image, setImage] = useState(null);
  const [faces, setFaces] = useState([]);
  const [showFrame, setShowFrame] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [showContours, setShowContours] = useState(false);

  const handleChoose = async (currentImage) => {
    setImage(currentImage);
    const options = {
      performanceMode: "accurate",
      landmarkMode: "all",
      contourMode: "all",
      classificationMode: "all",
      minFaceSize: 0.1,
      trackingEnabled: true,
    };
    const result = await detectFace(currentImage.path, options);
    console.log('detectFace res:',result)
    setFaces(result);
  };

  return (
    <View style={styles.container}>
      <ChooseImageButton onChoose={handleChoose} />

      {image && (
        <View style={styles.imageContainer}>
          <PreviewImage source={image.path} />

          {faces.map((face) => (
            <FaceMap key={Math.random()} face={face} width={image.width} height={image.height} showFrame={showFrame} showContours={showContours} showLandmarks={showLandmarks} />
          ))}

          <OptionSwitch label="Show Frame" value={showFrame} onChange={setShowFrame} />
          <OptionSwitch label="Show Landmarks" value={showLandmarks} onChange={setShowLandmarks} />
          <OptionSwitch label="Show Contours" value={showContours} onChange={setShowContours} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
});

export default FaceDetection;

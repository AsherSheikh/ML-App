import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import TextRecognition from "./TextRecognition";
import FaceDetection from "./FaceDetection";

const MLKitComponents = ({ show }) => {
  switch (show) {
    case "text-recognitaion":
      return <TextRecognition />;
    case "face-detection":
      return <FaceDetection />;
    default:
      return null;
  }
};

export default MLKitComponents;

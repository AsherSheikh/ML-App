import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import TextRecognition from "./TextRecognition";

const MLKitComponents = ({ show }) => {
  switch (show) {
    case "text-recognitaion":
      return <TextRecognition />;
    default:
      return null;
  }
};

export default MLKitComponents;

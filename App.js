import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import TextRecognition from "./src/components/TextRecognition";
import MLKitComponents from "./src/components/MLkitComponents";

const App = () => {
  const [show, setShow] = useState("face-detection");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MLKitComponents show={show} />
    </SafeAreaView>
  );
};

export default App;

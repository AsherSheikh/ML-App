import { View, Text, SafeAreaView, Button, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import TextRecognition from "./src/components/TextRecognition";
import MLKitComponents from "./src/components/MLkitComponents";

const App = () => {
  const [show, setShow] = useState("face-detection");
  const buttons = [
    { value: "face-detection", title: "Face Detection" },
    { value: "text-recognitaion", title: "Text Recogination" },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.buttonsContainer}>
        {buttons.map((type) => {
          return (
            <TouchableOpacity style={styles.buttonContainer} onPress={() => setShow(type.value)}>
              <Text style={styles.buttonText}>{type.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <MLKitComponents show={show} />
    </SafeAreaView>
  );
};

export default App;
const styles = StyleSheet.create({
  buttonsContainer: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "center" },
  buttonContainer: { backgroundColor: "#327ba8", paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 5, marginVertical: 10, borderRadius: 5 },
  buttonText: { fontSize: 14, color: "white",fontWeight:'600' },
});

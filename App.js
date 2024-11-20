import { View, Text, SafeAreaView, Button, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
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
        {buttons.map((type, i) => {
          return (
            <TouchableOpacity key={i} style={styles.buttonContainer} onPress={() => setShow(type.value)}>
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
  buttonContainer: {
    borderColor: "#327ba8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  buttonText: { fontSize: 14, color: "#327ba8", fontWeight: "500" },
  selectText: { fontSize: 16, color: "#327b", fontWeight: "500" },
});

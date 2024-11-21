import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const ChooseImageButton = ({ onChoose, title, type }) => {
  const handleLibrary = () => {
    try {
      const options = {
        mediaType: "photo",
      };
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          const asset = response?.assets[0];
          const currentImage = {
            path: asset.uri,
            width: asset.width,
            height: asset.height,
          };
          onChoose(currentImage);
        }
      });
    } catch (error) {
      console.log("handleLibrary catch:", error);
    }
  };

  const handleCamera = () => {
    try {
      const options = {
        mediaType: "photo",
        quality: 1,
        saveToPhotos: true,
      };
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          const asset = response.assets[0];
          const currentImage = {
            path: asset.uri,
            width: asset.width,
            height: asset.height,
          };
          onChoose(currentImage);
        }
      });
    } catch (error) {
      console.log("handleCamera catch:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (type === "camera") {
          handleCamera();
        } else {
          handleLibrary();
        }
      }}
      style={styles.buttonContaier}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ChooseImageButton;
const styles = StyleSheet.create({
  buttonContaier: { height: 45, paddingHorizontal: 20, alignSelf: "center", marginVertical: 20, borderRadius: 10, backgroundColor: "#2196f3", justifyContent: "center", alignItems: "center" },
  buttonText: { color: "white", fontSize: 14, fontWeight: "500" },
});

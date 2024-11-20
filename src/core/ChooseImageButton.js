import React from "react";
import { Button } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const ChooseImageButton = ({ onChoose }) => {
  const handlePress = () => {
    const options = {
      mediaType: "photo",
    };
    launchImageLibrary(options, (response) => {
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
  };

  return <Button title="Choose an Image" onPress={handlePress} />;
};

export default ChooseImageButton;

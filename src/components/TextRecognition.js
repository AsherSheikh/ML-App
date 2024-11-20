import { View, Text, Image, Button, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { recognizeImage } from "../mlkit";

const TextRecognition = () => {
  const [imageUri, setImageUri] = useState(null);
  const [text, setText] = useState(null);

  const captureImage = () => {
    const options = {
      mediaType: "photo",
      cameraType: "back",
      saveToPhotos: true,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };
  const processImage = () => {
    if (imageUri) {
      recognizeImage(imageUri)
        ?.then((response) => {
          console.log("recognizeImage res:", JSON.stringify(response));
          const blocks = response.blocks;
          const recognizedText = blocks.map((block) => block.text).join("\n");
          setText(recognizedText);
        })
        .catch((error) => {
          console.error("Error recognizing image: ", error);
        });
    }
  };

  useEffect(() => {
    if (imageUri) {
      processImage();
    }
  }, [imageUri]);

  const pickImageFromGallery = () => {
    const options = {
      mediaType: "photo",
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      <Text style={{ fontWeight: "bold", marginVertical: 10 }}>GOOGLE ML-KIT - TEXT RECOGNITION</Text>
      <Text>{text && <Text style={{ fontWeight: "bold" }}>Text : {text}</Text>}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <View style={{ width: "48%" }}>
          <Button title="Open Camera" onPress={captureImage} style={{ width: "48%" }} />
        </View>
        <View style={{ width: "48%" }}>
          <Button title="Open Gallery" onPress={pickImageFromGallery} style={{ width: "48%" }} />
        </View>
      </View>
    </View>
  );
};

export default TextRecognition;

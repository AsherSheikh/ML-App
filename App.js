import { View, Text, Image, Button, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { recognizeImage } from "./src/mlkit";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const App = () => {
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
          const blocks = response.blocks;
          const recognizedText = blocks.map((block) => block.text).join("\n");
          console.log(JSON.stringify(response));
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontWeight: "bold", marginVertical: 30 }}>ML KIT - TEXT RECOGNITION</Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Text :</Text>
          {text}
        </Text>

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
    </SafeAreaView>
  );
};

export default App;

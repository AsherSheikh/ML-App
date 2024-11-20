import { NativeModules } from "react-native";

const { TextRecognitionModule, FaceDetection } = NativeModules;

export const recognizeImage = (url) => {
  return TextRecognitionModule.recognizeImage(url);
};

export const detectFace = (url, options) => {
  return FaceDetection.detect(url, options);
};

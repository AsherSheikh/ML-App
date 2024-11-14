import {NativeModules} from 'react-native';

const {TextRecognitionModule} = NativeModules;

export const recognizeImage = url => {
  return TextRecognitionModule.recognizeImage(url);
};

import random from "lodash/random";
import { ImageSourcePropType } from "react-native";

const Random2012 = require("../../../../assets/screens/login-modal/2012-random.jpg") as ImageSourcePropType;
const AshleyAndJohnny5k = require("../../../../assets/screens/login-modal/5k-ashley-and-johnny.jpg") as ImageSourcePropType;
const FinishLine5k = require("../../../../assets/screens/login-modal/5k-finishline-2.jpg") as ImageSourcePropType;
const Kid5k = require("../../../../assets/screens/login-modal/5k-kid.jpg") as ImageSourcePropType;
const DanceBlueU13 = require("../../../../assets/screens/login-modal/DanceBlueU-13.jpg") as ImageSourcePropType;
const DanceBlueU16 = require("../../../../assets/screens/login-modal/DanceBlueU-16.jpg") as ImageSourcePropType;
const DanceBlueU17 = require("../../../../assets/screens/login-modal/DanceBlueU-17.jpg") as ImageSourcePropType;
const DanceBlueU3 = require("../../../../assets/screens/login-modal/DanceBlueU-3.jpg") as ImageSourcePropType;
const DanceBlueU7 = require("../../../../assets/screens/login-modal/DanceBlueU-7.jpg") as ImageSourcePropType;
const DanceBlueU8 = require("../../../../assets/screens/login-modal/DanceBlueU-8.jpg") as ImageSourcePropType;
const Blu = require("../../../../assets/screens/login-modal/blu.jpg") as ImageSourcePropType;
const Dancing = require("../../../../assets/screens/login-modal/dancing.jpg") as ImageSourcePropType;

const SplashLoginBackgrounds: ImageSourcePropType[] = [
  AshleyAndJohnny5k,
  FinishLine5k,
  Kid5k,
  Random2012,
  Blu,
  DanceBlueU3,
  DanceBlueU7,
  DanceBlueU8,
  DanceBlueU13,
  DanceBlueU16,
  DanceBlueU17,
  Dancing,
];

export function getRandomSplashLoginBackground(): ImageSourcePropType {
  const index = random(0, SplashLoginBackgrounds.length - 1);
  return SplashLoginBackgrounds[index];
}

export default SplashLoginBackgrounds;

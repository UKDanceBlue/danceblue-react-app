import { Image, ImageBackground, View } from "react-native";


import dbLogo from "../../../assets/home/DB_Primary_Logo-01.png";
import backgroundImg from "../../../assets/home/db20_ribbon.jpg";
import { globalStyles } from "../../theme";

/**
 * A header image container used on the home screen
 */
const HeaderImage = () => (
  <View>
    <ImageBackground source={backgroundImg} style={globalStyles.genericFillImage}>
      <Image source={dbLogo} />
    </ImageBackground>
  </View>
);

export default HeaderImage;

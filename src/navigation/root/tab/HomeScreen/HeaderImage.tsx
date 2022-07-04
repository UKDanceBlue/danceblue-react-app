import { Box, Image, ZStack } from "native-base";

import dbLogo from "../../../../../assets/home/DB_Primary_Logo-01.png";
import backgroundImg from "../../../../../assets/home/db20_ribbon.jpg";

/**
 * A header image container used on the home screen
 */
const HeaderImage = () => (
  <ZStack height="1/2" width="full" m={0}>
    <Image
      source={backgroundImg}
      size="full"
      resizeMode="cover"
      blurRadius={10}
      alt="Picture of DB Marathon" />
    <Box style={{ backgroundColor: "#ffffff55" }}
      width="full"
      height="full" />
    <Image source={dbLogo}
      size="full"
      resizeMode="contain"
      alt="DanceBlue Logo" />
  </ZStack>
);

export default HeaderImage;

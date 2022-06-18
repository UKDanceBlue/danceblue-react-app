import { Linking, SafeAreaView, ScrollView } from "react-native";
import { Button } from "react-native-elements";

import { useAppSelector } from "../../common/CustomHooks";

import HeaderImage from "./HeaderImage";
import SponsorCarousel from "./SponsorCarousel";

/**
 * Component for home screen in main navigation
 */
const HomeScreen = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <HeaderImage />
    <Button
      style={{ margin: 10, alignSelf: "center" }}
      onPress={() => {
        if (
          Linking.canOpenURL(
            "https://danceblue.networkforgood.com/causes/4789-danceblue-golden-matrix-fund-dance-teams?utm_source=website&utm_medium=unit_website"
          )
        ) {
          Linking.openURL(
            "https://danceblue.networkforgood.com/causes/4789-danceblue-golden-matrix-fund-dance-teams?utm_source=website&utm_medium=unit_website"
          );
        }
      }}
      title="Donate!"
    />
    <SponsorCarousel />
  </SafeAreaView>
);

HomeScreen.navigationOptions = { title: "Home" };

export default HomeScreen;

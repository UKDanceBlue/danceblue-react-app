import React from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import background_img from "../../../assets/home/db20_ribbon.jpg";
import db_logo from "../../../assets/home/DB_Primary_Logo-01.png";

const HeaderImage = props => {
  return (
    <View style={styles.container}>
      <ImageBackground source={background_img} style={styles.background}>
        <Image
          source={db_logo}
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            resizeMode: "contain",
            backgroundColor: "rgba(255,255,255,0.5)"
          }}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 325,
    width: "98%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden"
  },
  background: {
    flex: 3,
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  }
});

export default HeaderImage;

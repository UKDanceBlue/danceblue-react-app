import React from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import background_img from "../../../assets/home/db20_ribbon.jpg";
import db_logo from "../../../assets/home/DB_Primary_Logo-01.png";

const HeaderImage = props => {
  return (
    <View style={styles.container}>
      <ImageBackground source={background_img} style={styles.background}>
        <Image source={db_logo} style={styles.logo} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: "98%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom:5,
    borderWidth:1,
    borderColor:'gold'
  },
  background: {
    flex: 3,
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  logo: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "contain",
    backgroundColor: "#FFFFFF99"
  },
});

export default HeaderImage;

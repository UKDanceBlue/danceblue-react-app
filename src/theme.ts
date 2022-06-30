import { StyleSheet } from "react-native";

export const globalColors = {
  white: "#F2F3F8",
  darkNavy: "#1F2236",
  grey: "#8697B0",
  lightGrey: "#D3D3D3",
  dbBlue: "#0033A0",
  lightBlue: "#8BA9FC",
  red: "#BA0725",
  green: "#55D128",
  dbSaffron: "#FFC72C",
};

export const rnElementsTheme = {
  colors: {
    primary: globalColors.dbBlue,
    secondary: globalColors.lightBlue,
    white: globalColors.white,
    black: "#000",
    grey0: "#393e42",
    grey1: "#43484d",
    grey2: globalColors.grey,
    grey3: "#86939e",
    grey4: globalColors.lightGrey,
    grey5: "#e1e8ee",
    greyOutline: globalColors.darkNavy,
    searchBg: "#303337",
    success: globalColors.green,
    error: globalColors.red,
    warning: "#ADFF2F",
    divider: globalColors.darkNavy,
  },
};

export const globalStyles = StyleSheet.create({
  genericButton: {
    alignItems: "center",
    backgroundColor: globalColors.dbSaffron,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  genericCenteredView: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  genericFillImage: {
    flex: 1,
    height: "100%",
    resizeMode: "contain",
    width: "100%",
  },
  genericHeaderContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  genericIcon: {
    flex: 1,
    height: undefined,
    resizeMode: "contain",
    width: undefined,
  },
  genericRow: {
    alignItems: "center",
    borderTopColor: globalColors.darkNavy,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 10,
  },
  genericRowCenter: {
    flexDirection: "column",
    textAlign: "center",
    width: "50%",
  },
  genericRowLeft: {
    flexDirection: "row",
    width: "20%",
  },
  genericRowRight: {
    justifyContent: "flex-end",
    textAlign: "right",
    width: "30%",
  },
  genericText: {
    color: globalColors.darkNavy,
    fontSize: 15,
  },
  genericView: { flex: 1 },
});

export const globalTextStyles = StyleSheet.create({
  boldText: {
    ...globalStyles.genericText,
    fontWeight: "bold",
  },
  headerText: {
    ...globalStyles.genericText,
    fontSize: 16,
    textAlign: "center",
  },
  italicText: {
    ...globalStyles.genericText,
    fontStyle: "italic",
  },
  underlineText: {
    ...globalStyles.genericText,
    textDecorationLine: "underline",
  },
});

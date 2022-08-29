import { Theme, extendTheme } from "native-base";

import { RecursivePartial } from "./types/typeUtils";

/*
 * Useful links for extending the theme:
 * https://docs.nativebase.io/default-theme
 * https://docs.nativebase.io/dark-mode
 */
export const customTheme = extendTheme({
  colors: {
    primary: {
      50: "#e0f5ff",
      100: "#b1d8ff",
      200: "#7fb9ff",
      300: "#4d97ff",
      400: "#1e72fe",
      500: "#0751e5",
      600: "#0033A0", // DanceBlue official color
      700: "#003281",
      800: "#002250",
      900: "#000e20",
    },
    secondary: {
      50: "#e0e8ff",
      100: "#b1beff",
      200: "#7f97ff",
      300: "#4d73ff",
      400: "#1e54fe",
      500: "#0742e5",
      600: "#0039b3",
      700: "#002081",
      800: "#000d50",
      900: "#000220",
    },
    tertiary: {
      50: "#fff3da",
      100: "#ffe3ad",
      200: "#ffd47d",
      300: "#ffca4b",
      400: "#FFC72C", // DanceBlue official color
      500: "#e69a00",
      600: "#b36b00",
      700: "#804400",
      800: "#4e2300",
      900: "#1d0900",
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 5,
        margin: "1",
        padding: "3",
      }
    },
    Text: { baseStyle: { fontSize: 15 } }
  }
} as RecursivePartial<Theme>);

// 2. Get the type of the CustomTheme
type CustomThemeType = typeof customTheme;

// 3. Extend the internal NativeBase Theme
declare module "native-base" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ICustomTheme extends CustomThemeType {}
}

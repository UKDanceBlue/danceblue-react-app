import { RecursivePartial } from "@ukdanceblue/db-app-common";
import { Theme, extendTheme } from "native-base";

import { colors } from "./colors";
import { components } from "./components";
import { fontConfig, fontSizes, fontWeights, fonts, letterSpacings, lineHeights, opacity, shadows } from "./typography";

/*
 * Useful links for extending the theme:
 * https://docs.nativebase.io/default-theme
 * https://docs.nativebase.io/dark-mode
 */
export const customTheme = extendTheme({
  colors,
  components,
  config: { "initialColorMode": "light" },
  fontConfig,
  fontSizes,
  fontWeights,
  fonts,
  letterSpacings,
  lineHeights,
  opacity,
  shadows,
} as RecursivePartial<Theme>);

// 2. Get the type of the CustomTheme
type CustomThemeType = typeof customTheme;

// 3. Extend the internal NativeBase Theme
declare module "native-base" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ICustomTheme extends CustomThemeType {}
}

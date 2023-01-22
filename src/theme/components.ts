import type { ComponentTheme, Theme } from "native-base/src/theme";
import originalComponentThemes from "native-base/src/theme/components";

const {
  Button: originalButtonTheme,
  Text: originalTextTheme
} = originalComponentThemes;

type BaseStyleProp<T extends { baseStyle: BaseStyle }, BaseStyle extends (arg: Param) => unknown = T["baseStyle"], Param = Parameters<BaseStyle>[0]> = Param;

// We are going to want a ton of component presets here, take a look around the project and look for frequently repeated styles
export const components: Partial<Record<keyof Theme["components"], ComponentTheme>> = {
  Button: {
    baseStyle: (props: BaseStyleProp<typeof originalButtonTheme>) => ({
      ...originalButtonTheme.baseStyle(props) as ComponentTheme["baseStyle"],
      borderRadius: 5,
      margin: "1",
      padding: "3",
    }),
  },
  Text: { defaultProps: () => ({ fontSize: 15 }), baseStyle: originalTextTheme.baseStyle },
} as const;

import { Text, View, useTheme } from "native-base";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const Breadcrumbs = ({
  pageName, includeBreadcrumbs, previousPage
}: { pageName:string; includeBreadcrumbs:boolean; previousPage:string }) => {
  const themes = useTheme();
  const {
    primary, secondary, tertiary, success, warning, error, danger
  } = useThemeColors();
  const {
    heading, body, mono
  } = useThemeFonts();
  
  function ReturnElement() {
    if (includeBreadcrumbs) {
      return <Text marginLeft={"3"}>{`< ${previousPage}`}</Text>;
    }
  }

  return (
    <View>
      <Text
        bg={primary[700]}
        color={secondary[400]}
        textAlign="center"
        fontSize={themes.fontSizes.md}
        bold>{pageName}</Text>

      <View>
        {ReturnElement()}
      </View>
    </View>
  );
};
export default Breadcrumbs;

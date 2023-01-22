import { Text, View, useTheme } from "native-base";

import { useThemeColors, useThemeFonts } from "../../customHooks";
import ScoreboardItem from "../ScoreboardItem";

const Scoreboard = ({ title }: { title:string }) => {
  const themes = useTheme();
  const {
    primary, secondary, tertiary, success, warning, error, danger
  } = useThemeColors();
  const {
    heading, body, mono
  } = useThemeFonts();
  const ichooseyou = "awareness-ribbon";
  const fromyou = "entypo";

  return (
    <View>
      <Text
        textAlign="center"
        color={secondary[400]}
        fontFamily={heading}
        fontSize={themes.fontSizes["4xl"]}
        style={{
          textShadowColor: secondary[300],
          textShadowOffset: { width: 2, height: 1.5 },
          textShadowRadius: 1
        }}>{title}</Text>
    
      <ScoreboardItem
        rank={1}
        name="Alpha Gamma Delta <3"
        points={1000}
        icon={ichooseyou}
        type={fromyou}/>
      <ScoreboardItem
        rank={2}
        name="Alpha Gamma Delta <3"
        points={1000}
        icon={ichooseyou}
        type={fromyou}/>
      <ScoreboardItem
        rank={3}
        name="Alpha Gamma Delta <3"
        points={1000}
        icon={ichooseyou}
        type={fromyou}/>
      <ScoreboardItem
        rank={4}
        name="Alpha Gamma Delta <3"
        points={1000}
        icon={ichooseyou}
        type={fromyou}/>
    </View>
  );
};
export default Scoreboard;

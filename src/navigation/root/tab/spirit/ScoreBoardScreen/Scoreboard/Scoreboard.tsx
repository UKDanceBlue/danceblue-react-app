import { Entypo } from "@expo/vector-icons";
import { Text, View } from "native-base";

import { useThemeColors } from "../../../../../../common/customHooks";
import ScoreboardItem from "../ScoreboardItem";

const Scoreboard = ({ title }: { title:string }) => {
  const textShadowColor = useThemeColors().secondary[300];

  const ichooseyou = "awareness-ribbon";
  const fromyou = Entypo;

  return (
    <View>
      <Text
        textAlign="center"
        color="secondary.400"
        fontFamily="heading"
        fontSize="4xl"
        style={{
          textShadowColor,
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

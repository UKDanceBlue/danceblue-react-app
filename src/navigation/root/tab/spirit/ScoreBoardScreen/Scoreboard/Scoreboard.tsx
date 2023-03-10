import { Entypo } from "@expo/vector-icons";
import { Box, FlatList, Text, View } from "native-base";

import { useThemeColors } from "../../../../../../common/customHooks";
import { StandingType } from "../../../../../../types/StandingType";
import ScoreboardItem from "../ScoreboardItem";

const Scoreboard = ({
  title, data
}: { title:string; data: StandingType[] }) => {
  const textShadowColor = useThemeColors().secondary[300];

  const ichooseyou = "awareness-ribbon";
  const fromyou = Entypo;

  return (
    <View>
      <Text
        justifyContent="center"
        alignContent="center"
        textAlign="center"
        color="secondary.400"
        fontFamily="heading"
        fontSize="4xl"
        style={{
          textShadowColor,
          textShadowOffset: { width: 2, height: 1.5 },
          textShadowRadius: 1
        }}>{title}</Text>
      {
        <FlatList
          scrollEnabled={false}
          overflow="visible"
          data={data}
          renderItem={({
            item, index
          }) => (
            <ScoreboardItem
              key={item.id}
              rank={index + 1}
              name={item.name}
              points={item.points}
              icon={ichooseyou}
              type={fromyou}/>
          )}
          ItemSeparatorComponent={() => (<Box
            marginLeft={3}
            marginRight={3}
            style={{ borderBottomWidth: 1, borderBottomColor: "#0032A0" }}/>)}
          keyExtractor={(item) => item.id}
        />
      }
    </View>
  );
};
export default Scoreboard;

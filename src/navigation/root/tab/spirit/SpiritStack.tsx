import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TeamStackParamList } from "../../../../types/navigationTypes";

import ScoreboardScreen from "./ScoreBoardScreen";
import TeamScreen from "./TeamScreen";

const SpiritStack = createNativeStackNavigator<TeamStackParamList>();

const SpiritScreen = () => {
  return (
    <SpiritStack.Navigator>
      <SpiritStack.Screen name="Scoreboard" component={ScoreboardScreen} />
      <SpiritStack.Screen
        name="MyTeam"
        component={TeamScreen}
      />
    </SpiritStack.Navigator>
  );
};

export default SpiritScreen;

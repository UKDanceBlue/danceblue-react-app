import { FontAwesome5 } from "@expo/vector-icons";
import { canOpenURL, openURL } from "expo-linking";
import { Box, Center, Divider, Heading, Pressable, ScrollView, Text, ZStack } from "native-base";
import { useMemo } from "react";
import { RefreshControl, useWindowDimensions } from "react-native";

import Place from "../../../../../common/components/Place";
import { universalCatch } from "../../../../../common/logging";
import { useLoading, useUserData } from "../../../../../context";
import { useRefreshUserData } from "../../../../../context/user";

import TeamInformation from "./TeamInformation";

const TeamScreen = () => {
  const {
    team, linkblue: userLinkblue
  } = useUserData();
  const { width: screenWidth } = useWindowDimensions();
  const reload = useRefreshUserData();
  const [isLoading] = useLoading("UserDataProvider");
  const individualTotals = useMemo(
    () => {
      if (team?.individualTotals == null) {
        return null;
      } else {
        return Object.entries(team.individualTotals)
          .filter(([linkblue]) => !(linkblue.startsWith("%") && linkblue.endsWith("%")))
          .map(([ linkblue, points ]) => ([ linkblue.toLowerCase(), points ] as [string, number]))
          .sort(([ , a ], [ , b ]) => b - a);
      }
    },
    [team?.individualTotals]
  );

  if (team == null) {
    return (
      <Center>
        <FontAwesome5
          name="users"
          size={screenWidth/3}
          color={"#cc1100"}
          style={{ textAlignVertical: "center" }}
        />
        <Text
          fontSize={25}
          mx="8"
          m="4"
          textAlign="center">
          You are not on a team.
        </Text>
        <Text mx="8" m="4" textAlign="center">
          If you believe this is an error and have submitted spirit points, try logging out and logging back in. If that doesn&apos;t work, don&apos;t worry, your spirit points are being recorded, please contact your team captain or the DanceBlue committee to get access in the app.
        </Text>
      </Center>
    );
  } else {
    const {
      name, memberNames, fundraisingTotal, totalPoints
    } = team;

    return (
      <TeamInformation
        captains={[]}
        members={Object.values(memberNames).filter((name): name is string => name != null)}
        name={name}
      />
    );
  }
};

export default TeamScreen;

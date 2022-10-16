import { FontAwesome5 } from "@expo/vector-icons";
import { Center, Column, Divider, FlatList, Heading, Text } from "native-base";
import { useWindowDimensions } from "react-native";

import Place from "../../../../common/components/Place";
import { useUserData } from "../../../../context";

const TeamScreen = () => {
  const {
    team, linkblue: userLinkblue
  } = useUserData();
  const { width: screenWidth } = useWindowDimensions();

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
          If you believe this is an error and have submitted spirit points, please contact your team captain or the DanceBlue committee.
        </Text>
      </Center>
    );
  } else {
    const {
      name, memberNames, individualTotals, fundraisingTotal, totalPoints
    } = team;

    const column = [];

    // Add a title for the team
    column.push(
      <Heading
        key="team-title"
        size="2xl"
        textAlign="center"
      >
        {name}
      </Heading>
    );

    // Add a fundraising total if it exists
    if (fundraisingTotal != null) {
      column.push(
        <Text fontSize={20} textAlign="center" key="fundraising">
            Fundraising Total: <Text bold>${fundraisingTotal}</Text>
        </Text>
      );
    }

    // Add a title for spirit points if individual totals exist or if total points exist
    if (individualTotals != null || totalPoints != null) {
      column.push(
        <Heading
          size="lg"
          textAlign="center"
          key="spirit-title"
          mt={30}>
            Spirit Points
        </Heading>,
        <Divider
          my={2}
          key="spirit-divider"/>
      );
    }

    // Add grand total if it exists
    if (totalPoints != null) {
      column.push(
        <Text fontSize={20} textAlign="center" key="total-points">
          Total Points: <Text bold>{totalPoints}</Text>
        </Text>
      );
    }

    // Add a list of members and their points
    if (individualTotals != null) {
      column.push(
        <Heading
          size="md"
          textAlign="left"
          m={2}
          key="individual-title">
            Individual Totals
        </Heading>,
        <FlatList
          key="individual-points"
          data={Object.entries(individualTotals).sort(([ , a ], [ , b ]) => b - a)}
          renderItem={({
            item: [ linkblue, points ], index
          }) => (
            <Place
              key={linkblue}
              rank={index + 1}
              name={memberNames[linkblue] ?? linkblue}
              points={points}
              isHighlighted={linkblue === userLinkblue}
              lastRow={index === Object.entries(individualTotals).length - 1}
            />
          )}
        />
      );
    }

    return (
      <Column height="100%">
        {column}
      </Column>
    );
  }
};

export default TeamScreen;

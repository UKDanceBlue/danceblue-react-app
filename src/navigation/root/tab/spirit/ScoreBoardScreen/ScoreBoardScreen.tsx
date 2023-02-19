import { FontAwesome5 } from "@expo/vector-icons";
import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { SpiritTeamsRootDoc } from "@ukdanceblue/db-app-common";
import { Pressable, VStack } from "native-base/src/components/primitives";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";

import Jumbotron from "../../../../../common/components/Jumbotron";
import JumbotronTeam from "../../../../../common/components/JumbotronTeam";
import { universalCatch } from "../../../../../common/logging";
import { useAuthData, useUserData } from "../../../../../context";
import { StandingType } from "../../../../../types/StandingType";
import { SpiritStackScreenProps } from "../../../../../types/navigationTypes";

import Scoreboard from "./Scoreboard/Scoreboard";

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const {
    teamId: userTeamId, team
  } = useUserData();
  const dbRole = useAuthData().authClaims?.dbRole ?? "public";
  // const moraleTeamName = useAppSelector((state) => state);
  const [ standingData, setStandingData ] = useState<StandingType[]>([]);
  const [ loading, setLoading ] = useState(true);
  const { navigate } = useNavigation<SpiritStackScreenProps<"Scoreboard">["navigation"]>();

  const refresh = useCallback(() => {
    setLoading(true);
    // switch (pointType) {
    // case "spirit":
    firebaseFirestore().doc("spirit/teams").get()
      .then((querySnapshot) => {
        const rootTeamDataJson = querySnapshot.data() as unknown;
        if (!SpiritTeamsRootDoc.isSpiritTeamsRootDocJson(rootTeamDataJson)) {
          throw new Error("Invalid data type");
        } else {
          const rootTeamData = SpiritTeamsRootDoc.fromJson(rootTeamDataJson);
          setStandingData(Object.entries(rootTeamData.basicInfo).filter(([ ,{ teamClass } ]) => teamClass === "committee" ? dbRole === "committee" : true).map(([ teamId, teamData ]) => {
            return {
              id: teamId,
              highlighted: teamId === userTeamId,
              name: teamData.name,
              points: teamData.totalPoints ?? 0
            };
          }));
        }
      })
      .catch(universalCatch)
      .finally(() => setLoading(false));
    // break;

    // case "morale":
    //   firebaseFirestore().collection("marathon/2022/morale-teams").get()
    //     .then(
    //       (querySnapshot) => {
    //         const tempStandingData: StandingType[] = [];
    //         querySnapshot.forEach((document) => {
    //           const teamData = document.data() as FirestoreMoraleTeam;
    //           tempStandingData.push({
    //             id: document.id,
    //             name: `Team #${teamData.teamNumber}:\n${teamData.leaders}`,
    //             points: teamData.points,
    //             highlighted: false // moraleTeamId === teamData.teamNumber,
    //           });
    //         });
    //         setStandingData(tempStandingData);
    //       }
    //     )
    //     .catch(universalCatch);
    //   break;

    // case undefined:
    //   setStandingData([]);
    //   break;

    // default:
    //   showMessage("Failed to load valid point type configuration");
    //   break;
    // }
  }, [ dbRole, userTeamId ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ScrollView
      showsVerticalScrollIndicator
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      <SafeAreaView>
        <VStack>
          {
            team == null
              ? (<Jumbotron
                title="You are not part of a team"
                text=""
                subtitle="If you believe this is an error and you have submitted your spirit points, please contact your team captain or the DanceBlue committee."
                icon="users"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                iconType={FontAwesome5}
                iconColor="blue.500"
              />)
              : (
                <Pressable
                  onPress={() => {
                    navigate("MyTeam");
                  }}
                  _pressed={{ opacity: 0.5 }}
                >
                  <JumbotronTeam team={team.name} />
                </Pressable>
              )
          }
          <Scoreboard title="Spirit Points" data={standingData}/>
        </VStack>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

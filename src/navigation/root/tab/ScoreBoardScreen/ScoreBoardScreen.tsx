import firebaseFirestore from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";

import Standings from "../../../../common/components/Standings";
import { universalCatch } from "../../../../common/logging";
import { useAuthData, useUserData } from "../../../../context";
import { SpiritTeamsRootDoc } from "../../../../types/SpiritTeamsRootDoc";
import { StandingType } from "../../../../types/StandingType";

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const { teamId: userTeamId } = useUserData();
  const dbRole = useAuthData().authClaims?.dbRole ?? "public";
  // const moraleTeamName = useAppSelector((state) => state);
  const [ standingData, setStandingData ] = useState<StandingType[]>([]);
  const [ loading, setLoading ] = useState(true);

  const refresh = useCallback(() => {
    // switch (pointType) {
    // case "spirit":
    firebaseFirestore().doc("spirit/teams").get()
      .then((querySnapshot) => {
        const rootTeamData = querySnapshot.data() as SpiritTeamsRootDoc;
        setStandingData(Object.entries(rootTeamData.basicInfo).filter(([ ,{ teamClass } ]) => teamClass === "committee" ? dbRole === "committee" : true).map(([ teamId, teamData ]) => {
          return {
            id: teamId,
            highlighted: teamId === userTeamId,
            name: teamData.name,
            points: teamData.totalPoints ?? 0
          };
        }));
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
        <Standings titleText="Spirit Point Standings" standingData={standingData} startExpanded />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

// import firebaseFirestore from "@react-native-firebase/firestore";
// import { useCallback, useState } from "react";
// import { RefreshControl, SafeAreaView, ScrollView } from "react-native";

// import { useAppSelector } from "../../../../common/CustomHooks";
// import Standings from "../../../../common/components/Standings";
// import { FirestoreTeam } from "../../../../common/firestore/teams";
// import { showMessage } from "../../../../common/util/AlertUtils";
// import { FirestoreMoraleTeam } from "../../../../types/FirebaseTypes";
// import { StandingType } from "../../../../types/StandingType";

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  return null;
  // const { pointType } = useAppSelector((state) => state.appConfig.scoreboardMode);
  // const userTeamName = useAppSelector((state) => state.userData.team?.name);
  // // const moraleTeamName = useAppSelector((state) => state);
  // const [ standingData, setStandingData ] = useState<StandingType[]>([]);
  // const [ loading, setLoading ] = useState(true);

  // const refresh = useCallback(() => {
  //   switch (pointType) {
  //   case "spirit":
  //     firebaseFirestore().collection("teams").get()
  //       .then((querySnapshot) => {
  //         const tempStandingData: StandingType[] = [];
  //         querySnapshot.forEach((document) => {
  //           const teamData = document.data() as FirestoreTeam;
  //           // Ensure we don't show the test team on the scoreboard
  //           if (teamData.spiritSpreadsheetId && document.id !== "jR29Y3wJ59evnRaWWKC4") {
  //             tempStandingData.push({
  //               id: document.id,
  //               name: teamData.name,
  //               points: teamData.totalSpiritPoints ?? 0,
  //               highlighted: userTeamName === teamData.name,
  //             });
  //           }
  //         });
  //         setStandingData(tempStandingData);
  //       }).catch(universalCatch);
  //     break;

  //   case "morale":
  //     firebaseFirestore().collection("marathon/2022/morale-teams").get()
  //       .then(
  //         (querySnapshot) => {
  //           const tempStandingData: StandingType[] = [];
  //           querySnapshot.forEach((document) => {
  //             const teamData = document.data() as FirestoreMoraleTeam;
  //             tempStandingData.push({
  //               id: document.id,
  //               name: `Team #${teamData.teamNumber}:\n${teamData.leaders}`,
  //               points: teamData.points,
  //               highlighted: false // moraleTeamId === teamData.teamNumber,
  //             });
  //           });
  //           setStandingData(tempStandingData);
  //         }
  //       ).catch(universalCatch);
  //     break;

  //   case undefined:
  //     setStandingData([]);
  //     break;

  //   default:
  //     showMessage("Failed to load valid point type configuration");
  //     break;
  //   }
  //   return () => {
  //     setLoading(false);
  //   };
  // }, [ pointType, userTeamName ]);

  // return (
  //   <ScrollView
  //     showsVerticalScrollIndicator
  //     refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
  //   >
  //     <SafeAreaView>
  //       <Standings titleText="Spirit Point Standings" standingData={standingData} startExpanded />
  //     </SafeAreaView>
  //   </ScrollView>
  // );
};

export default ScoreBoardScreen;

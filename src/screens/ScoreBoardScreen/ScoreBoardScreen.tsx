import firebaseFirestore from "@react-native-firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";

import { useAppSelector } from "../../common/CustomHooks";
import Standings from "../../common/components/Standings";
import { showMessage } from "../../common/util/AlertUtils";
import { globalStyles } from "../../theme";
import { FirestoreMoraleTeam, FirestoreTeam } from "../../types/FirebaseTypes";
import { StandingType } from "../../types/StandingType";

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const { pointType } = useAppSelector((state) => state.appConfig.scoreboardMode);
  const userTeamId = useAppSelector((state) => state.userData.teamId);
  const [ standingData, setStandingData ] = useState<StandingType[]>([]);
  const [ refreshing, setRefreshing ] = useState<boolean>(true);

  const shouldUpdateState = useRef(true);

  const refresh = useCallback(() => {
    setRefreshing(true);
    switch (pointType) {
    case "spirit":
      void firebaseFirestore().collection("teams").get()
        .then((querySnapshot) => {
          const tempStandingData: StandingType[] = [];
          querySnapshot.forEach((document) => {
            const teamData = document.data() as FirestoreTeam;
            // Ensure we don't show the test team on the scoreboard
            if (teamData.spiritSpreadsheetId && document.id !== "jR29Y3wJ59evnRaWWKC4") {
              tempStandingData.push({
                id: document.id,
                name: teamData.name,
                points: teamData.totalSpiritPoints ?? 0,
                highlighted: userTeamId === document.id,
              });
            }
          });
          if (shouldUpdateState.current) {
            setStandingData(tempStandingData);
            setRefreshing(false);
          }
        });
      break;

    case "morale":
      void firebaseFirestore().collection("marathon/2022/morale-teams").get()
        .then(
          (querySnapshot) => {
            const tempStandingData: StandingType[] = [];
            querySnapshot.forEach((document) => {
              const teamData = document.data() as FirestoreMoraleTeam;
              tempStandingData.push({
                id: document.id,
                name: `Team #${teamData.teamNumber}:\n${teamData.leaders}`,
                points: teamData.points,
                highlighted: false // moraleTeamId === teamData.teamNumber,
              });
            });
            if (shouldUpdateState.current) {
              setStandingData(tempStandingData);
              setRefreshing(false);
            }
          }
        );
      break;

    case undefined:
      if (shouldUpdateState.current) {
        setStandingData([]);
        setRefreshing(false);
      }
      break;

    default:
      showMessage("Failed to load valid point type configuration");
      break;
    }
    return () => {
      shouldUpdateState.current = false;
      setRefreshing(false);
    };
  }, [ pointType, userTeamId ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ScrollView
      showsVerticalScrollIndicator
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <SafeAreaView style={globalStyles.genericView}>
        <Standings titleText="Spirit Point Standings" standingData={standingData} startExpanded />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

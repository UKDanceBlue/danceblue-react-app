/// <reference types="react" />
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { useAppSelector } from '../../common/CustomHooks';
import Standings from '../../common/components/Standings';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { globalColors, globalStyles } from '../../theme';
import { StandingType } from '../../types/StandingType';
import { showMessage } from '../../common/AlertUtils';
import { FirestoreMoraleTeam, FirestoreTeam } from '../../types/FirebaseTypes';

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const { pointType } = { pointType: 'morale' }; // useAppSelector((state) => state.appConfig.scoreboard);
  const userTeamId = useAppSelector((state) => state.auth.teamId);
  const moraleTeamId = useAppSelector((state) => state.auth.moraleTeamId);
  const [standingData, setStandingData] = useState<StandingType[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const refresh = useCallback(() => {
    setRefreshing(true);
    let shouldUpdateState = true;

    switch (pointType) {
      case 'spirit':
        getDocs(collection(firebaseFirestore, 'teams')).then((querySnapshot) => {
          const tempStandingData: StandingType[] = [];
          querySnapshot.forEach((document) => {
            const teamData = document.data() as FirestoreTeam;
            // Ensure we don't show the test team on the scoreboard
            if (teamData.spiritSpreadsheetId && document.id !== 'jR29Y3wJ59evnRaWWKC4') {
              tempStandingData.push({
                id: document.id,
                name: teamData.name,
                points: teamData.totalSpiritPoints || 0,
                highlighted: userTeamId === document.id,
              });
            }
          });
          if (shouldUpdateState) {
            setStandingData(tempStandingData);
            setRefreshing(false);
          }
        });
        break;

      case 'morale':
        getDocs(collection(firebaseFirestore, 'marathon', '2022/morale-teams')).then(
          (querySnapshot) => {
            const tempStandingData: StandingType[] = [];
            querySnapshot.forEach((document) => {
              const teamData = document.data() as FirestoreMoraleTeam;
              tempStandingData.push({
                id: document.id,
                name: `Team #${teamData.teamNumber}:\n${teamData.leaders}`,
                points: teamData.points,
                highlighted: moraleTeamId === teamData.teamNumber,
              });
            });
            if (shouldUpdateState) {
              setStandingData(tempStandingData);
              setRefreshing(false);
            }
          }
        );
        break;

      default:
        showMessage('Failed to load valid point type configuration');
        break;
    }
    return () => {
      shouldUpdateState = false;
      setRefreshing(false);
    };
  }, [pointType, moraleTeamId, userTeamId]);

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

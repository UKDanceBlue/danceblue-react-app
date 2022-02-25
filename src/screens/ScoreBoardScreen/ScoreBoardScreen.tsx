/// <reference types="react" />
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
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
  const userLinkblue = useAppSelector((state) => state.auth.linkblue);
  const [standingData, setStandingData] = useState<StandingType[]>([]);

  useEffect(() => {
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
                name: teamData.leaders,
                points: teamData.points,
                highlighted: !!(userLinkblue && teamData.members[userLinkblue]),
              });
            });
            if (shouldUpdateState) {
              setStandingData(tempStandingData);
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
    };
  }, [pointType, userLinkblue, userTeamId]);

  return (
    <ScrollView showsVerticalScrollIndicator>
      <SafeAreaView style={globalStyles.genericView}>
        {standingData.length === 0 && (
          <ActivityIndicator
            size="large"
            color={globalColors.lightBlue}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          />
        )}
        <Standings titleText="Spirit Point Standings" standingData={standingData} startExpanded />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

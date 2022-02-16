/// <reference types="react" />
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { useAppSelector } from '../../common/CustomHooks';
import Standings from '../../common/components/Standings';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { globalColors, globalStyles } from '../../theme';
import { StandingType } from '../../types/StandingType';

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const userTeamId = useAppSelector((state) => state.auth.teamId);
  const [standingData, setStandingData] = useState<StandingType[]>([]);

  useEffect(() => {
    let shouldUpdateState = true;
    getDocs(collection(firebaseFirestore, 'teams')).then((querySnapshot) => {
      const tempStandingData: StandingType[] = [];
      querySnapshot.forEach((document) => {
        const teamData = document.data();
        // Ensure we don't show the test team on the scoreboard
        if (teamData.spiritSpreadsheetId && document.id !== 'jR29Y3wJ59evnRaWWKC4') {
          tempStandingData.push({
            id: document.id,
            name: teamData.name,
            points: teamData.totalSpiritPoints,
            highlighted: userTeamId === document.id,
          });
        }
      });
      if (shouldUpdateState) {
        setStandingData(tempStandingData);
      }
    });
    return () => {
      shouldUpdateState = false;
    };
  }, [userTeamId]);

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

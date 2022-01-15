import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import Standings from '../../common/components/Standings';
import { firebaseFirestore } from '../../common/FirebaseApp';
import { globalStyles } from '../../theme';

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const userTeamId = useSelector((state) => state.auth.teamId);
  const [standingData, setStandingData] = useState([]);

  useEffect(() => {
    let shouldUpdateState = true;
    getDocs(collection(firebaseFirestore, 'teams')).then((querySnapshot) => {
      const tempStandingData = [];
      querySnapshot.forEach((document) => {
        const teamData = document.data();
        if (teamData.spiritSpreadsheetId) {
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
        <Standings titleText="Spirit Point Standings" standingData={standingData} startExpanded />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

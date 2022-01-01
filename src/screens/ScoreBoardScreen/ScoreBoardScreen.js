import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Standings from '../../common/components/Standings';
import { firebaseAuth, firebaseFirestore } from '../../common/FirebaseApp';
import { globalStyles } from '../../theme';

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const [userTeamId, setUserTeamId] = useState();
  const [standingData, setStandingData] = useState([]);

  // Add an observer that sets the User object anytime the auth state changes
  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, (newUser) => {
        if (newUser?.uid) {
          getDoc(doc(firebaseFirestore, 'users', newUser.uid)).then((userSnapshot) => {
            if (userSnapshot.data()?.team) {
              setUserTeamId(userSnapshot.data()?.team.id);
            }
          });
        }
      }),
    []
  );

  useEffect(
    () =>
      getDocs(collection(firebaseFirestore, 'teams')).then((querySnapshot) => {
        const tempStandingData = [];
        querySnapshot.forEach((document) => {
          const teamData = document.data();
          tempStandingData.push({
            id: document.id,
            name: teamData.name,
            points: teamData.totalSpiritPoints,
            highlighted: userTeamId === document.id,
          });
        });
        setStandingData(tempStandingData);
      }),
    [userTeamId]
  );

  return (
    <ScrollView showsVerticalScrollIndicator>
      <SafeAreaView style={globalStyles.genericView}>
        <Standings titleText="Spirit Point Standings" standingData={standingData} startExpanded />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

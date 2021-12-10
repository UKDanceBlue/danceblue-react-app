import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Standings from '../../common/components/Standings';
import { firebaseAuth, firebaseFirestore } from '../../firebase/FirebaseApp';
import { globalStyles } from '../../theme';

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const [userTeam, setUserTeam] = useState();
  const [standingData, setStandingData] = useState([]);

  // Add an observer that sets the User object anytime the auth state changes
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (newUser) => {
      if (newUser?.uid) {
        getDoc(doc(firebaseFirestore, 'users', newUser.uid)).then((userSnapshot) => {
          if (userSnapshot.data()?.team) {
            getDoc(userSnapshot.data().team).then((teamSnapshot) =>
              setUserTeam(teamSnapshot.data())
            );
          }
        });
      }
    });
  }, []);

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
            highlighted: userTeam?.name === document.id,
          });
        });
        setStandingData(tempStandingData);
      }),
    [userTeam]
  );

  return (
    <ScrollView showsVerticalScrollIndicator>
      <SafeAreaView style={globalStyles.genericView}>
        <Standings standingData={standingData} expandable />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

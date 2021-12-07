import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Standings from './Standings';
import { firebaseAuth, firebaseFirestore } from '../../firebase/FirebaseApp';

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const [user, setUser] = useState();
  const [userTeam, setUserTeam] = useState();
  const [standingData, setStandingData] = useState([]);
  const [standingInvalidation, setStandingInvalidation] = useState(0);

  useEffect(() => onAuthStateChanged(firebaseAuth, setUser), []);

  useEffect(() => {
    async function refresh() {
      if (user?.uid) {
        const userSnapshot = await getDoc(doc(firebaseFirestore, 'users', user.uid));
        if (userSnapshot.data()?.team) {
          const teamSnapshot = await getDoc(userSnapshot.data().team);
          setUserTeam(teamSnapshot.data().name);
        }
      }

      const tempStandingData = [];
      const querySnapshot = await getDocs(collection(firebaseFirestore, 'teams'));
      querySnapshot.forEach((document) => {
        tempStandingData.push({
          id: document.id,
          name: document.data().name,
          points: document.data().totalSpiritPoints,
        });
      });
      setStandingData(tempStandingData);
    }
    refresh();
  }, [user, standingInvalidation]);

  return (
    <ScrollView showsVerticalScrollIndicator>
      <SafeAreaView style={{ flex: 1 }}>
        <Standings
          standingData={standingData}
          expandable
          highlightedId={userTeam?.name}
          refreshCallback={() => setStandingInvalidation(standingInvalidation + 1)}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ScoreBoardScreen;

// Import third-party dependencies
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Standings from '../../common/components/Standings';
import { firebaseAuth, firebaseFirestore } from '../../firebase/FirebaseApp';
import { globalStyles } from '../../theme';

/**
 * A screen shown to users with an assigned team that display's their teams fundriaising total, and spirit point numbers
 */
const TeamScreen = () => {
  const [user, setUser] = useState();
  const [standingData, setStandingData] = useState([]);
  const [fundraisingTotal, setFundraisingTotal] = useState(0);

  // Add an observer that sets the User object anytime the auth state changes
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (newUser) => {
      if (newUser?.uid) {
        getDoc(doc(firebaseFirestore, 'users', newUser.uid)).then((userSnapshot) => {
          setUser(userSnapshot.data());
        });
      }
    });
  }, []);

  useEffect(() => {
    // 1. Get the users on this team with a query
    // 2. Create an object that maps a linkblue to a name
    // 3. Get the individualSpiritPoints document and iterate through it to
    //    create a tempStandingData, adding any name and point value it can
    //    get for the linkblue IDs in the document, highlighting the current user's
    // 4. setStandingData()
    // 5. Get the fundraisngTotal document and setFundraisingTotal()
  }, [user]);

  return (
    <ScrollView showsVerticalScrollIndicator>
      <SafeAreaView style={globalStyles.genericView}>
        <Text>Fundraising total: {fundraisingTotal}</Text>
        <Standings titleText="Team Spirit Points" standingData={standingData} startExpanded />
      </SafeAreaView>
    </ScrollView>
  );
};

export default TeamScreen;

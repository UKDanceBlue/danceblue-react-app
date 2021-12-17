// Import third-party dependencies
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { getDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { handleFirebaeError } from '../../common/AlertUtils';
import Standings from '../../common/components/Standings';
import { firebaseAuth, firebaseFirestore } from '../../firebase/FirebaseApp';
import { globalStyles, globalTextStyles } from '../../theme';

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
    // Only run if the user has already been set
    if (user) {
      // Go ahead and set up some collection references
      const usersRef = collection(firebaseFirestore, 'users');
      const teamConfidentialRef = collection(firebaseFirestore, `${user.team.path}/confidential`);

      // Load an object to map linkblue IDs to names if a user has logged in before
      const linkBlueToName = {};
      const teamUsersQuery = query(usersRef, where('team', '==', user.team));
      getDocs(teamUsersQuery)
        .then((teamMembers) => {
          teamMembers.forEach((teamMemberSnapshot) => {
            const teamMember = teamMemberSnapshot.data();
            linkBlueToName[teamMember.linkblue] = teamMember.name;
          });

          // Get the spirit point data from the confidential collection
          const tempStandingData = [];
          getDoc(doc(teamConfidentialRef, 'individualSpiritPoints'))
            .then((individualSpiritPoints) => {
              // Iterate through every record in the team's collection
              Object.entries(individualSpiritPoints.data()).forEach((record) => {
                const [recordLinkblue, recordPoints] = record;
                if (linkBlueToName[recordLinkblue]) {
                  // Add the information from each team to the temporary standingData object
                  tempStandingData.push({
                    id: recordLinkblue,
                    // This is neccecary because we only get the user's name once they have logged in; this is not optimal
                    name: linkBlueToName[recordLinkblue]
                      ? linkBlueToName[recordLinkblue]
                      : recordLinkblue,
                    points: recordPoints,
                    highlighted: recordLinkblue === user.linkblue,
                  });
                }
              });
              // Once all the data has been loaded in, we can update the state
              setStandingData(tempStandingData);
            })
            .catch(handleFirebaeError);
        })
        .catch(handleFirebaeError);

      // Load the fundraising total
      getDoc(doc(teamConfidentialRef, 'fundraising'))
        .then((fundraising) => setFundraisingTotal(fundraising.get('total')))
        .catch(handleFirebaeError);
    }
  }, [user]);

  return (
    <ScrollView showsVerticalScrollIndicator>
      <SafeAreaView style={globalStyles.genericView}>
        <Text style={globalTextStyles.headerText}>Fundraising total: {fundraisingTotal}</Text>
        <Standings titleText="Team Spirit Points" standingData={standingData} startExpanded />
      </SafeAreaView>
    </ScrollView>
  );
};

export default TeamScreen;

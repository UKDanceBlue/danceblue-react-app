// Import third-party dependencies
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { getDoc, doc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { handleFirebaeError } from '../../common/AlertUtils';
import Standings from '../../common/components/Standings';
import { firebaseAuth, firebaseFirestore } from '../../common/FirebaseApp';
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
      if (user.team) {
        // Go ahead and set up some collection references
        const teamConfidentialRef = collection(firebaseFirestore, `${user.team.path}/confidential`);

        getDoc(user.team)
          .then((userTeam) => {
            // Get the user's teammate's names from firebase
            const teamMemberNames = userTeam.get('members');

            // Get the spirit point data from the confidential collection
            const tempStandingData = [];
            getDoc(doc(teamConfidentialRef, 'individualSpiritPoints'))
              .then((individualSpiritPoints) => {
                // Iterate through every record in the team's collection
                Object.entries(individualSpiritPoints.data()).forEach((record) => {
                  const [recordLinkblue, recordPoints] = record;
                  // Add the information from each team to the temporary standingData object
                  tempStandingData.push({
                    id: recordLinkblue,
                    // Fallback in the unlikley case we don't have the team member's name
                    name: teamMemberNames[recordLinkblue]
                      ? teamMemberNames[recordLinkblue]
                      : recordLinkblue,
                    points: recordPoints,
                    highlighted: recordLinkblue === user.linkblue,
                  });
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
      } else {
        setStandingData(null);
        setFundraisingTotal(null);
      }
    }
  }, [user]);

  return (
    <View style={globalStyles.genericView}>
      {(!user || user.isAnonymous) && (
        <Text style={globalTextStyles.headerText}>
          You are logged out, if you are on a team log in to see your standings and fundraising
          information
        </Text>
      )}
      {user && !user.isAnonymous && (
        <ScrollView showsVerticalScrollIndicator>
          <SafeAreaView style={globalStyles.genericView}>
            {fundraisingTotal && (
              <Text style={globalTextStyles.headerText}>
                Fundraising total: $
                {
                  /* Format as decimal */ fundraisingTotal
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
              </Text>
            )}
            {standingData && (
              <Standings titleText="Team Spirit Points" standingData={standingData} startExpanded />
            )}
            {!standingData && !fundraisingTotal && <Text>You are not on a team</Text>}
          </SafeAreaView>
        </ScrollView>
      )}
    </View>
  );
};

export default TeamScreen;

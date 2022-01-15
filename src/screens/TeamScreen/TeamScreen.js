// Import third-party dependencies
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Standings from '../../common/components/Standings';
import { globalStyles, globalTextStyles } from '../../theme';

/**
 * A screen shown to users with an assigned team that display's their teams fundriaising total, and spirit point numbers
 */
const TeamScreen = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAnonymous = useSelector((state) => state.auth.isAnonymous);
  const linkblue = useSelector((state) => state.auth.linkblue);
  const teamMemberNames = useSelector((state) => state.auth.team.members);
  const fundraisingTotal = useSelector((state) => state.auth.teamFundraisingTotal);
  const teamIndividualSpiritPoints = useSelector((state) => state.auth.teamIndividualSpiritPoints);
  const [standingData, setStandingData] = useState([]);

  useEffect(() => {
    let shouldUpdateState = true;
    // Only run if the user has already been set
    if (teamIndividualSpiritPoints) {
      // Get the spirit point data from the confidential collection
      const tempStandingData = [];
      // Iterate through every record in the team's collection
      Object.entries(teamIndividualSpiritPoints).forEach((record) => {
        const [recordLinkblue, recordPoints] = record;
        // Add the information from each team to the temporary standingData object
        tempStandingData.push({
          id: recordLinkblue,
          // Fallback in the unlikley case we don't have the team member's name
          name: teamMemberNames[recordLinkblue] ? teamMemberNames[recordLinkblue] : recordLinkblue,
          points: recordPoints,
          highlighted: recordLinkblue === linkblue,
        });
      });
      if (shouldUpdateState) {
        // Once all the data has been loaded in, we can update the state
      }
      setStandingData(tempStandingData);
    } else if (shouldUpdateState) {
      setStandingData(null);
    }
    return () => {
      shouldUpdateState = false;
    };
  }, [linkblue, teamIndividualSpiritPoints, teamMemberNames]);

  return (
    <View style={globalStyles.genericView}>
      {(!isLoggedIn || isAnonymous) && (
        <Text style={globalTextStyles.headerText}>
          You are logged out, if you are on a team log in to see your standings and fundraising
          information
        </Text>
      )}
      {isLoggedIn && !isAnonymous && (
        <ScrollView showsVerticalScrollIndicator>
          <SafeAreaView style={globalStyles.genericView}>
            {fundraisingTotal.total && (
              <Text style={globalTextStyles.headerText}>
                Fundraising total: $
                {
                  /* Format as decimal */ fundraisingTotal.total
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
              </Text>
            )}
            {!!standingData && (
              <Standings titleText="Team Spirit Points" standingData={standingData} startExpanded />
            )}
            {!standingData && !fundraisingTotal && (
              <Text>
                You are not on a team, if this is incorrect please reach out to your team leader.
              </Text>
            )}
          </SafeAreaView>
        </ScrollView>
      )}
    </View>
  );
};

export default TeamScreen;

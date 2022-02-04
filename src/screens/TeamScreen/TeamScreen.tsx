// Import third-party dependencies
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useAppSelector } from '../../common/CustomHooks';
import Standings from '../../common/components/Standings';
import { globalStyles, globalTextStyles } from '../../theme';
import { StandingType } from '../../types/StandingType';

/**
 * A screen shown to users with an assigned team that display's their teams fundraising total, and spirit point numbers
 */
const TeamScreen = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const isAnonymous = useAppSelector((state) => state.auth.isAnonymous);
  const linkblue = useAppSelector((state) => state.auth.linkblue);
  const userTeam = useAppSelector((state) => state.auth.team);
  const fundraisingTotal = useAppSelector((state) => state.auth.teamFundraisingTotal);
  const teamIndividualSpiritPoints = useAppSelector(
    (state) => state.auth.teamIndividualSpiritPoints
  );
  const [standingData, setStandingData] = useState<StandingType[]>([]);

  useEffect(() => {
    let shouldUpdateState = true;
    // Only run if the user has already been set
    if (teamIndividualSpiritPoints) {
      // Get the spirit point data from the confidential collection
      const tempStandingData: StandingType[] = [];
      // Iterate through every record in the team's collection
      Object.entries(teamIndividualSpiritPoints).forEach((record) => {
        const [recordLinkblue, recordPoints] = record;
        // Add the information from each team to the temporary standingData object
        tempStandingData.push({
          id: recordLinkblue,
          // Fallback in the unlikely case we don't have the team member's name
          name: userTeam?.members[recordLinkblue]
            ? userTeam.members[recordLinkblue]
            : recordLinkblue,
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
  }, [linkblue, teamIndividualSpiritPoints, userTeam]);

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

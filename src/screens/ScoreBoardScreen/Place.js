/* eslint-disable no-nested-ternary */
// Import third-party dependencies
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { globalColors, globalStyles, globalTextStyles } from '../../theme';

/**
 * A row-based component showing a team name, their rank (if applicable), and their points
 * @param {bool} isHighlighted Is this row highlighted
 * @param {number} rank The rank to show (if any)
 * @param {string} teamName The team's name
 * @param {number} teamNumber The team's ID number
 * @param {number} points Earned points
 * @param {number} key [UNUSED]
 * @param {number} size How many members on the team [UNUSED]
 * @param {bool} showScoresByTeam Should score be shown by the team?  [UNUSED]
 * @param {bool} showPointsPerMember Should per-member points be displayed?
 * @param {number} pointsPerMember How many points were earned per member
 */
const Place = ({
  isHighlighted,
  rank,
  teamName,
  teamNumber,
  showPointsPerMember,
  points,
  pointsPerMember,
}) => {
  // The 'top3Icon function adds an award icon to the top 3 teams
  const top3Icon = (rankForIcon) => {
    switch (rankForIcon) {
      case 1:
        return <FontAwesome5 name="award" size={30} color="gold" />;
      case 2:
        return <FontAwesome5 name="award" size={30} color="silver" />;
      case 3:
        return <FontAwesome5 name="award" size={30} color="blue" />;
      default:
        return null;
    }
  };
  return (
    // Renders the individual row of the leaderboard for each team
    <View
      style={
        isHighlighted
          ? StyleSheet.compose(globalStyles.genericRow, {
              backgroundColor: globalColors.lightBlue,
            })
          : globalStyles.genericRow
      }
    >
      <View style={globalStyles.genericRowLeft}>
        <Text style={localStyles.place}>
          {/* Renders the rank/place of the team */}
          {rank}
        </Text>
        {/* Calls the top3Icon function */}
        {top3Icon(rank)}
      </View>
      <View style={globalStyles.genericRowCenter}>
        <Text style={localStyles.name}>
          {/* Renders the team name */}
          {teamName}
        </Text>
        <Text style={globalTextStyles.italicText}>
          {/* Renders the team number */}
          {teamNumber}
        </Text>
      </View>
      <View style={globalStyles.genericRowRight}>
        <Text style={localStyles.points}>
          {/* Renders the number of points earned */}
          {showPointsPerMember ? (pointsPerMember < 1 ? '< 1 ' : pointsPerMember) : points}
          {showPointsPerMember ? ' points' : points === 1 ? ' point' : ' points'}
        </Text>
      </View>
    </View>
  );
};

const localStyles = {
  place: StyleSheet.compose(globalTextStyles.boldText, {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
  }),
  name: StyleSheet.compose(globalTextStyles.boldText, {
    fontSize: 15,
  }),
  points: StyleSheet.compose(globalTextStyles.boldText, {
    paddingRight: 10,
    fontSize: 17,
  }),
};

export default Place;

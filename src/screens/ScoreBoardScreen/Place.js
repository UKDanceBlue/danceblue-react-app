/* eslint-disable no-nested-ternary */
// Import third-party dependencies
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

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
    if (rankForIcon === 1) {
      return <FontAwesome5 name="award" size={30} color="gold" />;
    }
    if (rankForIcon === 2) {
      return <FontAwesome5 name="award" size={30} color="silver" />;
    }
    if (rankForIcon === 3) {
      return <FontAwesome5 name="award" size={30} color="blue" />;
    }
    return null;
  };
  return (
    // Renders the individual row of the leaderboard for each team
    <View style={isHighlighted ? styles.highlightedRow : styles.row}>
      <View style={styles.left}>
        <Text style={styles.place}>
          {/* Renders the rank/place of the team */}
          {rank}
        </Text>
        {/* Calls the top3Icon function */}
        {top3Icon(rank)}
      </View>
      <View style={styles.middle}>
        <Text style={styles.name}>
          {/* Renders the team name */}
          {teamName}
        </Text>
        <Text style={styles.team}>
          {/* Renders the team number */}
          {teamNumber}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.bold}>
          {/* Renders the number of points earned */}
          {showPointsPerMember ? (pointsPerMember < 1 ? '< 1 ' : pointsPerMember) : points}
          {showPointsPerMember ? ' points' : points === 1 ? ' point' : ' points'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    borderBottomColor: '#999999',
  },
  highlightedRow: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    borderBottomColor: '#999999',
    backgroundColor: '#ffffc8',
  },
  left: {
    width: '20%',
    flexDirection: 'row',
  },
  right: {
    width: '30%',
    justifyContent: 'flex-end',
  },
  middle: {
    width: '50%',
    flexDirection: 'column',
  },
  place: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  bold: {
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 17,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  team: {
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
});

export default Place;

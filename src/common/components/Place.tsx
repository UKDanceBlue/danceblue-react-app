/* eslint-disable no-nested-ternary */
// Import third-party dependencies
import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { globalColors, globalStyles, globalTextStyles } from '../../theme';

/**
 * A row-based component showing a target name, their rank (if applicable), and their points
 * @param {bool} isHighlighted Is this row highlighted
 * @param {number} rank The rank to show (if any)
 * @param {string} name The target's name
 * @param {number} points Earned points
 */
const Place = ({
  isHighlighted,
  rank,
  name,
  points = 0,
}: {
  isHighlighted: boolean;
  rank: number;
  name: string;
  points: number;
}) => {
  // The 'top3Icon function adds an award icon to the top 3 targets
  const top3Icon = (rankForIcon: number): ReactElement | null => {
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
    // Renders the individual row of the leaderboard for each target
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
          {/* Renders the rank/place of the target */}
          {rank}
        </Text>
        {/* Calls the top3Icon function */}
        {top3Icon(rank)}
      </View>
      <View style={globalStyles.genericRowCenter}>
        <Text style={localStyles.name}>
          {/* Renders the target name */}
          {name}
        </Text>
        {/* <Text style={globalTextStyles.italicText}> */}
        {/* Renders the target number */}
        {/* {teamNumber} */}
        {/* </Text> */}
      </View>
      <View style={globalStyles.genericRowRight}>
        <Text style={localStyles.points}>
          {/* Renders the number of points earned */}
          {points}
          {points === 1 ? ' point' : ' points'}
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

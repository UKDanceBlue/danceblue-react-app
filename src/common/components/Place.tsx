/// <reference types="react" />
/* eslint-disable no-nested-ternary */
// Import third-party dependencies
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { globalColors } from '../../theme';

/**
 * A row-based component showing a target name, their rank (if applicable), and their points
 */
const Place = ({
  isHighlighted,
  rank,
  name,
  points = 0,
  lastRow,
}: {
  isHighlighted: boolean;
  rank: number;
  name: string;
  points: number;
  lastRow: boolean;
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
    <ListItem
      key={rank}
      bottomDivider={!lastRow}
      style={{ width: '100%', backgroundColor: globalColors.white }}
      containerStyle={{ backgroundColor: 'white' }}
    >
      <ListItem.Content style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '20%' }}>
          <Text style={{ fontSize: 20, marginLeft: 10, marginRight: 10 }}>
            {/* Renders the rank/place of the target */}
            {rank}
          </Text>
          {top3Icon(rank)}
        </View>
        <ListItem.Title
          style={{
            color: isHighlighted ? globalColors.lightBlue : undefined,
            alignSelf: 'center',
            width: '60%',
            textAlign: 'left',
            fontWeight: 'bold',
          }}
          h5
        >
          {name}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{
            color: isHighlighted ? globalColors.lightBlue : undefined,
          }}
          right
        >
          {points}
          {points === 1 ? ' point' : ' points'}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default Place;

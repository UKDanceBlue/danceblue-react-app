/// <reference types="react" />
// Import third-party dependencies
import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import { globalColors } from '../../theme';
import { firebaseAuth } from '../FirebaseApp';

/**
 * A row-based component showing a target name, their rank (if applicable), and their points
 */
const Place = ({
  isHighlighted,
  rank,
  name,
  points = 0,
  lastRow,
  dadJokeTempMagic = false,
  dadJokeTempMagicCallback = () => {},
}: {
  isHighlighted: boolean;
  rank: number;
  name: string;
  points: number;
  lastRow: boolean;
  dadJokeTempMagic?: boolean;
  dadJokeTempMagicCallback?: (arg0: boolean) => unknown;
}) => {
  const [dadJokeTempMagicIsChecked, setDadJokeTempMagicIsChecked] = useState(
    dadJokeTempMagic && isHighlighted
  );

  // The 'top3Icon function adds an award icon to the top 3 targets
  const top3Icon = (rankForIcon: number): ReactElement | null => {
    switch (rankForIcon) {
      case 1:
        return <FontAwesome5 name="trophy" size={24} color="gold" />;
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
            color: !dadJokeTempMagic && isHighlighted ? globalColors.lightBlue : undefined,
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
            color: !dadJokeTempMagic && isHighlighted ? globalColors.lightBlue : undefined,
          }}
          right
        >
          {points}
          {points === 1 ? ' point  ' : ' points  '}
        </ListItem.Subtitle>
        {dadJokeTempMagic && firebaseAuth.currentUser?.uid && (
          <ListItem.CheckBox
            checked={dadJokeTempMagicIsChecked}
            onPress={() => {
              dadJokeTempMagicCallback(!dadJokeTempMagicIsChecked);
              setDadJokeTempMagicIsChecked(!dadJokeTempMagicIsChecked);
            }}
            checkedIcon={<FontAwesome5 name="chevron-down" size={24} color="blue" />}
            uncheckedIcon={<FontAwesome5 name="chevron-up" size={24} color="black" />}
            right
          />
        )}
      </ListItem.Content>
    </ListItem>
  );
};

export default Place;

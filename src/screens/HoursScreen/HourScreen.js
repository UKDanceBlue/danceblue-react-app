import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { globalTextStyles } from '../../theme';

export default ({ route: { params } }) => {
  const { hourName, hourNumber, hourInstructions } = params;
  const [hourInstructionsText, setHourInstructionsText] = useState('');

  useEffect(() => {
    let tempHourInstructionsText = '';
    if (typeof hourInstructions === 'string') {
      tempHourInstructionsText = hourInstructions;
    } else if (Array.isArray(hourInstructions)) {
      for (let i = 0; i < hourInstructions.length; i++) {
        tempHourInstructionsText += `${i + 1}. ${hourInstructions[i]}
`;
      }
    }
    setHourInstructionsText(tempHourInstructionsText);
  }, [hourInstructions]);

  return (
    <View>
      <Text style={globalTextStyles.headerText}>{`${hourNumber + 1}. ${hourName}`}</Text>
      <Text>{hourInstructionsText}</Text>
    </View>
  );
};

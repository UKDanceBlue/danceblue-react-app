import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { globalTextStyles } from '../../theme';
import HourActivities from './HourActivities';

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export default ({ route: { params } }) => {
  const { hourName, hourNumber, hourScreenOptions } = params;
  const { hourInstructions } = hourScreenOptions;
  const [hourInstructionsText, setHourInstructionsText] = useState('');

  useEffect(() => {
    let tempHourInstructionsText = '';
    if (typeof hourInstructions === 'string') {
      tempHourInstructionsText = hourInstructions;
    } else if (Array.isArray(hourInstructions)) {
      for (let i = 0; i < hourInstructions.length; i++) {
        if (Array.isArray(hourInstructions[i])) {
          // Add a top  level instruction as the first array element
          tempHourInstructionsText += `${i + 1}. ${hourInstructions[i][0]}
`;
          // Start at the second element, assuming the first is the top level instruction
          for (let j = 1; j < hourInstructions[i].length && j - 1 < alphabet.length; j++) {
            tempHourInstructionsText += `      ${alphabet[j - 1]}. ${hourInstructions[i][j]}
`;
          }
        } else {
          tempHourInstructionsText += `${i + 1}. ${hourInstructions[i]}
`;
        }
      }
    }
    setHourInstructionsText(tempHourInstructionsText);
  }, [hourInstructions]);

  return (
    <View>
      <Text style={globalTextStyles.headerText}>{`${hourNumber + 1}. ${hourName}`}</Text>
      <Text>{hourInstructionsText}</Text>
      {HourActivities[hourNumber]}
    </View>
  );
};

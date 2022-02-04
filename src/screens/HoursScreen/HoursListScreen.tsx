import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { differenceInHours } from 'date-fns';
import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useCurrentDate } from '../../common/CustomHooks';
import { globalColors, globalTextStyles } from '../../theme';

const hourNames = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
  'Twenty',
  'Twenty-one',
  'Twenty-two',
  'Twenty-three',
  'Twenty-four',
];

const hourListKeys = [
  { key: 0 },
  { key: 1 },
  { key: 2 },
  { key: 3 },
  { key: 4 },
  { key: 5 },
  { key: 6 },
  { key: 7 },
  { key: 8 },
  { key: 9 },
  { key: 10 },
  { key: 11 },
  { key: 12 },
  { key: 13 },
  { key: 14 },
  { key: 15 },
  { key: 16 },
  { key: 17 },
  { key: 18 },
  { key: 19 },
  { key: 20 },
  { key: 21 },
  { key: 22 },
  { key: 23 },
];

const hourScreenOptionsList = [
  {
    hourInstructions: ['Start a game', 'Play a game', 'Finish the game'],
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

const HourRow = ({
  hourNumber,
  marathonHour,
  currentMinute,
}: {
  hourNumber: number;
  marathonHour: number;
  currentMinute: number;
}) => {
  const navigation = useNavigation();
  const hourName = hourNames[hourNumber];
  const hourScreenOptions = hourScreenOptionsList[hourNumber];
  const [displayedNamePart, setDisplayedNamePart] = useState('');
  const [hiddenNamePart, setHiddenNamePart] = useState('');
  const [clickable, setClickable] = useState(false);

  useEffect(() => {
    let tempDisplayedName = '';
    let tempHiddenName = '';

    let i = 0;
    if (marathonHour + 1 > hourNumber) {
      tempDisplayedName = hourName;
      setClickable(true);
    }
    // Should we check if we should start revealing this one?
    else {
      setClickable(false);
      if (marathonHour === hourNumber - 1) {
        const hourPercent = (currentMinute + 1) / 60;
        if (hourPercent > 0.75) {
          const percentNameToShow = (hourPercent - 0.75) * 4;
          const charsToShow = Math.trunc(hourName.length * percentNameToShow);
          // If we are in the last 15 minutes then show some amount of the name
          for (; i < charsToShow && i < hourName.length - 1; i++) {
            tempDisplayedName += hourName.charAt(i);
          }
        }
      }

      for (; i < hourName.length; i++) {
        tempHiddenName += '?';
      }
    }
    setDisplayedNamePart(tempDisplayedName);
    setHiddenNamePart(tempHiddenName);
  }, [currentMinute, hourName, hourNumber, marathonHour]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation?.navigate('Hour Details', { hourName, hourNumber, ...hourScreenOptions })
      }
      disabled={!clickable}
    >
      <View style={style.hourRow}>
        <Text style={StyleSheet.compose(globalTextStyles.headerText, { fontSize: 20 })}>
          {`${hourNumber + 1}.`}
        </Text>
        <Text style={StyleSheet.compose(globalTextStyles.headerText, { fontSize: 20 })}>
          {displayedNamePart}
          <BlurView intensity={0} style={{}} />
          <Text style={StyleSheet.compose(globalTextStyles.headerText, { fontSize: 20 })}>
            {hiddenNamePart}
          </Text>
        </Text>
        {clickable ? (
          <FontAwesome5 name="chevron-right" size={24} color="black" />
        ) : (
          <Text>{'      '}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default () => {
  // Using a literal date for testing purposes
  const currentDate = useMemo(() => new Date(2022, 3, 6, 11, 56, 0, 0), []); // useCurrentDate(60);
  const [marathonHour, setMarathonHour] = useState(-1);

  useEffect(() => {
    // First programmed hour is 8:00pm or 20:00
    // Marathon is March 5th and 6th, I am hardcoding this, hope that causes no issues
    // This will set the hour to a negative number if the marathon has yet to start and should be between 0 and 23 for the duration of the marathon
    let tempMarathonHour = 23 - differenceInHours(new Date(2022, 3, 6, 20, 0, 0, 0), currentDate);
    if (currentDate.getMinutes() === 0) {
      tempMarathonHour++;
    }
    setMarathonHour(tempMarathonHour);
  }, [currentDate]);

  return (
    <View>
      {marathonHour < 0 && (
        <Text>
          I don&apos;t know how you made it here, but you should not have been able to. Please
          report this issue to the DanceBlueCommittee
        </Text>
      )}
      {marathonHour >= 0 && (
        <FlatList
          data={hourListKeys}
          renderItem={(itemInfo) => (
            <HourRow
              hourNumber={itemInfo.item.key}
              marathonHour={marathonHour}
              currentMinute={currentDate.getMinutes()}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#000',
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  hourRow: {
    alignItems: 'center',
    backgroundColor: globalColors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: 30,
  },
});

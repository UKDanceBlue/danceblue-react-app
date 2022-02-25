import { useNavigation } from '@react-navigation/native';
import { differenceInHours } from 'date-fns';
import { BlurView } from 'expo-blur';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image, ListItem, Text } from 'react-native-elements';
import Lightbox from 'react-native-lightbox-v2';
import { useCachedFiles } from '../../common/CacheUtils';
import { useAppSelector, useCurrentDate } from '../../common/CustomHooks';
import { globalColors } from '../../theme';
import { FirestoreHour } from '../../types/FirebaseTypes';
import { TabScreenProps } from '../../types/NavigationTypes';

interface FirestoreHourWithKey extends FirestoreHour {
  key: number;
}

const HourRow = ({
  firestoreHour,
  marathonHour,
  currentMinute,
}: {
  firestoreHour: FirestoreHour;
  marathonHour: number;
  currentMinute: number;
}) => {
  const { name: hourName, hourNumber } = firestoreHour;
  const navigation = useNavigation<TabScreenProps<'HoursScreen'>['navigation']>();
  const [displayedNamePart, setDisplayedNamePart] = useState('');
  const [hiddenNamePart, setHiddenNamePart] = useState('');
  const [clickable, setClickable] = useState(false);

  // TODO change this so ti looks like wordle and reveals random letters up to half of the name; whole name at the hour so reveal stays fresh
  // Maybe choose which to reveal based on hash of name? Need to be the same every time
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
    <ListItem
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      onPress={
        clickable ? () => navigation?.navigate('Hour Details', { firestoreHour }) : undefined
      }
      disabled={!clickable}
      key={hourNumber}
    >
      <ListItem.Content style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Text h4>{`${hourNumber + 1}. `}</Text>
        <Text h4>
          {displayedNamePart}
          <View>
            <Text h4>{hiddenNamePart}</Text>
            <BlurView style={StyleSheet.absoluteFill} tint="light" intensity={30} />
          </View>
        </Text>
      </ListItem.Content>
      {clickable && <ListItem.Chevron tvParallaxProperties={undefined} />}
    </ListItem>
  );
};

const HoursListScreen = () => {
  const firestoreHours = useAppSelector((state) => state.appConfig.marathonHours);
  const [firestoreHoursWithKeys, setFirestoreHoursWithKeys] = useState<FirestoreHourWithKey[]>([]);
  // Using a literal date for testing purposes
  const currentDate = useMemo(() => new Date(2022, 3, 6, 11, 56, 0, 0), []); // useCurrentDate(60);
  const [marathonHour, setMarathonHour] = useState(-1);
  const { width: screenWidth } = useWindowDimensions();
  const [mapOfMemorial] = useCachedFiles([
    {
      assetId: 'DB22 Memorial Map',
      googleUri: 'gs://react-danceblue.appspot.com/marathon/2022/maps/Overall Map.png',
      freshnessTime: 86400,
      base64: true,
    },
  ]);

  useEffect(() => {
    setFirestoreHoursWithKeys(
      firestoreHours.map((firestoreHour) => ({
        key: firestoreHour.hourNumber,
        ...firestoreHour,
      }))
    );
  }, [firestoreHours]);

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
          report this issue to the DanceBlue Committee
        </Text>
      )}
      {marathonHour >= 0 && (
        <>
          {mapOfMemorial && (
            <Lightbox>
              <Image
                style={{ width: screenWidth, height: screenWidth * (1194 / 1598) }}
                source={{ uri: `data:image/png;base64,${mapOfMemorial}` }}
              />
            </Lightbox>
          )}
          <FlatList
            data={firestoreHoursWithKeys.sort((a, b) => a.key - b.key)}
            renderItem={(itemInfo) => (
              <HourRow
                firestoreHour={itemInfo.item}
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
        </>
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

export default HoursListScreen;

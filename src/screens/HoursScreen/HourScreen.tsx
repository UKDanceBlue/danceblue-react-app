import { useEffect, useState } from 'react';
import { Image, ActivityIndicator, View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { useCachedFiles, UseCachedFilesType } from '../../common/CacheUtils';
import { globalTextStyles } from '../../theme';
import { FirestoreHour } from '../../types/FirebaseTypes';
import { HourInstructionsType } from '../../types/HourScreenTypes';
import HourActivities from './HourActivities';

function composeInstructions(hourInstructions: HourInstructionsType) {
  let tempHourInstructionsText = '';
  // If it's a flat string, just return that
  if (typeof hourInstructions === 'string') {
    return hourInstructions;
  }
  // If it's an array iterate over it and assemble a list of instructions
  if (Array.isArray(hourInstructions)) {
    for (let i = 0; i < hourInstructions.length; i++) {
      // Is this an instruction that we want to be a level lower
      if (typeof hourInstructions[i] === 'object') {
        // Add a top level instruction as the first array element
        tempHourInstructionsText += `${i + 1}. ${hourInstructions[i][0]}
`;
        // Start at the second element, assuming the first is the top level instruction
        for (
          let j = 1;
          j < Object.keys(hourInstructions[i]).length && j - 1 < alphabet.length;
          j++
        ) {
          tempHourInstructionsText += `      ${alphabet[j - 1]}. ${hourInstructions[i][j]}
`;
        }
        // Otherwise just add it as a normal element
      } else {
        tempHourInstructionsText += `${i + 1}. ${hourInstructions[i]}
`;
      }
    }
  }

  return tempHourInstructionsText;
}

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

const HourScreen = ({
  route: { params },
}: {
  route: { params: { firestoreHour: FirestoreHour } };
}) => {
  const { firestoreHour } = params;
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [cacheOptions, setCacheOptions] = useState<UseCachedFilesType[]>([]);
  const cachedFiles = useCachedFiles(cacheOptions, true);

  // Setup the image cache
  useEffect(() => {
    const tempCacheOptions: UseCachedFilesType[] = [];
    let googleUriIndex = 0;
    let httpUriIndex = 0;
    for (let i = 0; i < firestoreHour.contentOrder.length; i++) {
      switch (firestoreHour.contentOrder[i]) {
        case 'http-image': {
          const cacheOption: UseCachedFilesType = {
            assetId: `Marathon Hour: ${firestoreHour.name} http file #${httpUriIndex}`,
            freshnessTime: 14400,
            base64: true,
            downloadUri: Array.isArray(firestoreHour.imageUri)
              ? firestoreHour.imageUri[httpUriIndex]
              : firestoreHour.imageUri,
          };
          tempCacheOptions[i] = cacheOption;
          httpUriIndex++;
          break;
        }
        case 'gs-image': {
          const cacheOption: UseCachedFilesType = {
            assetId: `Marathon Hour: ${firestoreHour.name} google storage file #${googleUriIndex}`,
            freshnessTime: 14400,
            base64: true,
            googleUri: Array.isArray(firestoreHour.imageGoogleUri)
              ? firestoreHour.imageGoogleUri[googleUriIndex]
              : firestoreHour.imageGoogleUri,
          };
          tempCacheOptions[i] = cacheOption;
          googleUriIndex++;
          break;
        }
        default: {
          break;
        }
      }
    }
    setCacheOptions(tempCacheOptions);
  }, [firestoreHour]);

  // Build out the screen's components
  useEffect(() => {
    const tempComponents: JSX.Element[] = [];
    let specialComponentIndex = 0;
    for (let i = 0; i < firestoreHour.contentOrder.length; i++) {
      switch (firestoreHour.contentOrder[i]) {
        case 'text-instructions':
          if (firestoreHour.textInstructions) {
            tempComponents.push(
              <Text key={i}>{composeInstructions(firestoreHour.textInstructions)}</Text>
            );
          }
          break;

        case 'gs-image':
        case 'http-image':
          if (cachedFiles[i]) {
            if (cachedFiles[i][1]) {
              tempComponents.push(
                <MaterialIcons key={i} name="image-not-supported" color="black" />
              );
            } else if (cachedFiles[i][0]) {
              tempComponents.push(
                <Image
                  key={i}
                  source={{ uri: `data:image;base64,${cachedFiles[i][0]}`, width: 200 }}
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: 'contain',
                  }}
                />
              );
            }
          } else {
            tempComponents.push(<ActivityIndicator key={i} />);
          }
          break;

        case 'special':
          specialComponentIndex++;
          if (Array.isArray(firestoreHour.specialComponent)) {
            tempComponents.push(
              <View key={i}>
                {HourActivities[firestoreHour.specialComponent[specialComponentIndex].id]}
              </View>
            );
          } else if (firestoreHour.specialComponent) {
            tempComponents.push(
              <View key={i}>{HourActivities[firestoreHour.specialComponent.id]}</View>
            );
          }
          break;

        default:
          break;
      }
    }
    setComponents(tempComponents);
  }, [cachedFiles, firestoreHour]);

  return (
    <ScrollView>
      <View>
        <Text style={globalTextStyles.headerText}>{`${firestoreHour.hourNumber + 1}. ${
          firestoreHour.name
        }`}</Text>
        <Text>{firestoreHour.description}</Text>
        {components}
      </View>
    </ScrollView>
  );
};

export default HourScreen;

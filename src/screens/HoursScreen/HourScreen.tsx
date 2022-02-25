import { useEffect, useState } from 'react';
import { ActivityIndicator, View, ScrollView, useWindowDimensions } from 'react-native';
import { Image, Text, useTheme } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import Lightbox from 'react-native-lightbox-v2';
import WebView from 'react-native-webview';
import { UseCachedFilesType, useCachedImages } from '../../common/CacheUtils';
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
  const cachedImages = useCachedImages(cacheOptions);
  const { theme } = useTheme();

  const { width: screenWidth } = useWindowDimensions();

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
            googleUri: Array.isArray(firestoreHour.firebaseImageUri)
              ? firestoreHour.firebaseImageUri[googleUriIndex]
              : firestoreHour.firebaseImageUri,
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
    let webviewIndex = 0;
    for (let i = 0; i < firestoreHour.contentOrder.length; i++) {
      switch (firestoreHour.contentOrder[i]) {
        case 'text-instructions':
          if (firestoreHour.textInstructions) {
            tempComponents.push(
              <>
                <Text style={{ margin: 10 }} h4>
                  Instructions:
                </Text>
                <Text style={{ margin: 10 }} key={i}>
                  {composeInstructions(firestoreHour.textInstructions)}
                </Text>
              </>
            );
          }
          break;

        case 'gs-image':
        case 'http-image':
          if (cachedImages[i]) {
            if (cachedImages[i][1] !== null) {
              tempComponents.push(
                <MaterialIcons key={i} name="image-not-supported" color="black" />
              );
            } else if (cachedImages[i][0] !== null) {
              tempComponents.push(
                <Lightbox key={i}>
                  <Image
                    source={{
                      uri: cachedImages[i][0]?.imageBase64,
                      width: cachedImages[i][0]?.imageWidth,
                      height: cachedImages[i][0]?.imageHeight,
                    }}
                    style={{
                      width: screenWidth,
                      height: screenWidth / cachedImages[i][0]?.imageRatio,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      marginVertical: 10,
                    }}
                  />
                </Lightbox>
              );
            } else {
              tempComponents.push(<ActivityIndicator key={i} color="blue" />);
            }
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

        case 'webview':
          webviewIndex++;
          if (Array.isArray(firestoreHour.webviewUri)) {
            tempComponents.push(
              <View key={i}>
                <WebView source={{ uri: firestoreHour.webviewUri[webviewIndex] }} />
              </View>
            );
          } else if (firestoreHour.webviewUri) {
            tempComponents.push(
              <View key={i}>
                <WebView source={{ uri: firestoreHour.webviewUri }} />
              </View>
            );
          }
          break;

        default:
          break;
      }
    }
    setComponents(tempComponents);
  }, [cachedImages, firestoreHour, screenWidth]);

  return (
    <ScrollView style={{ backgroundColor: theme.colors?.grey3 }}>
      <View style={{ justifyContent: 'space-between' }}>
        <Text h3 style={{ margin: 10, ...globalTextStyles.headerText }}>{`${
          firestoreHour.hourNumber + 1
        }. ${firestoreHour.name}`}</Text>
        {firestoreHour.description && (
          <Text style={{ margin: 10 }}>{firestoreHour.description}</Text>
        )}
        {components}
      </View>
    </ScrollView>
  );
};

export default HourScreen;

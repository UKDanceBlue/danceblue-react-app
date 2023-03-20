import { DownloadableImage, FirestoreImage, FirestoreImageJsonV1 } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { Box, Image, ScrollView, Spinner, VStack, View } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

import NativeBaseMarkdown from "../../../../common/components/NativeBaseMarkdown";
import { universalCatch } from "../../../../common/logging";
import { lookupHourByTime } from "../../../../common/marathonTime";
import { useFirebase } from "../../../../context";

import { FirestoreHour } from "./FirestoreHourTypes";
import mdtest from "./tmp";


export const HourScreenComponent = () => {
  const currentHour = lookupHourByTime(DateTime.now());
  const [ hour, setHour ] = useState<FirestoreHour | null>(null);
  const [ hourImage, setHourImage ] = useState<DownloadableImage | null>(null);
  const { fbStorage } = useFirebase();
  const { width: screenWidth } = useWindowDimensions();
  const refresh = useCallback(async () => {
    const graphicJson: FirestoreImageJsonV1 = {
      height: 1080,
      width: 1920,
      uri: "gs://react-danceblue.appspot.com/marathon/2023/Caturday.png"
    };
    setHour({
      hourName: "Hour 1",
      content: mdtest,
      hourNumber: 1,
      graphic: graphicJson
    });

    const image = FirestoreImage.fromJson(graphicJson);
    setHourImage(await DownloadableImage.fromFirestoreImage(image, (uri: string) => fbStorage.refFromURL(uri).getDownloadURL()));
  }, [fbStorage]);

  useEffect(() => {
    if (currentHour) {
      refresh().catch(universalCatch);
    }
  }, [currentHour]);

  return (
    <VStack>
      <Box>
        {hourImage == null
          ? <Spinner />
          : <Image
            width={screenWidth}
            height={screenWidth * 9 / 16}
            alt="Hour Image"
            source={{
              uri: hourImage.url,
              height: hourImage.height,
              width: hourImage.width
            }}
            resizeMode="contain"/>
        }
      </Box>
      <ScrollView paddingX={4} paddingTop={3}>
        <NativeBaseMarkdown>
          {hour?.content}
        </NativeBaseMarkdown>
      </ScrollView>
    </VStack>
  );
};

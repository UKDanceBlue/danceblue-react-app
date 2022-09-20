import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { openURL } from "expo-linking";
import { Button, HStack, Text, VStack, useColorMode } from "native-base";
import { useState } from "react";
import { TextInput } from "react-native";

import { useColorModeValue } from "../../../common/customHooks";
import { universalCatch } from "../../../common/logging";
import { useTryToSetDemoMode } from "../../../context";




export const ProfileFooter = () => {
  const tryToEnterDemoMode = useTryToSetDemoMode();

  const [ reportLongPressed, setReportLongPressed ] = useState(false);
  const [ suggestLongPressed, setSuggestLongPressed ] = useState(false);

  const { toggleColorMode } = useColorMode();
  const modeToChangeTo = useColorModeValue("Dark", "Light");

  return (
    <VStack flex={1} justifyContent="flex-end">
      {reportLongPressed && suggestLongPressed && (
        <TextInput
          style={{ borderWidth: 2, minWidth: "30%" }}
          returnKeyType="go"
          secureTextEntry
          onSubmitEditing={(event) => {
            if (tryToEnterDemoMode(event.nativeEvent.text)) {
              setReportLongPressed(false);
              setSuggestLongPressed(false);
            }
          }}
        />
      )}
      {__DEV__ && (
        <Button
          alignSelf="center"
          width="2/5"
          onPress={toggleColorMode}
        >
          {`Set color mode to ${modeToChangeTo}`}
        </Button>
      )}

      <HStack justifyContent="center">
        <Button
          width="2/5"
          onPress={() => {
            openURL(
              "mailto:app@danceblue.org?subject=DanceBlue%20App%20Issue%20Report&body=What%20happened%3A%0A%3Ctype%20here%3E%0A%0AWhat%20I%20was%20doing%3A%0A%3Ctype%20here%3E%0A%0AOther%20information%3A%0A%3Ctype%20here%3E"
            ).catch(universalCatch);
          }}
          onLongPress={() => {
            setReportLongPressed(true);
          }}
        >Report an issue
        </Button>
        <Button
          width="2/5"
          onPress={() => {
            openURL(
              "mailto:app@danceblue.org?subject=DanceBlue%20App%20Suggestion&body=%3Ctype%20here%3E"
            ).catch(universalCatch);
          }}
          onLongPress={() => {
            setSuggestLongPressed(!!reportLongPressed);
          }}
        >Suggest a change
        </Button>
      </HStack>
      <Text
        style={{ textAlign: "center" }}
      >{`Version: ${nativeApplicationVersion ?? ""} (${nativeBuildVersion ?? ""})`}</Text>
    </VStack>
  );
};

import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { openURL } from "expo-linking";
import { Button, HStack, Text, VStack, useColorMode } from "native-base";
import { useState } from "react";
import { TextInput } from "react-native";

import { useAppDispatch, useAppSelector, useColorModeValue } from "../../../common/customHooks";
import { universalCatch } from "../../../common/logging";
import { enterDemoMode as enterDemoModeConfig } from "../../../redux/appConfigSlice";
import { enterDemoMode as enterDemoModeAuth } from "../../../redux/authSlice";
import { enterDemoMode as enterDemoModeUser } from "../../../redux/userDataSlice";

export const ProfileFooter = () => {
  const demoModeKey = useAppSelector((state) => state.appConfig.demoModeKey);
  const dispatch = useAppDispatch();
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
            if (event.nativeEvent.text === demoModeKey) {
              dispatch(enterDemoModeConfig());
              dispatch(enterDemoModeAuth());
              dispatch(enterDemoModeUser());
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

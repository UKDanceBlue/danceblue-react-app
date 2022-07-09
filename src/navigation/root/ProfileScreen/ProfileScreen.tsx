import { startCase } from "lodash";
import { Button, Center, Image, Spinner, Text, VStack, useTheme } from "native-base";

import avatar from "../../../../assets/avatar.png";
import { useAppSelector } from "../../../common/CustomHooks";
import { useFirebase } from "../../../common/FirebaseApp";
import { useLinkBlueLogin } from "../../../common/auth";
import { showMessage } from "../../../common/util/AlertUtils";

import { ProfileFooter } from "./ProfileFooter";

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = () => {
  const { colors } = useTheme();

  const authData = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.userData);
  const {
    fbAuth, fbFunctions
  } = useFirebase();

  const [ loading, trigger ] = useLinkBlueLogin(fbAuth, fbFunctions);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (authData.isLoggedIn) {
    return (
      <VStack flex={1} >
        <VStack flex={1} alignItems="center">
          <Image source={avatar} alt="Avatar" style={{ width: 100, height: 100 }} />
          <Text>
            You are logged in {
              authData.isAnonymous
                ? "anonymously"
                : `as ${
                  userData.firstName || userData.lastName
                    ? [ userData.firstName, userData.lastName ].filter((s) => s != null).join(" ")
                    : (((userData.email ?? userData.linkblue) ?? authData.uid) ?? "UNKNOWN")
                }`}
          </Text>
          {authData.authClaims?.dbRole === "committee" && (
            <Text italic fontSize="xs" textAlign="center">
              {[
                typeof authData.authClaims.committee === "string" ? startCase(authData.authClaims.committee) : undefined,
                typeof authData.authClaims.committeeRank === "string" ? startCase(authData.authClaims.committeeRank) : undefined
              ].filter((s) => s != null).join(" - ")}
            </Text>
          )}
        </VStack>
        <VStack flex={3} justifyContent="flex-end">
          <Button
            onPress={() => {
              fbAuth.signOut().catch((error) => {
                showMessage(error);
              });
            }}
            backgroundColor={colors.danger[700]}
          >
            Sign out
          </Button>
        </VStack>
        <ProfileFooter />
      </VStack>
    );
  } else {
    // This one doesn't really need to look as nice since it SHOULD be impossible to get here without the modal popping up
    return (
      <Center>
        <VStack>
          <Text>
          You are not logged in.
          </Text>
          <Button
            onPress={() => {
              trigger();
            }}
            style={{ marginTop: 10 }}
          >
          Login with linkblue
          </Button>
          <Button
            onPress={() => {
              fbAuth.signInAnonymously().catch((error) => {
                showMessage(error);
              });
            }}>
          Login anonymously
          </Button>
        </VStack>
      </Center>
    );
  }
};

export default ProfileScreen;

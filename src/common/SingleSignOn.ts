import auth from "@react-native-firebase/auth";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { loginSSO } from "../redux/authSlice";
import store from "../redux/store";

import { showMessage } from "./AlertUtils";

let browserOpen = false;
export default class SingleSignOn {
  backendUrl;

  redirectData?: Linking.ParsedURL;

  constructor() {
    this.backendUrl = "https://app.danceblue.org/saml-relay.html";
  }

  /**
   * Authenticate a user using SSO by opening the native browser and navigating to the IDP
   * This is accomplished through the use of a dummy page that signs the user in using methods
   * unavailable in React Native, and then passing the auth credential back to the app in
   * the query string of the expo-linking url
   */
  async authenticate(operation: string, ssoEnabled: boolean) {
    if (ssoEnabled) {
      showMessage(
        "This is not a bug, the DanceBlue Committee has disabled SSO. This may or may not be temporary",
        "Single Sign On has been disabled"
      );
      return null;
    }
    if (browserOpen) {
      return;
    }
    try {
      browserOpen = true;
      // Open a browser that goes to backendUrl and passes the desired operation, firebase config, and a link back to the app
      const result = await WebBrowser.openAuthSessionAsync(
        `${this.backendUrl}?linkingUri=${Linking.createURL(`/${operation}`)}`,
        // @ts-ignore
        undefined
      )
        .catch((reason) => {
          showMessage(reason, "Error with web browser");
        })
        .finally(() => {
          browserOpen = false;
        });
      if (typeof result === "object") {
        switch (result?.type) {
        case WebBrowser.WebBrowserResultType.CANCEL:
        case WebBrowser.WebBrowserResultType.DISMISS:
        case WebBrowser.WebBrowserResultType.LOCKED:
          showMessage("Sign in cancelled", "Browser closed");
          break;
        case "success":
          if (result?.url) {
            this.redirectData = Linking.parse(result.url);
          }
          break;
        case null:
        case undefined:
          showMessage("Browser did not respond.\nSign in failed", "No response", undefined, true);
          return;
        default:
          showMessage(
            `Browser responded with type ${result.type}`,
            "Unexpected response",
            undefined,
            true,
            result
          );
          break;
        }
      }
    } catch (error) {
      showMessage(error as Error, "Error with web browser");
      return;
    }

    if (!this.redirectData) {
      showMessage(
        "Browser did not respond or sign in was cancelled.\nSign in failed",
        "No response",
        undefined,
        true
      );
      return;
    }

    const oAuthResult = JSON.parse(this.redirectData.queryParams.token);

    // Get the OAuth access token and ID Token
    const credential = auth.OAuthProvider.credential(oAuthResult.accessToken ?? null, oAuthResult.secret ?? null);

    // This is only used here because we are about to sign in again // TODO: replace with https://firebase.google.com/docs/auth/web/anonymous-auth#convert-an-anonymous-account-to-a-permanent-account
    if (auth().currentUser) {
      await auth().signOut();
    }
    store.dispatch(loginSSO(await auth().signInWithCredential(credential)));
  }
}

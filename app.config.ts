
// WARNING THIS ISN'T VERSIONED
import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  /*
  Version info:
  - `version` holds the major, minor, and patch numbers of the current build
  - `baseBuildCount` holds the number of builds of the app that have happened prior to any on the current version.
  - `buildsThisVersion` holds the number of builds of the app that have happened on the current version.
  - `mainVersionString` holds the version number of the app in the form of a string (shown to user).
  - `versionCode` is the build ID used by android
  - `buildNumber` is the build ID used by iOS

  To bump the app's version:
  1. Change whatever you want in `version`
  2. Increment `baseBuildCount` by `buildsThisVersion`.
  3. Set `buildsThisVersion` to 0.
  */
  const version = {
    major: 2,
    minor: 0,
    patch: 0
  };
  const baseBuildCount = 24;
  const buildsThisVersion = 0; // THIS MUST BE INCREMENTED BEFORE ANY NEW BUILD IS CREATED
  const mainVersionString = `${version.major}.${version.minor}.${version.patch}`;
  const versionCode = baseBuildCount + buildsThisVersion;
  const buildNumber = `${version.major}.${version.minor}.${version.patch + buildsThisVersion}`;

  // App info
  const name = "UK DanceBlue";

  // DO NOT CHANGE ANYTHING BELOW THIS LINE
  return {
    ...config,
    name,
    slug: "danceblue-mobile",
    runtimeVersion: `${mainVersionString}(${buildsThisVersion})`,
    ios: { ...(config.ios ?? {}), buildNumber },
    android: { ...(config.android ?? {}), versionCode }
  };
};

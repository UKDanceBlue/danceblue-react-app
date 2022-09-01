// WARNING THIS ISN'T VERSIONED
import { ConfigContext, ExpoConfig } from "@expo/config";

interface Version {
  major: number;
  minor: number;
  patch: number;
}
type SemVer = `${Version["major"]}.${Version["minor"]}.${Version["patch"]}`;

export default ({ config }: ConfigContext): ExpoConfig => {
  const IS_DEV = process.env.APP_VARIANT === "development";

  /*
  Version info:
  - `bundleVersion` holds the major.minor.patch version of the app's javascript and asset bundle.
  - `version` holds the major.minor.patch version of the app's native code.
  - `baseBuildCount` holds the number of builds of the app that have happened prior to any on the current version.
  - `buildsThisVersion` holds the number of builds of the app that have happened on the current version.
  - `mainVersionString` holds the version number of the app in the form of a string (shown to user).
  - `versionCode` is the build ID used by android
  - `buildNumber` is the build ID used by iOS

  To bump the app's version:
  1. Change whatever you want in `version`
  2. Increment `baseBuildCount` by `buildsThisVersion`.
  3. Set `buildsThisVersion` to 1.
  */
  const bundleVersion: Version = {
    major: 2,
    minor: 0,
    patch: 1
  };
  const version: Version = {
    major: 2,
    minor: 0,
    patch: 1
  };

  if (version.major !== bundleVersion.major) {
    throw new Error(`Major version mismatch: ${version.major} !== ${bundleVersion.major}. Avoid bumping the bundle version without making a new build.`);
  }
  if (version.minor > bundleVersion.minor) {
    throw new Error(`Minor version mismatch: ${version.minor} > ${bundleVersion.minor}. Bundle cannot be labeled as older than the runtime version.`);
  } else if (version.minor === bundleVersion.minor && version.patch > bundleVersion.patch) {
    throw new Error(`Patch version mismatch: ${version.patch} > ${bundleVersion.patch}. Bundle cannot be labeled as older than the runtime version.`);
  }
  const baseBuildCount = 28;
  const buildsThisVersion = 1; // THIS MUST BE INCREMENTED BEFORE ANY NEW BUILD IS CREATED
  const bundleVersionString: SemVer = `${bundleVersion.major}.${bundleVersion.minor}.${bundleVersion.patch}`;
  const runtimeVersion: SemVer = `${version.major}.${version.minor}.${version.patch}`;
  const versionCode = baseBuildCount + buildsThisVersion;
  const buildNumber: SemVer = `${version.major}.${version.minor}.${version.patch + buildsThisVersion}`;

  // App info
  const name = IS_DEV ? "DB DEV CLIENT" : "DanceBlue";
  const qualifiedName = IS_DEV ? "org.danceblue.app.dev" : "org.danceblue.app";
  const androidGoogleServicesFile = IS_DEV ? "./google-services.dev.json" : "./google-services.json";
  const iosGoogleServicesFile = IS_DEV ? "./GoogleService-Info.dev.plist" : "./GoogleService-Info.plist";

  // DO NOT CHANGE ANYTHING BELOW THIS LINE
  return {
    ...config,
    name,
    slug: "danceblue-mobile",
    version: bundleVersionString,
    runtimeVersion,
    ios: { ...(config.ios ?? {}), buildNumber, googleServicesFile: iosGoogleServicesFile, bundleIdentifier: qualifiedName },
    android: { ...(config.android ?? {}), versionCode, googleServicesFile: androidGoogleServicesFile, package: qualifiedName },
  };
};

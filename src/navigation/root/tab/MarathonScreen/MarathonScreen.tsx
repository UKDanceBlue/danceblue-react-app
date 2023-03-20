import { DateTime, Interval } from "luxon";
import { View } from "native-base";

import { marathonInterval } from "../../../../common/marathonTime";

import { HourScreenComponent } from "./HourScreenComponent";
import { MarathonCountdownScreen } from "./MarathonCountdownScreen";

export const MarathonScreen = () => {
  if (!marathonInterval.contains(DateTime.now())) {
    return (<MarathonCountdownScreen />);
  } else {
    return (
      <HourScreenComponent/>
    );
  }
};

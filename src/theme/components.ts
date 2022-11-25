import { RecursivePartial } from "@ukdanceblue/db-app-common";
import { Theme } from "native-base";

// We are gonna want a ton of component presets here, take a look around the project and look for frequently repeated styles
export const components: RecursivePartial<Theme["components"]> = {
  Button: {
    baseStyle: {
      borderRadius: 5,
      margin: "1",
      padding: "3",
    }
  },
  Text: { baseStyle: { fontSize: 15 } },
};

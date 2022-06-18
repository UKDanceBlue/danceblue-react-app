// Allow importing from the parent folder rather than individual files
// For example you can do:   *import { EventScreen } from '../EventScreen'*
// Instead of:               *import { EventScreen } from '../EventScreen/EventScreen'*

import EventRow from "./EventRow";
import EventScreen from "./EventScreen";
import EventView from "./EventView";

export { EventRow, EventView };
export default EventScreen;

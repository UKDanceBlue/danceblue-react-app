// Allow importing from the parent folder rather than individual files
// for example you can do:   *import { EventScreen } from '../EventScreen'*
// instead of:               *import { EventScreen } from '../EventScreen/EventScreen'*

import EventView from "./EventView";
import EventRow from "./EventRow";
import EventScreen from "./EventScreen";

export { EventRow, EventView };
export default EventScreen;

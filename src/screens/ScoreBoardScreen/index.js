// Allow importing from the parent folder rather than individual files
// for example you can do:   *import { EventScreen } from '../EventScreen'*
// instead of:               *import { EventScreen } from '../EventScreen/EventScreen'*

import Place from './Place';
import Standings from './Standings';
import ScoreboardScreen from './ScoreBoardScreen';

export { Place, Standings };
export default ScoreboardScreen;

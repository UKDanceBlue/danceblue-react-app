import { FirestoreTeam, FirestoreTeamFundraising, FirestoreTeamIndividualSpiritPoints } from "../types/FirebaseTypes";

export type UserLoginType = "anonymous" | "ms-oath-linkblue";
type UserDataType = {
  firstName: string;
  lastName: string;
  email: string;
  linkBlue?: string;
  attributes: {
    [key: string]: string;
  };
  team: FirestoreTeam | null;
  teamIndividualSpiritPoints: FirestoreTeamIndividualSpiritPoints | null;
  teamFundraisingTotal: FirestoreTeamFundraising | null;
  userLoginType: UserLoginType;
  pastNotificationIds: string[];
};

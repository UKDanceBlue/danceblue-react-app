export type UserLoginType = "anonymous" | "ms-oath-linkblue";
type UserDataType = {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  linkBlue?: string;
  attributes: {
    [key: string]: string;
  };
  authClaims: {
    [key: string]: string;
  };
  userLoginType: UserLoginType;
  pastNotificationIds: string[];
};

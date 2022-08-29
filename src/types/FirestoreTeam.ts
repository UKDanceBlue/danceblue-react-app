export interface FirestoreTeam {
  members?: Record<string, string>;
  name: string;
  spiritSpreadsheetId?: string;
  networkForGoodId?: string;
  totalSpiritPoints?: number;
}

export function isFirestoreTeam(team?: object): team is FirestoreTeam {
  // If team is nullish, return false
  if (team == null) {
    return false;
  }

  // If name is not defined, return false
  const { name } = team as Partial<FirestoreTeam>;
  if (name == null) {
    return false;
  } else if (typeof name !== "string") {
    return false;
  } else if (name.length === 0) {
    return false;
  }

  // If spiritSpreadsheetId is defined, check that it's a string, if not return false
  const { spiritSpreadsheetId } = team as FirestoreTeam;
  if (spiritSpreadsheetId != null && typeof spiritSpreadsheetId !== "string") {
    return false;
  }

  // If networkForGoodId is defined, check that it's a string, if not return false
  const { networkForGoodId } = team as FirestoreTeam;
  if (networkForGoodId != null && typeof networkForGoodId !== "string") {
    return false;
  }

  // If totalSpiritPoints is defined, check that it's a number, if not return false
  const { totalSpiritPoints } = team as FirestoreTeam;
  if (totalSpiritPoints != null && typeof totalSpiritPoints !== "number") {
    return false;
  }

  // If all checks pass, return true
  return true;
}

export interface FirestoreTeamFundraising {
  total?: number;
}

export function isFirestoreTeamFundraising(fundraising?: object): fundraising is FirestoreTeamFundraising {
  // If fundraising is nullish, return false
  if (fundraising == null) {
    return false;
  }

  // If total is defined, check that it's a number, if not return false
  const { total } = fundraising as FirestoreTeamFundraising;
  if (total != null && typeof total !== "number") {
    return false;
  }

  // If all checks pass, return true
  return true;
}

export type FirestoreTeamIndividualSpiritPoints = Record<string, number>;

export function isFirestoreTeamIndividualSpiritPoints(spiritPoints?: object): spiritPoints is FirestoreTeamIndividualSpiritPoints {
  // If spiritPoints is nullish, return false
  if (spiritPoints == null) {
    return false;
  }

  // If spiritPoints is not an object, return false (We are assuming that the key and value types match)
  if (typeof spiritPoints !== "object") {
    return false;
  }

  // If all checks pass, return true
  return true;
}

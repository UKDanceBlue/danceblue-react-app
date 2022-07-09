export interface FirestoreTeam {
  members?: Record<string, string>;
  name: string;
  spiritSpreadsheetId?: string;
  networkForGoodId?: string;
  totalSpiritPoints?: number;
}

export interface FirestoreTeamFundraising {
  total?: number;
}

export type FirestoreTeamIndividualSpiritPoints = Record<string, number>;

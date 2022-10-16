export interface SpiritTeamsRootDoc {
  basicInfo: {
    [teamId: string]: {
      name: string;
      teamClass?: "public" | "committee";
      totalPoints?: number;
    };
  };
}

// TODO add a validation function for this type

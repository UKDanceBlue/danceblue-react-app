export type HourInstructionsType = string | (string | string[])[];

export type SpecialComponentType = {
  id: string;
  uniqueOptions: { [key: string]: string };
};

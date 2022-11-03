/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface FirestoreTeam {
  name: string;
  teamClass?: "public" | "committee";
  members: string[];
  memberNames: Record<string, string | null>;
  memberAccounts: Record<string, string | null>;
  fundraisingTotal?: number;
  totalPoints?: number;
  networkForGoodId?: string;
  individualTotals?: Record<string, number>;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export function isFirestoreTeam(
  data: unknown
): data is FirestoreTeam {
  if (data == null) {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeam>).name !== "string") {
    return false;
  }

  if ((data as Partial<FirestoreTeam>).teamClass != null && typeof (data as Partial<FirestoreTeam>).teamClass !== "string") {
    return false;
  }

  if (!Array.isArray((data as Partial<FirestoreTeam>).members) || (data as Partial<FirestoreTeam>).members?.some((m: unknown) => typeof m !== "string")) {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeam>).memberAccounts !== "object" || (data as Partial<FirestoreTeam>).memberAccounts == null) {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeam>).memberNames !== "object" || (data as Partial<FirestoreTeam>).memberNames == null) {
    return false;
  }

  if ((data as Partial<FirestoreTeam>).fundraisingTotal != null && typeof (data as Partial<FirestoreTeam>).fundraisingTotal !== "number") {
    return false;
  }

  if ((data as Partial<FirestoreTeam>).totalPoints != null && typeof (data as Partial<FirestoreTeam>).totalPoints !== "number") {
    return false;
  }

  if ((data as Partial<FirestoreTeam>).networkForGoodId != null && typeof (data as Partial<FirestoreTeam>).networkForGoodId !== "string") {
    return false;
  }

  if (typeof (data as Partial<FirestoreTeam>).individualTotals !== "object" || (data as Partial<FirestoreTeam>).individualTotals == null) {
    return false;
  }

  return true;
}

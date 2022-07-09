import { DownloadableImage, FirestoreImage } from "./commonStructs";

/** @deprecated TODO: Switch to FirestoreSponsor structure */
export interface LegacyFirestoreSponsor {
  link?: string;
  logo?: string;
  name?: string;
}
export interface FirestoreSponsor{
  link?: string;
  logo?: FirestoreImage;
  name?: string;
}

export interface ParsedSponsor {
  logo?: DownloadableImage;
  link?: string;
  name?: string;
}

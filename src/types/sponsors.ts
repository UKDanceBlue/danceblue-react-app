import { DownloadableImage, FirestoreImage } from "./commonStructs";

/** @deprecated TODO: Switch to FirestoreSponsor structure */
export interface LegacyFirestoreSponsor {
  link?: string;
  logo?: string;
  name?: string;
}
export interface RawFirestoreSponsor{
  link?: string;
  logo?: FirestoreImage;
  name?: string;
}

export interface ParsedFirestoreSponsor {
  logo?: DownloadableImage;
  link?: string;
  name?: string;
}

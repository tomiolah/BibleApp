import { Bible, BibleTranslation } from "../types/apiTypes"

const API_ROOT = 'http://www.songpraise.com/api'
const TRANSLATIONS_ENDPOINT = `${API_ROOT}/bibleTitles`;
const BIBLE_ENDPOINT = (uuid: string) => `${API_ROOT}/bible/${uuid}`;

export const getBibleTranslationsList = async (): Promise<BibleTranslation[]> => await (
  await fetch(TRANSLATIONS_ENDPOINT)
).json() as BibleTranslation[];

export const getBible = async (uuid: string): Promise<Bible> => await (
  await fetch(BIBLE_ENDPOINT(uuid))
).json() as Bible;

import { LocalBiblesListItem } from "../util/offlinePersistence";

export type State = {
  BibleState: BibleStateType;
  config: UserConfiguration;
};

export type BibleReference = {
  book: number;
  chapterIndex: number;
  verseIndex: number | undefined;
};

export type BibleStateType = {
  currentBible: LocalBiblesListItem | undefined;
  currentRef: BibleReference | undefined;
};

export type UserConfiguration = {
  oneVersePerLine: boolean;
  darkTheme: boolean;
}
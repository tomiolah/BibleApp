import { Bible } from "./apiTypes";

export type State = {
  BibleState: BibleStateType;
};

export type BibleReference = {
  book: string;
  chapterIndex: number;
  verseIndex: number | null;
};

export type BibleStateType = {
  currentBible: Bible | null;
  currentRef: BibleReference | null;
};


export type Bible = {
  uuid: string;
  name: string;
  books: Book[];
  shortName: string;
  createdDate: number;
  modifiedDate: number;
  languageUuid: string;
};

export type Book = {
  title: string;
  chapters: Chapter[];
};

export type Chapter = {
  verses: Verse[];
};

export type Verse = {
  text: string;
  verseIndices: number[];
};


export type BibleTranslation = {
  uuid: string;
  name: string;
  books: any[];
  shortName: string;
  createdDate: number;
  modifiedDate: number;
  languageUuid: string;
};

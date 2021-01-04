import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BibleReference, BibleStateType } from "../types/reduxTypes";
import { LocalBiblesListItem } from "../util/offlinePersistence";

export const initialState: BibleStateType = {
  currentBible: undefined,
  currentRef: undefined,
};

const BibleSlice = createSlice({
  name: 'BibleState',
  initialState,
  reducers: {
    setBible(state, action: PayloadAction<LocalBiblesListItem>) {
      state.currentBible = action.payload;
    },
    setRef(state, action: PayloadAction<BibleReference>) {
      state.currentRef = action.payload;
    },
    setBook(state, action: PayloadAction<number>) {
      state.currentRef = {
        book: action.payload,
        chapterIndex: state.currentRef?.chapterIndex ?? 0,
        verseIndex: state.currentRef?.chapterIndex ?? 0,
      }
    },
    setChapter(state, action: PayloadAction<number>) {
      if (state.currentRef) {
        state.currentRef.chapterIndex = action.payload;
        state.currentRef.verseIndex = 0;
      }
    },
    setVerse(state, action: PayloadAction<number>) {
      if (state.currentRef) {
        state.currentRef.verseIndex = action.payload;
      }
    }
  }
});

export default BibleSlice.reducer;
export const BibleStateActions = BibleSlice.actions;

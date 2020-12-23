import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bible } from "../types/apiTypes";
import { BibleReference, BibleStateType } from "../types/reduxTypes";

export const initialState: BibleStateType = {
  currentBible: null,
  currentRef: null,
};

const BibleSlice = createSlice({
  name: 'BibleState',
  initialState,
  reducers: {
    setBible(state, action: PayloadAction<Bible>) {
      state.currentRef = null;
      state.currentBible = action.payload;
    },
    setRef(state, action: PayloadAction<BibleReference>) {
      state.currentRef = action.payload;
    },
    setBook(state, action: PayloadAction<string>) {
      state.currentRef = {
        book: action.payload,
        chapterIndex: 0,
        verseIndex: 0,
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

import { createSlice } from "@reduxjs/toolkit";
import { UserConfiguration } from "../types/reduxTypes";

export const initialState: UserConfiguration = {
  oneVersePerLine: true,
  darkTheme: false,
};

const UserConfig = createSlice({
  name: 'config',
  initialState,
  reducers: {
    toggleOneVersePerLine(state) {
      state.oneVersePerLine = !state.oneVersePerLine;
    },
    toggleDarkTheme(state) {
      state.darkTheme = !state.darkTheme;
    },
  }
});

export default UserConfig.reducer;
export const UserConfigActions = UserConfig.actions;

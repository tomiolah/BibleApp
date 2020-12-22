import { Action, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import * as React from "react";
import BibleStateReducer, {
  initialState as BibleInit,
} from "./reducers/BibleState.reducer";
import { State } from "./types/reduxTypes";
import { loadState, saveStateAsJSON } from "./util/offlinePersistence";
import { init as initFS } from './util/offlinePersistence';

export const initialState = {
  BibleState: BibleInit,
};

const useAsyncStore = () => {
  const [store, setStore] = React.useState<EnhancedStore<State, Action<State>> | undefined>(undefined);
  React.useEffect(() => {
    initFS()
      .then(() => loadState().then(
          (initialState) => {
            const newStore = configureStore({
              reducer: { BibleState: BibleStateReducer },
              preloadedState: initialState,
            });
            newStore.subscribe(() => saveStateAsJSON(newStore.getState()));
            setStore(newStore);
          }
        )
      );
  }, []);
  return store;
}

export default useAsyncStore;
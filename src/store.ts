import { Action, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import * as React from "react";
import BibleStateReducer, {
  initialState as BibleInit,
} from "./reducers/BibleState.reducer";
import UserConfigReducer, {
  initialState as UserConfigInit,
} from "./reducers/UserConfig.reducer";
import { State } from "./types/reduxTypes";
import { loadState, saveStateAsJSON } from "./util/offlinePersistence";
import { init as initFS } from './util/offlinePersistence';

export const initialState = {
  BibleState: BibleInit,
  config: UserConfigInit,
};

const useAsyncStore = () => {
  const [store, setStore] = React.useState<EnhancedStore<State, Action<State>> | undefined>(undefined);
  React.useEffect(() => {
    initFS()
      .then(() => loadState().then(
          (initialState) => {
            const newStore = configureStore({
              reducer: { BibleState: BibleStateReducer, config: UserConfigReducer },
              preloadedState: initialState,
            });
            newStore.subscribe(async () => await saveStateAsJSON(newStore.getState()));
            setStore(newStore);
          }
        )
      );
  }, []);
  return store;
}

export default useAsyncStore;
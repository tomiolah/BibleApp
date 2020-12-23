import { Bible } from '../types/apiTypes';
import * as FileSystem from 'expo-file-system';
import { BibleReference, State, UserConfiguration } from '../types/reduxTypes';

export type LocalBiblesListItem = {
  uuid: string;
  name: string;
  shortName: string;
};

const BIBLE_DIRECTORY = (uuid: string) => `${FileSystem.documentDirectory}bibles/${uuid}.json`;
const BIBLES_DIRECTORY = `${FileSystem.documentDirectory}bibles`;
const BIBLE_LIST_FILE = `${FileSystem.documentDirectory}localBibles.json`;
const STATE_FILE = `${FileSystem.documentDirectory}state.json`;

export const saveBible = async (bible: Bible) => {
  await FileSystem.writeAsStringAsync(BIBLE_DIRECTORY(bible.uuid), JSON.stringify(bible));
  let newLocalBibles = await localBibles();
  await FileSystem.writeAsStringAsync(BIBLE_LIST_FILE, JSON.stringify([
    ...newLocalBibles,
    { uuid: bible.uuid, name: bible.name, shortName: bible.shortName },
  ]));
  return BIBLE_DIRECTORY(bible.uuid);
}

export const removeBible = async (uuid: string) => {
  await FileSystem.deleteAsync(BIBLE_DIRECTORY(uuid));
  let newLocalBibles = await localBibles();
  await FileSystem.writeAsStringAsync(BIBLE_LIST_FILE, JSON.stringify(
    newLocalBibles.filter(v => v.uuid !== uuid)
  ));
}

export const localBibles = async (): Promise<LocalBiblesListItem[]> => {
  const localBibles = await FileSystem.readAsStringAsync(BIBLE_LIST_FILE);
  return JSON.parse(localBibles) as LocalBiblesListItem[];
}

export const loadBible = async (uuid: string): Promise<Bible | undefined> => {
  const localBibles = JSON.parse(await FileSystem.readAsStringAsync(BIBLE_LIST_FILE)) as LocalBiblesListItem[];
  if (localBibles.map(v => v.uuid).includes(uuid)) {
    const loadedBible = await FileSystem.readAsStringAsync(BIBLE_DIRECTORY(uuid));
    return JSON.parse(loadedBible) as Bible;
  }
  return undefined;
}

export async function init() {
  const listFile = await FileSystem.getInfoAsync(BIBLE_LIST_FILE);
  if (!listFile.exists) {
    await FileSystem.writeAsStringAsync(BIBLE_LIST_FILE, JSON.stringify([]));
  }
  const biblesDir = await FileSystem.getInfoAsync(BIBLES_DIRECTORY);
  if (!biblesDir.exists || !biblesDir.isDirectory) {
    await FileSystem.makeDirectoryAsync(BIBLES_DIRECTORY, {
      intermediates: true
    });
  }
  const stateFile = await FileSystem.getInfoAsync(STATE_FILE);
  if (!stateFile.exists) {
    await FileSystem.writeAsStringAsync(STATE_FILE, JSON.stringify({}));
  }
}

type PersistedStateType = {
  currentBibleUUID: string | undefined;
  currentBibleReference: BibleReference | undefined;
  config: UserConfiguration;
};

export async function saveStateAsJSON(state: State) {
  const persistedState: PersistedStateType = {
    currentBibleUUID: state.BibleState.currentBible?.uuid ?? undefined,
    currentBibleReference: state.BibleState.currentRef,
    config: state.config,
  };
  await FileSystem.writeAsStringAsync(STATE_FILE, JSON.stringify(persistedState));
}

export async function loadState(): Promise<State> {
  const stateString = await FileSystem.readAsStringAsync(STATE_FILE);
  const persistedState = JSON.parse(stateString);
  const keys = Object.keys(persistedState);
  let loadedState: State = {
    BibleState: {
      currentBible: undefined,
      currentRef: undefined,
    },
    config: {
      oneVersePerLine: true,
      darkTheme: false,
    },
  };
  if (['currentBibleUUID', 'currentBibleReference', 'config'].every(v => keys.includes(v))) {
    const state = persistedState as PersistedStateType;
    if (state.currentBibleUUID) {
      loadedState.BibleState.currentBible = await loadBible(state.currentBibleUUID);
    }
    loadedState.BibleState.currentRef = state.currentBibleReference;
    loadedState.config = state.config;
  }
  return loadedState;
}
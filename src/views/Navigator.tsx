import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import BookPicker from '../components/BookPicker';
import ChapterPicker from '../components/ChapterPicker';
import TranslationPicker from '../components/TranslationPicker';
import VersePicker from '../components/VersePicker';
import { BibleStateType, State } from '../types/reduxTypes';
import BaseView from './BaseView';
import useAsyncData from '../hooks/useAsyncData';
import { loadBible, localBibles } from '../util/offlinePersistence';

export default function Navigator(props: DrawerContentComponentProps) {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);
  const BibleState = useSelector<State, BibleStateType>(state => state.BibleState);
  const availableTranslations = useAsyncData(localBibles());
  const currentBible = useAsyncData(loadBible(BibleState.currentBible?.uuid ?? ''), [BibleState]);
  const currentTranslationBooks = React.useMemo(() => currentBible?.books ?? [], [currentBible]);

  const [currentTranslation, innerSetCurrentTranslation] = React.useState<string | undefined>(BibleState.currentBible?.uuid ?? undefined);
  const [currentBookIndex, innerSetCurrentBookIndex] = React.useState<number>(BibleState.currentRef?.book ?? 0);
  const currentBook = React.useMemo(() =>
    currentTranslationBooks[currentBookIndex],
    [currentTranslationBooks, currentBookIndex]
  );
  const [currentChapterIndex, innerSetCurrentChapterIndex] = React.useState<number>(BibleState.currentRef?.chapterIndex ?? 0);
  const currentChapter = React.useMemo(() =>
    currentBook?.chapters[currentChapterIndex],
    [currentBook, currentChapterIndex]
  );
  const [currentVerseIndex, setCurrentVerseIndex] = React.useState<number>(BibleState.currentRef?.verseIndex ?? 0);
  const [ready, setReady] = React.useState<boolean>(!!currentBible);

  React.useEffect(() => setReady(!!currentBible), [currentBible]);

  const setCurrentChapterIndex = React.useCallback((chapter: number) => {
    innerSetCurrentChapterIndex(chapter);
    setCurrentVerseIndex(0);
  }, [innerSetCurrentChapterIndex, setCurrentVerseIndex]);

  const setCurrentBookName = React.useCallback((name: number) => {
    innerSetCurrentBookIndex(name);
    setCurrentChapterIndex(0);
  }, [innerSetCurrentBookIndex, setCurrentChapterIndex, setCurrentVerseIndex]);

  const setCurrentTranslation = React.useCallback((uuid: string) => {
    innerSetCurrentTranslation(uuid);
  }, [innerSetCurrentTranslation, setCurrentBookName]);

  return (
    <BaseView {...props} title="Navigator">
      <View style={{
        margin: 10,
      }}>
        {availableTranslations && (
          <TranslationPicker
            {...{availableTranslations, currentTranslation, setCurrentTranslation, setReady}}
          />
        )}
        {(ready && currentBible) && (
          <BookPicker
            {...{currentTranslationBooks, currentBook: currentBookIndex, setCurrentBook: setCurrentBookName}}
          />
        )}
        {ready && (
          <View style={{
            height: 100,
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <View style={{ width: '49%' }}><ChapterPicker
                {...{currentBook, currentChapter: currentChapterIndex, setCurrentChapter: setCurrentChapterIndex}}
              /></View>
              <View style={{ width: '49%' }}><VersePicker
                {...{currentChapter, currentVerseIndex, setCurrentVerseIndex}}
              /></View>
            </View>
          </View>
        )}
        {currentTranslation && (<Button buttonStyle={{
          padding: 20,
          marginTop: 10,
        }} type={darkTheme ? 'outline' : 'solid'} titleStyle={{
          fontSize: 20,
        }} title="GO" onPress={() => {
          if (currentChapter) {
            props.navigation.jumpTo('Bible reader')
          }
        }} />)}
      </View>
    </BaseView>
  );
}
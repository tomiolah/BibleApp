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
import { localBibles } from '../util/offlinePersistence';

export default function Navigator(props: DrawerContentComponentProps) {
  const BibleState = useSelector<State, BibleStateType>(state => state.BibleState);
  const isOk = React.useMemo(() => !!BibleState.currentBible && !!BibleState.currentRef, [BibleState]);
  const availableTranslations = useAsyncData(localBibles());
  const currentBible = React.useMemo(() => BibleState.currentBible, [BibleState]);
  const currentTranslationBooks = React.useMemo(() => currentBible?.books ?? [], [currentBible]);

  const [currentTranslation, innerSetCurrentTranslation] = React.useState<string | null>(BibleState.currentBible?.uuid ?? null);
  const [currentBookName, innerSetCurrentBookName] = React.useState<string | null>(BibleState.currentRef?.book ?? null);
  const currentBook = React.useMemo(() =>
    currentTranslationBooks.find(v => v.title === currentBookName),
    [currentTranslationBooks, currentBookName]
  );
  const [currentChapterIndex, innerSetCurrentChapterIndex] = React.useState<number>(BibleState.currentRef?.chapterIndex ?? 0);
  const currentChapter = React.useMemo(() =>
    currentBook?.chapters[currentChapterIndex],
    [currentBook, currentChapterIndex]
  );
  const [currentVerseIndex, setCurrentVerseIndex] = React.useState<number>(BibleState.currentRef?.verseIndex ?? 0);
  const [ready, setReady] = React.useState<boolean>(!!currentBible);

  const setCurrentChapterIndex = React.useCallback((chapter: number) => {
    setCurrentVerseIndex(0);
    innerSetCurrentChapterIndex(chapter);
  }, [innerSetCurrentChapterIndex, setCurrentVerseIndex]);

  const setCurrentBookName = React.useCallback((name: string | null) => {
    setCurrentChapterIndex(0);
    innerSetCurrentBookName(name);
  }, [innerSetCurrentBookName, setCurrentChapterIndex, setCurrentVerseIndex]);

  const setCurrentTranslation = React.useCallback((uuid: string) => {
    setCurrentBookName(null);
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
        {ready && currentBible && (
          <BookPicker
            {...{currentTranslationBooks, currentBook: currentBookName, setCurrentBook: setCurrentBookName}}
          />
        )}
        {ready && currentBookName && (
          <View style={{
            height: 100,
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              {currentBook && (<View style={{ width: '49%' }}><ChapterPicker
                {...{currentBook, currentChapter: currentChapterIndex, setCurrentChapter: setCurrentChapterIndex}}
              /></View>)}
              {currentChapter && (<View style={{ width: '49%' }}><VersePicker
                {...{currentChapter, currentVerseIndex, setCurrentVerseIndex}}
              /></View>)}
            </View>
          </View>
        )}
        {(!!currentTranslation && !!currentBookName) && <Button buttonStyle={{
          padding: 20,
          marginTop: 10,
        }} titleStyle={{
          fontSize: 20,
        }} title="GO" onPress={() => props.navigation.jumpTo('Bible reader')} />}
      </View>
    </BaseView>
  );
}
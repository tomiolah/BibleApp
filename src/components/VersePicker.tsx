import * as React from 'react';
import { Picker, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { Chapter } from '../types/apiTypes';
import { State } from '../types/reduxTypes';

export default function VersePicker() {
  const currentChapter = useSelector<State, Chapter | null>(state => {
    const currentTranslationBooks = state.BibleState.currentBible?.books ?? [];
    const currentBook = currentTranslationBooks.find(v => v.title === state.BibleState.currentRef?.book ?? '');
    return currentBook ? currentBook.chapters[state.BibleState.currentRef?.chapterIndex ?? 0] : null;
  });
  const [selectedValue, setSelectedValue] = React.useState<number | null>(currentChapter ? 0 : null);
  const dispatch = useDispatch();
  
  return currentChapter ? (
    <View>
      <Text style={{
        color: 'grey',
      }}>Verse</Text>
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          borderColor: 'grey',
          borderWidth: 1,
          borderRadius: 5,
        }}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={async (itemValue: number) => {
            setSelectedValue(itemValue);
            if (itemValue >= 0 && itemValue < currentChapter.verses.length) {
              dispatch(BibleStateActions.setVerse(itemValue));
            }
          }}
        >
          {currentChapter.verses.map((_, index) => (
            <Picker.Item key={index} label={`${index + 1}`} value={index} />
          ))}
        </Picker>
      </View>
    </View>
  ) : null;
}
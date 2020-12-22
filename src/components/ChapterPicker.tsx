import * as React from 'react';
import { Picker, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { Book } from '../types/apiTypes';
import { State } from '../types/reduxTypes';

export default function ChapterPicker() {
  const currentBook = useSelector<State, Book | undefined>(state => {
    const currentTranslation = state.BibleState.currentBible;
    if (currentTranslation) {
      const currentBookName = state.BibleState.currentRef?.book ?? null;
      if (currentBookName) {
        return currentTranslation.books.find(v => v.title === currentBookName);
      } 
    }
    return undefined;
  })
  const [selectedValue, setSelectedValue] = React.useState<number | null>(currentBook ? 0 : null);
  const dispatch = useDispatch();
  
  return currentBook ? (
    <View>
      <Text style={{
        color: 'grey',
      }}>Chapter</Text>
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
            if (itemValue >= 0 && itemValue < currentBook.chapters.length) {
              dispatch(BibleStateActions.setChapter(itemValue));
            }
          }}
        >
          {currentBook.chapters.map((_, index) => (
            <Picker.Item key={index} label={`${index + 1}`} value={index} />
          ))}
        </Picker>
      </View>
    </View>
  ) : null;
}
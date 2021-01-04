import * as React from 'react';
import { Picker, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { Book } from '../types/apiTypes';

type ChapterPickerProps = {
  currentBook: Book;
  currentChapter: number;
  setCurrentChapter(chapter: number): void;
};

export default function ChapterPicker(props: ChapterPickerProps) {
  const currentBook = props.currentBook;
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
          backgroundColor: 'white',
        }}
      >
        <Picker
          selectedValue={props.currentChapter}
          onValueChange={async (itemValue: number) => {
            props.setCurrentChapter(itemValue);
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
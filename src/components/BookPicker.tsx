import * as React from 'react';
import { View, Picker } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { Book } from '../types/apiTypes';

type BookPickerProps = {
  currentTranslationBooks: Book[],
  currentBook: string | null,
  setCurrentBook(book: string): void;
};

export default function BookPicker(props: BookPickerProps) {
  const dispatch = useDispatch();
  
  return props.currentTranslationBooks.length > 0 ? (
    <View>
      <Text style={{
        color: 'grey',
      }}>Book</Text>
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
          selectedValue={props.currentBook}
          onValueChange={async (itemValue) => {
            props.setCurrentBook(itemValue);
            const book = props.currentTranslationBooks.find(v => v.title === itemValue);
            if (book) {
              dispatch(BibleStateActions.setBook(book.title));
            }
          }}
        >
          {props.currentTranslationBooks.map((item) => (
            <Picker.Item key={item.title} label={item.title} value={item.title} />
          ))}
        </Picker>
      </View>
    </View>
  ) : null;
}
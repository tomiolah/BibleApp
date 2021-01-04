import * as React from 'react';
import { View, Picker } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { Book } from '../types/apiTypes';

type BookPickerProps = {
  currentTranslationBooks: Book[],
  currentBook: number,
  setCurrentBook(book: number): void;
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
          backgroundColor: 'white',
        }}
      >
        <Picker
          selectedValue={props.currentBook}
          onValueChange={async (itemValue: number) => {
            props.setCurrentBook(itemValue);
            if (itemValue > 0 && itemValue < props.currentTranslationBooks.length) {
              dispatch(BibleStateActions.setBook(itemValue));
            }
          }}
        >
          {props.currentTranslationBooks.map((item, index) => (
            <Picker.Item key={index} label={item.title} value={index} />
          ))}
        </Picker>
      </View>
    </View>
  ) : null;
}
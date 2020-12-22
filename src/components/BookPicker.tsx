import * as React from 'react';
import { View, Picker } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { Book } from '../types/apiTypes';
import { State } from '../types/reduxTypes';

export default function BookPicker() {
  const currentTranslationBooks = useSelector<State, Book[]>(state => state.BibleState.currentBible?.books ?? []);
  const currentBook = useSelector<State, string | null>(state => state.BibleState.currentRef?.book ?? null);
  const [selectedValue, setSelectedValue] = React.useState<string | null>(currentBook);
  const dispatch = useDispatch();
  
  return currentTranslationBooks.length > 0 ? (
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
          selectedValue={selectedValue}
          onValueChange={async (itemValue) => {
            setSelectedValue(itemValue);
            const book = currentTranslationBooks.find(v => v.title === itemValue);
            if (book) {
              dispatch(BibleStateActions.setBook(book.title));
            }
          }}
        >
          {currentTranslationBooks.map((item) => (
            <Picker.Item key={item.title} label={item.title} value={item.title} />
          ))}
        </Picker>
      </View>
    </View>
  ) : null;
}
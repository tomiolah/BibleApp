import * as React from 'react';
import { Picker, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { Chapter } from '../types/apiTypes';

type VersePickerProps = {
  currentChapter: Chapter | null;
  currentVerseIndex: number;
  setCurrentVerseIndex(verse: number): void;
};

export default function VersePicker(props: VersePickerProps) {
  const currentChapter = props.currentChapter;
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
          backgroundColor: 'white',
        }}
      >
        <Picker
          selectedValue={props.currentVerseIndex}
          onValueChange={async (itemValue: number) => {
            props.setCurrentVerseIndex(itemValue);
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
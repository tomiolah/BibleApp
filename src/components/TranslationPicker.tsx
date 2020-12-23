import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Picker, View } from 'react-native';
import { Text } from 'react-native-elements';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { loadBible, LocalBiblesListItem } from '../util/offlinePersistence';

type TranslationPickerProps = {
  availableTranslations: LocalBiblesListItem[];
  currentTranslation: string | null;
  setCurrentTranslation(uuid: string): void;
  setReady(value: boolean): void;
};

export default function TranslationPicker(props: TranslationPickerProps) {
  const dispatch = useDispatch();

  return (
    <View>
      <Text style={{
        color: 'grey',
      }}>Bible translation</Text>
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
          itemStyle={{
            fontSize: 20,
          }}
          selectedValue={props.currentTranslation}
          onValueChange={async (itemValue) => {
            props.setReady(false);
            props.setCurrentTranslation(itemValue);
            const bible = await loadBible(itemValue);
            if (bible) {
              dispatch(BibleStateActions.setBible(bible));
              props.setReady(true);
            }
          }}
        >
          {props.availableTranslations.map(translation => (
            <Picker.Item key={translation.uuid} label={`${translation.name} (${translation.shortName})`} value={translation.uuid} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
import * as React from 'react';
import { ActivityIndicator, Picker, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { BibleStateActions } from '../reducers/BibleState.reducer';
import { State } from '../types/reduxTypes';
import { loadBible, localBibles, LocalBiblesListItem } from '../util/offlinePersistence';

export default function TranslationPicker() {
  const [availableTranslations, setAvailableTranslations] = React.useState<LocalBiblesListItem[] | undefined>(undefined);
  const stateTranslation = useSelector<State, string>(state => state.BibleState.currentBible?.uuid ?? '');
  const [selectedValue, setSelectedValue] = React.useState<string>(stateTranslation);
  const dispatch = useDispatch();

  React.useEffect(() => {
    localBibles().then(list => setAvailableTranslations(list));
  }, [])

  return availableTranslations ? (
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
          selectedValue={selectedValue}
          onValueChange={async (itemValue) => {
            setSelectedValue(itemValue);
            const bible = await loadBible(itemValue);
            if (bible) {
              dispatch(BibleStateActions.setBible(bible));
            }
          }}
        >
          {availableTranslations.map(translation => (
            <Picker.Item key={translation.uuid} label={`${translation.name} (${translation.shortName})`} value={translation.uuid} />
          ))}
        </Picker>
      </View>
    </View>
  ) : (
    <ActivityIndicator />
  );
}
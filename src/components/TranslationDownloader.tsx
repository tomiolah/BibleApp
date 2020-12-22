import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { CheckBox, Button, Text } from 'react-native-elements';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { getBible, getBibleTranslationsList } from '../util/api';
import { BibleTranslation } from '../types/apiTypes';
import { localBibles, removeBible, saveBible } from '../util/offlinePersistence';

export default function TranslationDownloader({ navigation }: DrawerContentComponentProps) {
  const [translations, setTranslations] = React.useState<
    BibleTranslation[] | undefined
  >(undefined);
  const [localBiblesList, setLocalBiblesList] = React.useState<string[] | undefined>(undefined)
  const [selectedTranslations, setSelectedTranslations] = React.useState<string[]>([]);

  React.useEffect(() => {
    getBibleTranslationsList().then(t => setTranslations(t));
    localBibles().then(l => setLocalBiblesList(l.map(v => v.uuid)));
  }, []);

  return translations !== undefined && localBiblesList !== undefined ? (
  <View>
    {translations.map((translation, index) => (
      <CheckBox
        key={index}
        title={
          <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row' }}>
            <Text>{`${translation.name} (${translation.shortName})`}</Text>
            {localBiblesList.includes(translation.uuid) && (<Button icon={{
              name: 'delete',
              color: '#c21919',
              size: 25,
            }} type="clear" buttonStyle={{
              padding: 0,
            }} onPress={async () => {
              await removeBible(translation.uuid);
              setLocalBiblesList(localBiblesList.filter(v => v !== translation.uuid));
            }} />)}  
          </View>
        }
        checked={selectedTranslations.includes(translation.uuid) || localBiblesList.includes(translation.uuid)}
        checkedColor={localBiblesList.includes(translation.uuid) ? 'grey' : undefined}
        onPress={() => {
          if (!localBiblesList.includes(translation.uuid)) {
            if (!selectedTranslations.includes(translation.uuid)) {
              setSelectedTranslations([
                ...selectedTranslations,
                translation.uuid,
              ]);
            } else {
              setSelectedTranslations(selectedTranslations.filter(v => v !== translation.uuid));
            }
          }
        }}
        containerStyle={{
          backgroundColor: undefined,
          borderWidth: 0,
        }}
      />
    ))}
      <View key="1337">
        {selectedTranslations.length > 0 && (
          <Button buttonStyle={{
            margin: 10,
            height: 50,
          }} title="  DOWNLOAD" icon={{
            name: 'cloud-download-outline',
            type: 'ionicon',
            color: 'white',
            size: 30,
          }} onPress={() => {
            selectedTranslations.forEach(async (t) => {
              try {
                const bible = await getBible(t);
                const uri = await saveBible(bible);
                console.log(`Bible ${bible.shortName} saved to ${uri}!`);
                localBibles().then(l => setLocalBiblesList(l.map(v => v.uuid)));
              } catch (err) {
                console.error(err);
              }
            })
          }} />
        )}
        {localBiblesList.length > 0 && (
          <Button buttonStyle={{
            margin: 10,
            height: 50,
          }} title="DONE" onPress={() => navigation.jumpTo('Navigator')} />
        )}
      </View>
  </View> 
  ) : (
    <ActivityIndicator color="blue" />
  );
}
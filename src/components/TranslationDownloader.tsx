import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { CheckBox, Button, Text } from 'react-native-elements';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { getBible, getBibleTranslationsList } from '../util/api';
import { BibleTranslation } from '../types/apiTypes';
import { localBibles, removeBible, saveBible } from '../util/offlinePersistence';
import useAsyncData from '../hooks/useAsyncData';

type TranslationListItemProps = BibleTranslation & {
  index: number;
  isLocal: boolean;
  isLoading: boolean;
  refreshLocalBiblesList(): void;
};

const TranslationListItem = (props: TranslationListItemProps) => {
  React.useEffect(() => {
    console.log(`${props.index} - ${props.isLoading}`);
  }, [props.isLoading]);
  return (
    <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row' }}>
      <Text>{`${props.name} (${props.shortName})`}</Text>
      {props.isLocal && (<Button icon={{
        name: 'delete',
        color: '#c21919',
        size: 25,
      }} type="clear" buttonStyle={{
        padding: 0,
      }} onPress={() => {
        removeBible(props.uuid).then(() =>
          props.refreshLocalBiblesList()
        );
      }} />)}
      {props.isLoading && (<ActivityIndicator />)}  
    </View>
  );
}

export default function TranslationDownloader({ navigation }: DrawerContentComponentProps) {
  const translations = useAsyncData(getBibleTranslationsList().then(t => {
    setIsLoading(false);
    return t;
  }));
  const [localBiblesList, setLocalBiblesList] = React.useState<string[] | undefined>(undefined)
  const [selectedTranslations, setSelectedTranslations] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    localBibles().then(l => setLocalBiblesList(l.map(v => v.uuid)));
  }, []);

  return translations !== undefined && localBiblesList !== undefined ? (
  <View>
    {translations.map((translation, index) => (
      <CheckBox
        key={index}
        title={(<TranslationListItem {...{
          index,
          ...translation,
          isLocal: localBiblesList.includes(translation.uuid),
          isLoading: isLoading && (
            !localBiblesList.includes(translation.uuid) &&
              selectedTranslations.includes(translation.uuid)
          ), refreshLocalBiblesList: () => 
            localBibles().then(l => setLocalBiblesList(l.map(v => v.uuid))),
        }} />)}
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
        {selectedTranslations.length > 0 && !isLoading && (
          <Button buttonStyle={{
            margin: 10,
            height: 50,
          }} title="  DOWNLOAD" icon={{
            name: 'cloud-download-outline',
            type: 'ionicon',
            color: 'white',
            size: 30,
          }} onPress={() => {
            setIsLoading(true);
            Promise.all(selectedTranslations.map(async (t) => {
              try {
                const bible = await getBible(t);
                await saveBible(bible);
                const l = await localBibles();
                setLocalBiblesList(l.map(v => v.uuid));
                return true;
              } catch (err) {
                console.error(err);
                return false;
              }
            })).then(() => {
              setIsLoading(false);
              setSelectedTranslations([]);
            });
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
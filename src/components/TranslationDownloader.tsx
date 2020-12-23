import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { CheckBox, Button, Text, colors, Icon } from 'react-native-elements';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { getBible, getBibleTranslationsList } from '../util/api';
import { BibleTranslation } from '../types/apiTypes';
import { localBibles, removeBible, saveBible } from '../util/offlinePersistence';
import useAsyncData from '../hooks/useAsyncData';
import { useSelector } from 'react-redux';
import { State } from '../types/reduxTypes';

type TranslationListItemProps = BibleTranslation & {
  index: number;
  isLocal: boolean;
  isLoading: boolean;
  isSelected: boolean;
  refreshLocalBiblesList(): void;
};

const TranslationListItem = (props: TranslationListItemProps) => {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);
  return (
    <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row' }}>
      <Text style={{
        fontSize: 18,
        color: darkTheme ? (props.isLocal ? 'grey' : (
           props.isSelected ? colors.primary : 'white'
        )) : (props.isLocal ? 'grey' : (
           props.isSelected ? colors.primary : 'black'
        )),
      }}>{`${props.name} (${props.shortName})`}</Text>
      {props.isLoading && (<ActivityIndicator />)}  
    </View>
  );
}

export default function TranslationDownloader({ navigation }: DrawerContentComponentProps) {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);
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
          isSelected: selectedTranslations.includes(translation.uuid),
          isLocal: localBiblesList.includes(translation.uuid),
          isLoading: isLoading && (
            !localBiblesList.includes(translation.uuid) &&
              selectedTranslations.includes(translation.uuid)
          ), refreshLocalBiblesList: () => 
            localBibles().then(l => setLocalBiblesList(l.map(v => v.uuid))),
        }} />)}
        checked={selectedTranslations.includes(translation.uuid) || localBiblesList.includes(translation.uuid)}
        checkedColor={localBiblesList.includes(translation.uuid) ? 'grey' : undefined}
        checkedIcon={localBiblesList.includes(translation.uuid) ? (
          <Icon containerStyle={{
            height: '100%',
            marginLeft: -5,
            marginTop: -4,
            marginBottom: 2,
          }} style={{
          }} size={30} name="delete" type="antdesign"
            color="#c21919"
            onPress={() => {
            removeBible(translation.uuid).then(() =>
              localBibles().then(l => setLocalBiblesList(l.map(v => v.uuid)))
            );
          }} />
        ) : undefined}
        uncheckedColor={darkTheme ? 'white' : 'black'}
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
            color: darkTheme ? colors.primary : 'white',
            size: 30,
          }} type={darkTheme ? 'outline' : 'solid'} onPress={() => {
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
            })).finally(() => {
              setSelectedTranslations([]);
              setIsLoading(false);
            });
          }} />
        )}
        {localBiblesList.length > 0 && (
          <Button buttonStyle={{
            margin: 10,
            height: 50,
          }} title="DONE" type={darkTheme ? 'outline' : 'solid'} onPress={() => navigation.jumpTo('Navigator')} />
        )}
      </View>
  </View> 
  ) : (
    <ActivityIndicator color="blue" />
  );
}
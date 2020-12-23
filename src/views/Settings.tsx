import { DrawerContentComponentProps } from '@react-navigation/drawer';
import * as React from 'react';
import { Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { UserConfigActions } from '../reducers/UserConfig.reducer';
import { State, UserConfiguration } from '../types/reduxTypes';
import BaseView from './BaseView';

export default function Settings(props: DrawerContentComponentProps) {
  const configState = useSelector<State, UserConfiguration>(state => state.config);
  const [oneVersePerLine, setOneVersePerLine] = React.useState<boolean>(true);
  const toggleOneVersePerLine = () => setOneVersePerLine(!oneVersePerLine);
  const [darkTheme, setDarkTheme] = React.useState<boolean>(true);
  const toggleDarkTheme = () => setDarkTheme(!darkTheme);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setOneVersePerLine(configState.oneVersePerLine);
    setDarkTheme(configState.darkTheme);
  }, []);

  return (
    <BaseView {...props} title="Settings">
      <CheckBox
        containerStyle={{
          backgroundColor: 'none',
          borderWidth: 0,
        }}
        checked={oneVersePerLine}
        title={
          <Text style={{
            marginLeft: 20,
            fontSize: 18,
            color: darkTheme ? 'white' : 'black',
          }}>One verse per line</Text>
        }
        onPress={() => {
          toggleOneVersePerLine();
          dispatch(UserConfigActions.toggleOneVersePerLine())
        }}
      />
      <CheckBox
        containerStyle={{
          backgroundColor: 'none',
          borderWidth: 0,
        }}
        checked={darkTheme}
        title={
          <Text style={{
            marginLeft: 20,
            fontSize: 18,
            color: darkTheme ? 'white' : 'black',
          }}>Dark theme</Text>
        }
        onPress={() => {
          toggleDarkTheme();
          dispatch(UserConfigActions.toggleDarkTheme())
        }}
      />
    </BaseView>
  );
}
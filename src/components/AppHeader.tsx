import * as React from 'react';
import { StatusBar } from 'react-native';
import { colors, Header, Text } from 'react-native-elements';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { State } from '../types/reduxTypes';

type AppHeaderProps = DrawerContentComponentProps & {
  title: string;
};

export default function AppHeader(props: AppHeaderProps) {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);

  React.useEffect(() => {
    StatusBar.setBarStyle(darkTheme ? 'light-content' : 'default');
    StatusBar.setBackgroundColor(darkTheme ? 'black' : colors.primary)
  }, [darkTheme, StatusBar]);

  return (
    <Header
      containerStyle={{
        backgroundColor: darkTheme ? 'black' : colors.primary,
        borderBottomWidth: 0,
      }}
      leftComponent={{ icon: 'menu', color: 'white', size: 40, onPress: () => {
        props.navigation.toggleDrawer();
      }}}
      centerComponent={(
        <View style={{
          flex: 1,
          justifyContent: 'center',
        }}>
          <Text h4 style={{
            color: 'white',
          }}>{props.title}</Text>
        </View>
      )}
    />
  );
}
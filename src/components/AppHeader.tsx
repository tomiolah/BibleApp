import * as React from 'react';
import { Header, Text } from 'react-native-elements';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { View } from 'react-native';

type AppHeaderProps = DrawerContentComponentProps & {
  title: string;
};

export default function AppHeader(props: AppHeaderProps) {
  return (
    <Header
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
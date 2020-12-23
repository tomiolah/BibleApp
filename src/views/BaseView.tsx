import * as React from 'react';
import { View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AppHeader from '../components/AppHeader';
import { useSelector } from 'react-redux';
import { State } from '../types/reduxTypes';

type BaseViewProps = DrawerContentComponentProps & {
  children: React.ReactNode;
  title: string;
};

export default function BaseView(props: BaseViewProps) {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);
  return (
    <View style={{
      width: '100%',
      height: '100%',
      backgroundColor: darkTheme ? 'black' : 'white',
    }}>
      <AppHeader {...props} />
      {props.children}
    </View>
  );
}
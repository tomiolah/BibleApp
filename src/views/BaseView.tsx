import * as React from 'react';
import { View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AppHeader from '../components/AppHeader';

type BaseViewProps = DrawerContentComponentProps & {
  children: React.ReactNode;
  title: string;
};

export default function BaseView(props: BaseViewProps) {
  return (
    <View style={{
      width: '100%',
      height: '100%',
    }}>
      <AppHeader {...props} />
      {props.children}
    </View>
  );
}
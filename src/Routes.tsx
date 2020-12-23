import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { State } from './types/reduxTypes';
import { localBibles } from './util/offlinePersistence';
import BibleView from './views/BibleView';
import DownloadView from './views/DownloadView';
import Navigator from './views/Navigator';
import useAsyncData from './hooks/useAsyncData';
import Settings from './views/Settings';
import { colors } from 'react-native-elements';

const Drawer = createDrawerNavigator();

const DrawerItem = (props: DrawerContentComponentProps<DrawerContentOptions> & { darkTheme: boolean; }) => (
  <DrawerContentScrollView style={{
    backgroundColor: props.darkTheme ? 'black' : 'white',
  }} {...props}>
    <DrawerItemList {...props} labelStyle={{
      fontSize: 20,
      color: props.darkTheme ? 'white' : 'black',
    }} />
  </DrawerContentScrollView>
);

export default function Routes() {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);
  const hasLocalBibles = useAsyncData(localBibles());
  const hasBible = useSelector<State, boolean>(state => !!state.BibleState.currentBible);
  const hasRef = useSelector<State, boolean>(state => !!state.BibleState.currentRef)

  return hasLocalBibles ? (
    <Drawer.Navigator drawerContent={(props: DrawerContentComponentProps<DrawerContentOptions>) => (
      <DrawerItem {...props} darkTheme={darkTheme} />
    )} initialRouteName={
      hasLocalBibles.length === 0
        ? "Download Bibles" 
        : (hasRef && hasBible) ? "Bible reader" : "Navigator"
    }>
      <Drawer.Screen name="Download Bibles" component={DownloadView} />
      <Drawer.Screen name="Navigator" component={Navigator} />
      <Drawer.Screen name="Bible reader" component={BibleView} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  ) : <ActivityIndicator />;
}

import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { State } from './types/reduxTypes';
import { localBibles, LocalBiblesListItem } from './util/offlinePersistence';
import BibleView from './views/BibleView';
import DownloadView from './views/DownloadView';
import Navigator from './views/Navigator';

const Drawer = createDrawerNavigator();

const DrawerItem = (props: DrawerContentComponentProps<DrawerContentOptions>) => (
  <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} labelStyle={{
      fontSize: 20,
    }} />
  </DrawerContentScrollView>
)

export default function Routes() {
  const [hasLocalBibles, setHasLocalBibles] = React.useState<LocalBiblesListItem[] | undefined>(undefined);
  const hasRef = useSelector<State, boolean>(state => !!state.BibleState.currentRef)

  React.useEffect(() => {
    localBibles().then(list => setHasLocalBibles(list));
  }, []);

  return hasLocalBibles ? (
    <Drawer.Navigator drawerContent={DrawerItem} initialRouteName={
      hasLocalBibles.length === 0
        ? "Download Bibles" 
        : hasRef ? "Bible reader" : "Navigator"
    }>
      <Drawer.Screen name="Download Bibles" component={DownloadView} />
      <Drawer.Screen name="Navigator" component={Navigator} />
      <Drawer.Screen name="Bible reader" component={BibleView} />
    </Drawer.Navigator>
  ) : <ActivityIndicator />;
}

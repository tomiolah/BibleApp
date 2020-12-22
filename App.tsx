import * as React from 'react';
import { Provider } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Routes from './src/Routes';
import useAsyncStore from './src/store';

const Stack = createStackNavigator();

export default function App() {
  const store = useAsyncStore();

  return store ? (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="root" component={Routes} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  ) : (
    <ActivityIndicator />
  );
}

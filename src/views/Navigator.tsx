import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import BookPicker from '../components/BookPicker';
import ChapterPicker from '../components/ChapterPicker';
import TranslationPicker from '../components/TranslationPicker';
import VersePicker from '../components/VersePicker';
import { State } from '../types/reduxTypes';
import BaseView from './BaseView';

export default function Navigator(props: DrawerContentComponentProps) {
  const isOk = useSelector<State, boolean>(({ BibleState }) => 
    !!BibleState.currentBible && !!BibleState.currentRef
  );

  return (
    <BaseView {...props} title="Navigator">
      <View style={{
        margin: 10,
      }}>
        <TranslationPicker />
        <BookPicker />
        <View style={{
          height: 100,
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <View style={{ width: '49%' }}><ChapterPicker /></View>
            <View style={{ width: '49%' }}><VersePicker /></View>
          </View>
        </View>
        {isOk && <Button buttonStyle={{
          padding: 20,
          marginTop: 10,
        }} titleStyle={{
          fontSize: 20,
        }} title="Navigate" onPress={() => props.navigation.jumpTo('Bible reader')} />}
      </View>
    </BaseView>
  );
}
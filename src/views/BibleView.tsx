import * as React from 'react';
import { useSelector } from 'react-redux';
import { View, FlatList, Share } from 'react-native';
import { colors, Icon, Slider, Text} from 'react-native-elements';
import { FloatingAction } from "react-native-floating-action";
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Chapter } from '../types/apiTypes';
import { BibleReference, State } from '../types/reduxTypes';
import { getFontSize, saveFontSize } from '../util/config';
import { numberToSuperscript } from '../util/stringUtils';
import BaseView from './BaseView';

export default function BibleView(props: DrawerContentComponentProps) {
  const ref = useSelector<State, BibleReference | null>(state => state.BibleState.currentRef);
  const currentChapter = useSelector<State, Chapter | null>(state => {
    const currentBible = state.BibleState.currentBible;
    if (currentBible) {
      const currentBook = currentBible.books.find(v => v.title === state.BibleState.currentRef?.book ?? '');
      if (currentBook) {
        return currentBook.chapters[state.BibleState.currentRef?.chapterIndex ?? 0];
      }
    }
    return null;
  });
  const [fontSize, setFontSize] = React.useState<number>(16);
  const [selectionList, setSelectionList] = React.useState<number[]>([]);

  React.useEffect(() => {
    getFontSize().then(v => {
      setFontSize(v);
    });
  }, []);

  React.useEffect(() => {
    saveFontSize(fontSize);
  }, [fontSize]);
  
  return currentChapter ? (
    <BaseView {...props} title="Bible reader">
      <View style={{
        flex: 1,
        margin: 10,
        marginTop: 0,
      }}>
          <FlatList
            style={{
              height: '100%',
            }}
            showsVerticalScrollIndicator={false}
            data={currentChapter.verses}
            keyExtractor={(_, index) => `${index}`}
            renderItem={({ item, index }) => (
              <Text onPress={() => {
                if (selectionList.length > 0) {
                  if (selectionList.includes(index)) {
                    setSelectionList(selectionList.filter(v => v !== index));
                  } else {
                    setSelectionList([...selectionList, index]);
                  }
                } else {
                  setSelectionList([index]);
                }
              }} style={{
                fontSize,
                backgroundColor: selectionList.includes(index) ? 'lightblue' : (
                  ref?.verseIndex === index ? 'lightyellow' : undefined
                ),
              }}><Text style={{
                color: '#ababab',
                fontSize,
              }}>{numberToSuperscript(index + 1) + ' '}</Text>{item.text}</Text>
            )}
          />
        <View style={{
          height: '8%',
          marginTop: 10,
        }}>
          <Text style={{
            color: 'grey',
          }}>Font size: {fontSize}</Text>
          <Slider
            value={fontSize}
            onValueChange={value => setFontSize(value)}
            thumbTintColor={colors.primary}
            thumbStyle={{
              height: 30,
              width: 30,
            }}
            maximumValue={100}
            minimumValue={0}
            step={1}
          />
        </View>
      </View>
      {selectionList.length > 0 && (
        <FloatingAction
          floatingIcon={<Icon color="white" name="more-horizontal" type="feather" />}
          actions={[
            { icon: <Icon color="white" name="share" type="entypo" />, name: 'share' },
            { icon: <Icon color="white" name="x" type="feather" />, name: 'cancel' }
          ]}
          onPressItem={name => {
            const reset = () => setSelectionList([]);
            if (name === 'cancel') {
              reset();
            }
            if (name === 'share') {
              const verses = `"${
                currentChapter.verses
                .filter((_, i) => selectionList.includes(i))
                .map(v => v.text).join(' ')
              }" ${ref!.book}${ref!.chapterIndex}:${
                selectionList.sort((a, b) => a - b).reduce((p, c) => {
                  if (p.length === 0) {
                    return [[c]];
                  }
                  const last = p[p.length - 1];
                  if (last[last.length - 1] === c - 1) {
                    return [...p.slice(0, p.length - 1), [...last, c]]
                  }
                  return [...p, [c]];
                }, [] as number[][]).map((v) => {
                  if (v.length === 1) {
                    return `${v[0]}`;
                  }
                  return `${v[0]}-${v[v.length - 1]}`;
                }).join(', ')
              }\n`;
              Share.share({
                title: 'Share Bible verse',
                message: verses,
              }).then(reset, reset);
            }
          }}
        />
      )}
    </BaseView>
  ) : null;
}
import * as React from 'react';
import { useSelector } from 'react-redux';
import { View, FlatList, Share } from 'react-native';
import { colors, Icon, Slider, Text} from 'react-native-elements';
import { FloatingAction } from "react-native-floating-action";
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Chapter, Verse } from '../types/apiTypes';
import { BibleReference, State } from '../types/reduxTypes';
import { getFontSize, saveFontSize } from '../util/config';
import { numberToSuperscript } from '../util/stringUtils';
import BaseView from './BaseView';
import { ScrollView } from 'react-native-gesture-handler';
import { loadBible, LocalBiblesListItem } from '../util/offlinePersistence';
import useAsyncData from '../hooks/useAsyncData';

type ListProps = {
  reference: BibleReference | undefined;
  fontSize?: number;
  currentChapter: Chapter;
  selectionList: number[];
  setSelectionList(list: number[]): void;
};

type ListItemProps = ListProps & {
  index: number;
  item: Verse;
  noSpace?: boolean;
};

const VerseComponent = (props: ListItemProps) => {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);

  return (
    <Text onPress={() => {
      if (props.selectionList.length > 0) {
        if (props.selectionList.includes(props.index)) {
          props.setSelectionList(props.selectionList.filter(v => v !== props.index));
        } else {
          props.setSelectionList([...props.selectionList, props.index]);
        }
      } else {
        props.setSelectionList([props.index]);
      }
    }} style={{
      fontSize: props.fontSize,
      color: darkTheme ? 'white' : 'black',
      backgroundColor: props.selectionList.includes(props.index) ? (
        darkTheme ? '#395aad' : 'lightblue'
      ) : (
        props.reference?.verseIndex === props.index ? 'rgba(255, 213, 0, 0.3)' : undefined
      ),
    }}><Text style={{
      color: darkTheme ? '#808080' : '#ababab',
      fontSize: props.fontSize,
    }}>{numberToSuperscript(props.index + 1) + (props.noSpace ? '' : ' ')}</Text>{props.item.text}</Text>
  );
}

const List = (props: ListProps) => (
  <FlatList
    style={{
      height: '100%',
    }}
    showsVerticalScrollIndicator={false}
    data={props.currentChapter.verses}
    keyExtractor={(_, index) => `${index}`}
    renderItem={({ item, index }) => (
      <VerseComponent {...{...props, item, index}} />
    )}
  />
)

export default function BibleView(props: DrawerContentComponentProps) {
  const darkTheme = useSelector<State, boolean>(state => state.config.darkTheme);
  const reference = useSelector<State, BibleReference | undefined>(state => state.BibleState.currentRef);
  const currentBible = useSelector<State, LocalBiblesListItem | undefined>(state => state.BibleState.currentBible);
  const loadedBible = useAsyncData(loadBible(currentBible?.uuid ?? ''), [currentBible]);
  const currentBook = React.useMemo(() => {
    console.log(loadedBible?.name);
    const lbb = loadedBible?.books ?? []
    if (lbb.length > 0) {
      return lbb[reference?.book ?? 0];
    }
    return undefined;
    }, [loadedBible]
  );
  const currentChapter = React.useMemo(() => {
      if (currentBook) {
        const chapters = currentBook.chapters;
        const chapter = reference?.chapterIndex ?? 0;
        if (chapter >= 0 && chapter < chapters.length - 1) {
          return chapters[chapter];
        }
        return undefined;
      }
    }, [currentBook]
  );
  const oneVersePerLine = useSelector<State, boolean>(state => state.config.oneVersePerLine);
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
  
  return currentChapter && reference && currentBible && currentBook ? (
    <BaseView {...props} title={`${currentBook.title}${reference.chapterIndex + 1}:${(reference?.verseIndex ?? 0) + 1} (${currentBible.shortName})`}>
      <View style={{
        flex: 1,
        margin: 10,
        marginTop: 0,
      }}>
        {oneVersePerLine ? (
          <List {...{reference: reference, currentChapter, selectionList, setSelectionList, fontSize}} />
        ) : (
          <ScrollView style={{
            height: '100%',
          }}>
            <Text>
              {currentChapter.verses.map((v, i) => (
                <React.Fragment key={i}>
                  {i === 0 ? '' : ' '}
                  <VerseComponent {...{
                    index: i, item: v, noSpace: false,
                    reference: reference, currentChapter, fontSize,
                    selectionList, setSelectionList,
                  }} />
                </React.Fragment>
              ))}
            </Text>
          </ScrollView>
        )}
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
            minimumTrackTintColor={darkTheme ? '#2c354a' : '#282c36'}
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
          showBackground
          overlayColor="rgba(0,0,0,0.8)"
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
              }" ${reference!.book}${reference!.chapterIndex}:${
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
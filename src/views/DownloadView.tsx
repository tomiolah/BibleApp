import * as React from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import BaseView from './BaseView';
import TranslationDownloader from '../components/TranslationDownloader';

export default function DownloadView(props: DrawerContentComponentProps) {
  return (
    <BaseView {...props} title="Download Bibles">
      <TranslationDownloader {...props} />
    </BaseView>
  );
}
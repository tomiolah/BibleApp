import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFontSize = async (size: number) => {
  await AsyncStorage.setItem('fontSize', JSON.stringify(size));
}

export const getFontSize = async () => {
  const size = await AsyncStorage.getItem('fontSize');
  return size ? JSON.parse(size) as number : 16;
}

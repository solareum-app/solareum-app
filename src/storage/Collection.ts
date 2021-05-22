/**
 * Using this `Collection` when your collection has more than 1 record
 * This provides some api that enable you to work with multiple records
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const getKey = (collection: string, id: string) => {
  return `${collection}-${id}`;
};

export const getItem = async (collection: string, id: string) => {
  const key = getKey(collection, id);
  const data = await AsyncStorage.getItem(key);

  if (!data) {
    throw Error(`Unable to get data for key: ${key}`);
  }

  return JSON.parse(data);
};

export const setItem = async (collection: string, id: string, value: any) => {
  const key = getKey(collection, id);
  return await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getCollection = async (collection: string) => {
  const keyList = await AsyncStorage.getAllKeys();
  const selectedKeyList = keyList.filter((i) => i.startsWith(collection));
  const data = await AsyncStorage.multiGet(selectedKeyList);
  return data.map((i) => {
    const t = JSON.parse(i[1] || '{}');
    return {
      key: i[0],
      ...t,
    };
  });
};

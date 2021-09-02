/**
 * Using this `Collection` when your collection has more than 1 record
 * This provides some api that enable you to work with multiple records
 */

import AsyncStorage from './';

// AsyncStorage.clear();

const getKey = (collection: string = 'SYS', id: string) => {
  return `${collection}-${id}`;
};

export const getItem = async (collection: string, id: string) => {
  const key = getKey(collection, id);
  const data = await AsyncStorage.getItem(key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const setItem = async (collection: string, id: string, value: any) => {
  const key = getKey(collection, id);
  return await AsyncStorage.setItem(
    key,
    typeof value === 'string' ? value : JSON.stringify(value),
  );
};

export const removeItem = async (collection: string, id: string) => {
  try {
    const key = getKey(collection, id);
    await AsyncStorage.removeItem(key);
    return true;
  } catch (err) {
    throw new Error(err);
  }
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

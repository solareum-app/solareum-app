import { getItem, setItem } from './Collection';

export const COLLECTION_NAME = 'SVG_ICON';

export const getIcon = async (name: string) => {
  return getItem(COLLECTION_NAME, name);
};

export const setIcon = async (name: string, value: string) => {
  return setItem(COLLECTION_NAME, name, value);
};

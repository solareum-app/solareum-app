import { getItem, setItem, getCollection } from './Collection';
import { v4 } from 'uuid';

export const COLLECTION_NAME = 'WALLET';

export const createWallet = async (seedPhrase: string) => {
  const wallet = {
    collection: COLLECTION_NAME,
    id: v4(),
    seedPhrase,
  };
  return await setItem(COLLECTION_NAME, wallet.id, wallet);
};

export const getWalletById = async (id: string) => {
  return await getItem(COLLECTION_NAME, id);
};

export const getListWallet = async () => {
  return await getCollection(COLLECTION_NAME);
};

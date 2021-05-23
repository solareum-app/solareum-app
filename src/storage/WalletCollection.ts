import { getItem, setItem, getCollection } from './Collection';
import { v4 } from 'uuid';

export const COLLECTION_NAME = 'WALLET';

export const createWallet = async (
  seed: string,
  mnemonic: string,
  name?: string,
  isStored: boolean = false,
) => {
  const wallet = {
    collection: COLLECTION_NAME,
    id: v4(),
    seed,
    mnemonic,
    name,
    isStored,
  };

  await setItem(COLLECTION_NAME, wallet.id, wallet);
  return await getWalletById(wallet.id);
};

export const getWalletById = async (id: string) => {
  return await getItem(COLLECTION_NAME, id);
};

export const getListWallet = async () => {
  return await getCollection(COLLECTION_NAME);
};

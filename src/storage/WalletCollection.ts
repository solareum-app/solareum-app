import { getItem, setItem, removeItem, getCollection } from './Collection';
import { v4 } from 'uuid';

export const COLLECTION_NAME = 'WALLET';

export type AddressInfo = {
  collection: string;
  id: string;
  name: string;
  seed: string;
  mnemonic: string;
  isStored: boolean;
  address?: string;
};

export const createWallet = async (
  seed: string,
  mnemonic: string,
  name: string,
  isStored: boolean = false,
  address: string,
): Promise<AddressInfo> => {
  const wallet: AddressInfo = {
    collection: COLLECTION_NAME,
    id: v4(),
    name,
    seed,
    mnemonic,
    isStored,
    address,
  };

  await setItem(COLLECTION_NAME, wallet.id, wallet);
  return await getWalletById(wallet.id);
};

export const updateWallet = async (
  id: string,
  name: string,
  isStored: boolean = false,
) => {
  const wallet = await getWalletById(id);
  await setItem(COLLECTION_NAME, wallet.id, {
    ...wallet,
    name,
    isStored,
  });
  return await getWalletById(wallet.id);
};

export const removeWalletById = async (id: string) => {
  return await removeItem(COLLECTION_NAME, id);
};

export const getWalletById = async (id: string): Promise<AddressInfo> => {
  return await getItem(COLLECTION_NAME, id);
};

export const getListWallet = async (): Promise<AddressInfo[]> => {
  return await getCollection(COLLECTION_NAME);
};

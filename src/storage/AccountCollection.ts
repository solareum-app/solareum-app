import { setItem, getCollection } from './Collection';
import { IAccount } from '../core/AppProvider/IAccount';

export const COLLECTION_NAME = 'ACCOUNT';

export const storeAccountList = async (accountList: IAccount[]) => {
  for (let i = 0; i < accountList.length; i++) {
    const item = accountList[i];
    await setItem(COLLECTION_NAME, item.publicKey, item);
  }
  return true;
};

export const getAccountListByOwner = async (pk: string) => {
  const list = await getCollection(COLLECTION_NAME);
  return list.filter((i) => i.owner === pk);
};

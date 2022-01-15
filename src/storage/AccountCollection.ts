import { setItem, getCollection } from './Collection';
import { IAccount } from '../core/AppProvider/IAccount';

export const COLLECTION_NAME = 'ACCOUNT';

export const storeAccountList = async (accountList: IAccount[]) => {
  const activeAccountList = accountList.filter((i) => i.publicKey);
  for (let i = 0; i < activeAccountList.length; i++) {
    const item = activeAccountList[i];
    await setItem(COLLECTION_NAME, item.publicKey, item);
  }
  return true;
};

export const getAccountListByOwner = async (pk: string) => {
  const list = await getCollection(COLLECTION_NAME);
  return list.filter((i) => i.owner === pk);
};

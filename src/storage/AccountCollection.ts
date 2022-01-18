import { setItem, getCollection, removeItem } from './Collection';
import { IAccount } from '../core/AppProvider/IAccount';

export const COLLECTION_NAME = 'ACCOUNT';

export const storeAccountItem = async (account: IAccount) => {
  await setItem(COLLECTION_NAME, account.publicKey, account);
  return true;
};

export const storeAccountList = async (accountList: IAccount[]) => {
  const activeAccountList = accountList.filter((i) => i.publicKey);
  for (let i = 0; i < activeAccountList.length; i++) {
    const item = activeAccountList[i];
    await setItem(COLLECTION_NAME, item.publicKey, item);
  }
  return true;
};

export const removeInactiveAccountList = async (accountList: IAccount[]) => {
  const inactiveAccountList = accountList.filter((i) => !i.publicKey);
  for (let i = 0; i < inactiveAccountList.length; i++) {
    const item = inactiveAccountList[i];
    await removeItem(COLLECTION_NAME, item.publicKey);
  }
  return true;
};

export const getAccountListByOwner = async (pk: string) => {
  const list = await getCollection(COLLECTION_NAME);
  // TODO: remove this when most of user get updated
  await removeInactiveAccountList(list);
  return list.filter((i) => i.owner === pk);
};

import { createAccountList, IAccount } from './IAccount';

import { EventEmitter } from './EventEmitter';
import { getAccountListByOwner } from '../../storage/AccountCollection';
import { getAccountList } from '../../spl-utils/getWallet';
import { Wallet } from '../../spl-utils/wallet';

type AccountData = {
  [key: string]: IAccount;
};

type SnapshotData = {
  [key: string]: any;
};

const mergeIsHidingToOnChainData = (onchainList, storeList) => {
  return onchainList.map((i) => {
    const item = storeList.find((j) => j.publicKey === i.publicKey) || {};
    return {
      ...i,
      isHiding: item.isHiding || false,
    };
  });
};

export enum ACCOUNT_EVENT {
  ready = 'ready',
  updated = 'updated',
}

export class AccountFactory {
  wallet: Wallet;
  owner: string;
  accountData: AccountData = {};
  eventEmitter: EventEmitter;
  snapshot: SnapshotData;
  ready = false;
  accountList: IAccount[] = [];

  constructor(wallet: any) {
    this.wallet = wallet;
    this.owner = wallet.publicKey.toBase58();
    this.accountData = {};
    this.snapshot = {};
    this.eventEmitter = new EventEmitter();

    this.initAccount();
  }

  fillAccountData = (list: IAccount[]) => {
    const activeAccounts = list.filter((i) => i.publicKey);
    for (let i = 0; i < activeAccounts.length; i++) {
      const item = activeAccounts[i];
      this.accountData[item.publicKey] = item;
    }
  };

  // init account from local storage
  initAccount = async () => {
    // load account from cache
    const list = await getAccountListByOwner(this.owner);
    this.accountList = list;
    this.fillAccountData(list);

    this.ready = true;
    this.emit(ACCOUNT_EVENT.ready, {});

    // load account from on-chain data
    this.loadAccounts();
  };

  loadAccounts = async () => {
    const localAccounts = this.getActiveAccounts();
    const accountList = await getAccountList(this.wallet, localAccounts);
    const mergedAccList = mergeIsHidingToOnChainData(
      accountList,
      localAccounts,
    );
    const accList = createAccountList(this.tokenInfos, mergedAccList, {});

    this.fillAccountData(accList);
    this.accountList = accList;
    this.emit(ACCOUNT_EVENT.updated, { length: this.accountList.length });
  };

  /**
   * internal events & cplx events are available
   */
  add = (event: string, callback: Function) => {
    this.eventEmitter.add(event, callback);

    // trigger 1 event right after subscribe
    // no need to wait for the factory get ready
    if (this.snapshot[event]) {
      this.emit(event, this.snapshot[event]);
    }
  };

  remove = (event: string, callback: Function) => {
    this.eventEmitter.remove(event, callback);
  };

  // TODO: we can handle throttle here to optimize performance
  emit = (event: string, payload: any) => {
    this.snapshot[event] = payload;
    this.eventEmitter.emit(event, payload);
  };

  setTokenInfos = () => {};
  setPriceSource = () => {};
  setAccountList = () => {};

  getActiveAccounts = () => {
    const keys = Object.keys(this.accountData);
    const tokens: any[] = [];
    for (let i = 0; i < keys.length; i++) {
      const index = keys[i];
      tokens.push(this.accountData[index]);
    }
    return tokens;
  };
}

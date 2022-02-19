import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';

import { getAccountList, getAccountInfo } from '../../spl-utils/getWallet';
import { getAccountListByOwner } from '../../storage/AccountCollection';
import { LoadingImage } from '../../components/LoadingIndicator';
import { MAINNET_URL } from '../../config';

import { clusterForEndpoint } from './clusters';
import { Cluster } from './types';
import { IAccount, createAccountList } from './IAccount';
import { useApp } from './AppProvider';
import { useConfig } from './RemoteConfigProvider';
import { getUniqByAddress } from './getUniqByAddress';

export type TokenContextType = {
  accountList: IAccount[];
  getAccountByPk: Function;
  setAccountByPk: Function;
  tokenInfos: TokenInfo[];
  loadAccountList: Function;
  toggleAccountByPk: Function;
  ready: boolean;
};
export const TokenContext = React.createContext<TokenContextType>({
  accountList: [],
  getAccountByPk: () => null,
  setAccountByPk: () => null,
  tokenInfos: [],
  loadAccountList: () => null,
  toggleAccountByPk: () => null,
  ready: false,
});

export const useToken = () => {
  return useContext(TokenContext);
};

/**
 * TOKEN structure
 {
    "chainId": 101,
    "address": "<SOLAREUM>",
    "symbol": "XSB",
    "name": "Solareum",
    "decimals": 9,
    "logoURI": "https://solareum.app/icons/XSB-P.png",
    "tags": [
      "Solareum",
      "Wallet",
      "Serum Dex"
    ],
    "extensions": {
      "wealthclub": "https://wealthclub.vn",
      "twitter": "https://twitter.com/solareum_wallet",
      "telegram": "https://t.me/solareum_wallet",
      "policy": "https://www.wealthclub.vn/t/solareum-wallet-dieu-khoan-su-dung/418",
      "website": "https://solareum.app",
    }
  },

  Market Structure
  {
    "name": "SAMO/USDC",
    "address": "FR3SPJmgfRSKKQ2ysUZBu7vJLpzTixXnjzb84bY3Diif",
    "programId": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    "deprecated": false
  }
 */

const CUSTOM_TOKENS = [
  {
    address: 'SOL',
    symbol: 'SOL',
    name: 'Solana',
    extensions: {
      coingeckoId: 'solana',
    },
    logoURI:
      'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png',
  },
  {
    chainId: 101,
    address: '4UuGQgkD3rSeoXatXRWwRfRd21G87d5LiCfkVzNNv1Tt',
    symbol: 'XSB',
    name: 'Solareum',
    decimals: 9,
    logoURI: 'https://solareum.app/icons/XSB-G.png',
    tags: ['Solareum', 'Wallet', 'Serum Dex'],
    extensions: {
      coingeckoId: 'solareum-wallet',
      wealthclub: 'https://wealthclub.vn',
      twitter: 'https://twitter.com/solareum_wallet',
      telegram: 'https://t.me/solareum_wallet',
      policy:
        'https://www.wealthclub.vn/t/solareum-wallet-dieu-khoan-su-dung/418',
      website: 'https://solareum.app',
    },
  },
];

const mergeIsHidingToOnChainData = (onchainList, storeList) => {
  return onchainList.map((i) => {
    const item = storeList.find((j) => j.publicKey === i.publicKey) || {};
    return {
      ...i,
      isHiding: item.isHiding || false,
    };
  });
};

type AccountData = {
  [key: string]: IAccount;
};

const listToObject = (list: IAccount[]): AccountData => {
  let data: AccountData = {};
  const activeAccount = list.filter((i) => i.publicKey);
  for (let i = 0; i < activeAccount.length; i++) {
    const item = activeAccount[i];
    data[item.publicKey] = item;
  }
  return data;
};

const objectToList = (data: AccountData): IAccount[] => {
  const list = Object.keys(data);
  return list.map((i) => data[i]);
};

let accountSource: AccountData = {};

export const TokenProvider: React.FC = (props) => {
  const { wallet } = useApp();
  const { customeTokenList } = useConfig();
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([]);
  const [accountList, setAccountListOrg] = useState<IAccount[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const triggerChanges = () => {
    const activeAccounts = objectToList(accountSource);
    const l = accountList.map((i) => {
      const item =
        activeAccounts.find((j) => j.publicKey === i.publicKey) || {};
      return {
        ...i,
        ...item,
      };
    });
    setAccountListOrg(l);
  };

  const setAccountList = (list: IAccount[]) => {
    accountSource = listToObject(list);
    setAccountListOrg(list);
  };

  // isHidingValue = 1 => show
  // isHidingValue = -1 => hide
  const toggleAccountByPk = (pk: string, isHidingValue: number = 0) => {
    const item = accountSource[pk] || {};
    accountSource[pk] = {
      ...accountSource[pk],
      isHiding: isHidingValue > 0 ? false : !item.isHiding,
    };
    triggerChanges();
    return 0;
  };

  const getAccountByPk = async (pk: string) => {
    const account = await getAccountInfo(new PublicKey(pk));
    accountSource[pk] = {
      ...accountSource[pk],
      ...account,
    };
    triggerChanges();
    return accountSource[pk];
  };

  const setAccountByPk = async (pk: string, account: any) => {
    accountSource[pk] = {
      ...accountSource[pk],
      ...account,
    };
    triggerChanges();
    return accountSource[pk];
  };

  const loadAccountFromStore = async (owner: string) => {
    const list = await getAccountListByOwner(owner);
    const storeAccList = createAccountList(tokenInfos, list, {});
    setAccountList(storeAccList);
  };

  const loadAccountList = async () => {
    if (!wallet) {
      return;
    }

    // get data from the chain
    try {
      const owner = wallet.publicKey.toBase58();
      const storeList = await getAccountListByOwner(owner);
      const accs = await getAccountList(wallet, storeList);
      const mergedAccList = mergeIsHidingToOnChainData(accs, storeList);
      const accList = createAccountList(tokenInfos, mergedAccList, {});

      setAccountList(accList);
      return accList;
    } catch {
      return accountList;
    }
  };

  useEffect(() => {
    if (!wallet) {
      return;
    }

    (async () => {
      const owner = wallet.publicKey.toBase58();
      await loadAccountFromStore(owner);
      if (tokenInfos.length) {
        await loadAccountList();
        setReady(true);
      }
    })();
  }, [wallet, tokenInfos]);

  useEffect(() => {
    const tokenListProvider = new TokenListProvider();
    tokenListProvider.resolve().then(async (tokenListContainer) => {
      const cluster: Cluster | undefined = clusterForEndpoint(MAINNET_URL);
      const filteredTokenListContainer =
        tokenListContainer?.filterByClusterSlug(cluster ? cluster.name : '');
      const listOfTokens =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : null; // Workaround for filter return all on unknown slug

      const tokenList =
        CUSTOM_TOKENS.concat(customeTokenList).concat(listOfTokens);
      const uniqTokenList = getUniqByAddress(tokenList);

      setTokenInfos(uniqTokenList);
    });
  }, []);

  return (
    <TokenContext.Provider
      value={{
        tokenInfos,
        accountList,
        getAccountByPk,
        loadAccountList,
        toggleAccountByPk,
        setAccountByPk,
        ready,
      }}
    >
      {tokenInfos.length ? props.children : <LoadingImage />}
    </TokenContext.Provider>
  );
};

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
};
export const TokenContext = React.createContext<TokenContextType>({
  accountList: [],
  getAccountByPk: () => null,
  setAccountByPk: () => null,
  tokenInfos: [],
  loadAccountList: () => null,
  toggleAccountByPk: () => null,
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

export const TokenProvider: React.FC = (props) => {
  const { wallet } = useApp();
  const { customeTokenList } = useConfig();

  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([]);
  const [accountList, setAccountList] = useState<IAccount[]>([]);

  // isHidingValue = 1 => show
  // isHidingValue = -1 => hide
  const toggleAccountByPk = (pk: string, isHidingValue: number = 0) => {
    const newAccountList = accountList.map((i) => {
      if (i.publicKey === pk) {
        return {
          ...i,
          isHiding: isHidingValue > 0 ? false : !i.isHiding,
        };
      }
      return i;
    });
    setAccountList(newAccountList);
    return 0;
  };

  const getAccountByPk = async (pk: string) => {
    const account = await getAccountInfo(new PublicKey(pk));
    const newAccountList = accountList.map((i) => {
      if (i.publicKey === account?.publicKey) {
        return {
          ...i,
          ...account,
        };
      }
      return i;
    });
    setAccountList(newAccountList);
    return account;
  };

  const setAccountByPk = async (pk: string, account: any) => {
    const newAccountList = accountList.map((i) => {
      if (i.publicKey === pk) {
        return {
          ...i,
          ...account,
        };
      }
      return i;
    });

    setAccountList(newAccountList);
    const newAccount = newAccountList.find((i) => i.publicKey === pk);
    return newAccount;
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

  useEffect(() => {
    if (!wallet) {
      return;
    }
    const owner = wallet.publicKey.toBase58();
    loadAccountFromStore(owner);
    loadAccountList();
  }, [wallet]);

  return (
    <TokenContext.Provider
      value={{
        tokenInfos,
        accountList,
        getAccountByPk,
        loadAccountList,
        toggleAccountByPk,
        setAccountByPk,
      }}
    >
      {tokenInfos.length ? props.children : <LoadingImage />}
    </TokenContext.Provider>
  );
};

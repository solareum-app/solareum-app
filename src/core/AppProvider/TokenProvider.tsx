import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';

import { useInterval } from '../../hooks/useInterval';
import { getAccountList, getAccountInfo } from '../../spl-utils/getWallet';
import {
  storeAccountList,
  getAccountListByOwner,
} from '../../storage/AccountCollection';
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
  tokenInfos: TokenInfo[];
  priceData: any;
  loadAccountList: Function;
};
export const TokenContext = React.createContext<TokenContextType>({
  accountList: [],
  getAccountByPk: () => null,
  tokenInfos: [],
  priceData: {},
  loadAccountList: () => null,
});

export const useToken = () => {
  return useContext(TokenContext);
};

const SOL_TOKEN = {
  address: 'SOL',
  symbol: 'SOL',
  name: 'Solana',
  extensions: {
    coingeckoId: 'solana',
  },
  logoURI:
    'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png',
};

const fetchPriceData = async (tokenList: TokenInfo[] = []) => {
  const list = tokenList.map((i) => i.extensions?.coingeckoId) || [];
  const filtered = list.filter((i) => i !== undefined);
  const price = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${filtered.join(
      ',',
    )}&vs_currencies=usd,vnd`,
  )
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    });
  return price;
};

export const TokenProvider: React.FC = (props) => {
  const { wallet } = useApp();
  const { customeTokenList } = useConfig();

  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([]);
  const [accountList, setAccountListSource] = useState<IAccount[]>([]);
  const [priceData, setPriceData] = useState({});

  const setAccountList = async (list: IAccount[]) => {
    setAccountListSource(list);
    await storeAccountList(list);
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

  const loadAccountFromStore = async (owner: string) => {
    const list = await getAccountListByOwner(owner);
    const storeAccList = createAccountList(tokenInfos, list, priceData);

    setAccountListSource(storeAccList);
  };

  const loadAccountList = async () => {
    if (!wallet) {
      return;
    }

    // get data from the store
    const owner = wallet.publicKey.toBase58();
    loadAccountFromStore(owner);

    // get data from the chain
    try {
      const accs = await getAccountList(wallet);
      const priceMapping = await fetchPriceData(tokenInfos);
      const accList = createAccountList(tokenInfos, accs, priceMapping);

      setPriceData(priceMapping);
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

      const tokenList = [SOL_TOKEN]
        .concat(listOfTokens)
        .concat(customeTokenList);
      const uniqTokenList = getUniqByAddress(tokenList);
      const priceMapping = await fetchPriceData(uniqTokenList).catch(() => []);
      const accList = createAccountList(
        uniqTokenList,
        accountList,
        priceMapping,
      );

      setTokenInfos(uniqTokenList);
      setPriceData(priceMapping);
      setAccountList(accList);
    });
  }, []);

  useEffect(() => {
    if (!wallet) {
      return;
    }
    const owner = wallet.publicKey.toBase58();
    loadAccountFromStore(owner);
  }, [wallet]);

  // fetch new price every 5 mins = 5 * 60.000
  useInterval(() => {
    (async () => {
      const priceMapping = await fetchPriceData(tokenInfos);
      const accList = createAccountList(tokenInfos, accountList, priceMapping);
      setPriceData(priceMapping);
      setAccountList(accList);
    })();
  }, 300000);

  return (
    <TokenContext.Provider
      value={{
        tokenInfos,
        priceData,
        accountList,
        getAccountByPk,
        loadAccountList,
      }}
    >
      {tokenInfos.length ? props.children : <LoadingImage />}
    </TokenContext.Provider>
  );
};

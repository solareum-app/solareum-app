import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import { getListWallet } from '../../storage/WalletCollection';
import { useConnectionConfig } from '../ConnectionProvider';
import { clusterForEndpoint } from './clusters';
import { getWallet } from '../../spl-utils/getWallet';
import { Cluster } from './types';

export type TokenInfos = TokenInfo[] | null;
export type TokenListContextType = {
  tokenInfos: TokenInfos;
  priceData: any;
  setTokenList: Function;
  wallet: any;
  setWallet: Function;
};
export const TokenListContext = React.createContext<TokenListContextType>({
  tokenInfos: null,
  priceData: {},
  setTokenList: () => null,
  wallet: null,
  setWallet: () => null,
});

export const TokenRegistryProvider: React.FC = (props) => {
  const { endpoint } = useConnectionConfig();
  const [tokenInfos, setTokenInfos] = useState<TokenInfos>(null);
  const [tokenList, setTokenList] = useState([]);
  const [priceData, setPriceData] = useState({});
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const tokenListProvider = new TokenListProvider();
    tokenListProvider.resolve().then((tokenListContainer) => {
      const cluster: Cluster | undefined = clusterForEndpoint(endpoint);

      const filteredTokenListContainer = tokenListContainer?.filterByClusterSlug(
        cluster ? cluster.name : '',
      );
      const listOfTokens =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : null; // Workaround for filter return all on unknown slug

      setTokenInfos(listOfTokens);
    });
  }, [endpoint]);


  // get data from coingekco
  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenList.join(',')}&vs_currencies=usd,vnd`)
      .then(resp => resp.json())
      .then(data => {
        setPriceData(data);
      }).catch(() => {
        setPriceData({});
      })
  }, [tokenList]);

  // init wallet
  const initWallet = async () => {
    const list = await getListWallet();
    const data = list[0];
    if (!data) {
      return;
    }
    const w = await getWallet(data.mnemonic, data.name);
    setWallet(w);
  }

  useEffect(() => {
    setTokenList(['solana']);
    initWallet();
  }, []);

  return (
    <TokenListContext.Provider value={{
      tokenInfos,
      priceData,
      setTokenList,
      wallet,
      setWallet
    }}>
      {props.children}
    </TokenListContext.Provider>
  );
};

export const usePrice = () => {
  const { priceData } = useContext(TokenListContext);
  return priceData;
};

export const useTokenInfos = () => {
  const { tokenInfos } = useContext(TokenListContext);
  return tokenInfos;
};

export const useWallet = () => {
  const { wallet, setWallet } = useContext(TokenListContext);
  return [wallet, setWallet];
};

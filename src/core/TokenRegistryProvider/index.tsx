import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import { useConnectionConfig } from '../ConnectionProvider';
import { clusterForEndpoint } from './clusters';
import { Cluster } from './types';

export type TokenInfos = TokenInfo[] | null;
export type TokenListContextType = {
  tokenInfos: TokenInfos;
  priceData: any;
  setTokenList: Function;
};
export const TokenListContext = React.createContext<TokenListContextType>({
  tokenInfos: null,
  priceData: {},
  setTokenList: () => null,
});

export const TokenRegistryProvider: React.FC = (props) => {
  const { endpoint } = useConnectionConfig();
  const [tokenInfos, setTokenInfos] = useState<TokenInfos>(null);
  const [tokenList, setTokenList] = useState([]);
  const [priceData, setPriceData] = useState({});

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

  return (
    <TokenListContext.Provider value={{ tokenInfos, priceData, setTokenList }}>
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

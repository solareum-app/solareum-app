import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import { useConnectionConfig } from '../ConnectionProvider';
import { clusterForEndpoint } from './clusters';
import { Cluster } from './types';

type TokenInfos = TokenInfo[] | null;
type TokenListContextType = {
  tokenInfos: TokenInfos;
};
const TokenListContext = React.createContext<TokenListContextType>({
  tokenInfos: null,
});

export const TokenRegistryProvider: React.FC = (props) => {
  const { endpoint } = useConnectionConfig();
  const [tokenInfos, setTokenInfos] = useState<TokenInfos>(null);

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

  return (
    <TokenListContext.Provider value={{ tokenInfos }}>
      {props.children}
    </TokenListContext.Provider>
  );
};

export const useTokenInfos = () => {
  const { tokenInfos } = useContext(TokenListContext);

  return tokenInfos;
};

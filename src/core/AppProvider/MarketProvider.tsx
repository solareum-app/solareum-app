import React, { useContext, useState, useEffect } from 'react';
import { MARKETS as ALL_MARKETS } from '@project-serum/serum';
import { TokenInfo } from '@solana/spl-token-registry';
import { useApp } from './index';

const MARKETS = ALL_MARKETS.filter((i) => !i.deprecated);

export type MarketInfo = {
  id: string;
  name: string;
  programId: string;
  base: string;
  quote: string;
  baseInfo: TokenInfo;
  quoteInfo: TokenInfo;
};
export type MarketContextType = {
  marketList: MarketInfo[];
};
export const MarketContext = React.createContext<MarketContextType>({
  marketList: [],
});

export const useMarket = () => {
  return useContext(MarketContext);
};

export const MarketProvider = ({ children }) => {
  const { tokenInfos } = useApp();
  const [marketList, setMarketList] = useState<MarketInfo[]>([]);

  useEffect(() => {
    const list = MARKETS.map((i) => {
      const id = i.address.toBase58();
      const name = i.name;
      const programId = i.programId.toBase58();
      const base = i.name.split('/')[0];
      const quote = i.name.split('/')[1];
      const baseInfo = tokenInfos?.find((i) => i.symbol === base);
      const quoteInfo = tokenInfos?.find((i) => i.symbol === quote);

      return {
        id,
        name,
        programId,
        base,
        quote,
        baseInfo,
        quoteInfo,
      } as MarketInfo;
    });

    setMarketList(
      list
        .filter((i) => ['USDC', 'USDT', 'SOL'].indexOf(i.quote) >= 0)
        .sort((a, b) => {
          const ap = a.quote === 'USDC' ? 1 : 0;
          const bp = b.quote === 'USDC' ? 1 : 0;
          return bp - ap;
        }),
    );
  }, [tokenInfos]);

  return (
    <MarketContext.Provider value={{ marketList }}>
      {children}
    </MarketContext.Provider>
  );
};

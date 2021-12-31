import React, { useContext, useState, useEffect } from 'react';

import { IAccount, createAccountList } from './IAccount';
import { authFetch } from '../../utils/authfetch';
import { useToken } from './TokenProvider';
import { storeAccountList } from '../../storage/AccountCollection';
import { useInterval } from '../../hooks/useInterval';

export type TokenContextType = {
  accountList: IAccount[];
  priceData: any;
};
export const TokenContext = React.createContext<TokenContextType>({
  accountList: [],
  priceData: {},
});

export const usePrice = () => {
  return useContext(TokenContext);
};

let priceCache = {};

const fetchPriceData = async (accountList: IAccount[] = []) => {
  const list = accountList
    .filter((i) => i.publicKey)
    .map((i) => i.extensions?.coingeckoId)
    .filter((i) => i !== undefined)
    .join(',');
  const price = await authFetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${list}&vs_currencies=usd,vnd`,
  );

  priceCache = {
    ...priceCache,
    ...price,
  };
  return priceCache;
};

const UPDATE_INTERVAL = 300000; // 5 mins = 5 * 60.000

export const PriceProvider: React.FC = (props) => {
  const { accountList: accountListOrg, tokenInfos } = useToken();
  const [accountList, setAccountList] = useState<IAccount[]>(accountListOrg);
  const [priceData, setPriceData] = useState({});

  useInterval(
    () => {
      (async () => {
        const price = await fetchPriceData(accountListOrg).catch(() => { });
        setPriceData(price);
      })();
    },
    UPDATE_INTERVAL,
    accountListOrg,
  );

  useEffect(() => {
    (async () => {
      const accList = createAccountList(tokenInfos, accountListOrg, priceData);
      setPriceData(priceData);
      setAccountList(accList);
      await storeAccountList(accList);
    })();
  }, [tokenInfos, accountListOrg, priceData]);

  return (
    <TokenContext.Provider
      value={{
        priceData,
        accountList,
      }}
    >
      {props.children}
    </TokenContext.Provider>
  );
};

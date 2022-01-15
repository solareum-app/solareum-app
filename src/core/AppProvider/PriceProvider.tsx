import React, { useContext, useState, useEffect } from 'react';

import { IAccount, createAccountList } from './IAccount';
import { authFetch } from '../../utils/authfetch';
import { useToken } from './TokenProvider';
import { storeAccountList } from '../../storage/AccountCollection';
// import { useInterval } from '../../hooks/useInterval';

export type PriceContextType = {
  accountList: IAccount[];
  priceData: any;
};
export const PriceContext = React.createContext<PriceContextType>({
  accountList: [],
  priceData: {},
});

export const usePrice = () => {
  return useContext(PriceContext);
};

let priceCache = {};
let totalCache = -1;

const fetchPriceData = async (accountList: IAccount[] = []) => {
  const activeAccounts = accountList.filter((i) => i.publicKey);

  if (activeAccounts.length === totalCache) {
    return priceCache;
  }

  totalCache = activeAccounts.length;
  const list = activeAccounts
    .map((i) => i.extensions?.coingeckoId)
    .filter((i) => i !== undefined)
    .join(',');
  const price = await authFetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${list}&vs_currencies=usd,vnd`,
  ).catch(() => {});

  priceCache = {
    ...priceCache,
    ...price,
  };
  return priceCache;
};

// const UPDATE_INTERVAL = 300000; // 5 mins = 5 * 60.000

export const PriceProvider: React.FC = (props) => {
  const { accountList: accountListOrg, tokenInfos } = useToken();
  const [accountList, setAccountList] = useState<IAccount[]>(accountListOrg);
  const [priceData, setPriceData] = useState({});

  // useInterval(
  //   () => {
  //     (async () => {
  //       const price = await fetchPriceData(accountListOrg);
  //       setPriceData(price);
  //     })();
  //   },
  //   UPDATE_INTERVAL,
  //   accountListOrg.length,
  // );

  const getPrice = async () => {
    const price = await fetchPriceData(accountListOrg);
    setPriceData(price);
  };

  const getAccountData = async () => {
    const accList = createAccountList(tokenInfos, accountListOrg, priceData);
    setAccountList(accList);
    await storeAccountList(accList);
  };

  useEffect(() => {
    getPrice();
  }, [accountListOrg.length]);

  useEffect(() => {
    getAccountData();
  }, [tokenInfos, accountListOrg, priceData]);

  return (
    <PriceContext.Provider
      value={{
        priceData: {},
        accountList,
      }}
    >
      {props.children}
    </PriceContext.Provider>
  );
};

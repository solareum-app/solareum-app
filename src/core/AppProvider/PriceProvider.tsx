import { createAccountList, IAccount } from '@Core/AppProvider/IAccount';
import { useToken } from '@Core/AppProvider/TokenProvider';
import { useInterval } from '@Hooks/useInterval';
import { storeAccountList } from '@Storage/AccountCollection';
import { authFetch } from '@Utils/authfetch';
import React, { useContext, useEffect, useState } from 'react';

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

const fetchPriceData = async (accountList: IAccount[] = []) => {
  const activeAccounts = accountList.filter((i) => i.publicKey);
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

const UPDATE_INTERVAL = 900000; // 15 mins = 15 * 60.000

export const PriceProvider: React.FC = (props) => {
  const { accountList: accountListOrg, tokenInfos } = useToken();
  const [accountList, setAccountList] = useState<IAccount[]>(accountListOrg);
  const [priceData, setPriceData] = useState({});

  const getPrice = async () => {
    const price = await fetchPriceData(accountListOrg);
    setPriceData(price);
  };

  const getAccountData = async () => {
    const accList = createAccountList(tokenInfos, accountListOrg, priceData);
    setAccountList(accList);
    await storeAccountList(accList);
  };

  useInterval(
    () => {
      getPrice();
    },
    UPDATE_INTERVAL,
    accountListOrg.length,
  );

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

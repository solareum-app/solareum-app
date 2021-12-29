import React, { useContext, useState, useEffect } from 'react';

import { IAccount, createAccountList } from './IAccount';
import { authFetch } from '../../utils/authfetch';
import { useToken } from './TokenProvider';

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

const fetchPriceData = async (accountList: IAccount[] = []) => {
  const list = accountList
    .filter((i) => i.publicKey)
    .map((i) => i.extensions?.coingeckoId)
    .filter((i) => i !== undefined)
    .join(',');
  const price = await authFetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${list}&vs_currencies=usd,vnd`,
  );
  return price;
};

export const PriceProvider: React.FC = (props) => {
  const { accountList: accountListOrg, tokenInfos } = useToken();

  const [accountList, setAccountList] = useState<IAccount[]>([]);
  const [priceData, setPriceData] = useState({});

  useEffect(() => {
    (async () => {
      const price = await fetchPriceData(accountListOrg);
      const accList = createAccountList(tokenInfos, accountListOrg, price);
      setPriceData(price);
      setAccountList(accList);
    })();
  }, [tokenInfos, accountListOrg]);

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

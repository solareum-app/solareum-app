import React, { useContext, useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

import { setItem, getItem } from '../../storage/Collection';

export const SWAP_APPLICATION_KEY = 'swap';

export enum SWAP_APP {
  JUPITER = 'jupiter',
  ONE_SOL = '1sol',
}

export type RemoteConfigType = {
  appName: string;
  appPrefix: string;
  admob: boolean;
  customeMarketList: any[];
  customeTokenList: any[];
  links: any;
  presale: any;
  swap: SWAP_APP;
  setSwap: any;
  promoteTokenList: string[];
};

export const RemoteConfigContext = React.createContext<RemoteConfigType>({
  appName: 'Solareum Wallet',
  appPrefix: 'p',
  admob: true,
  customeMarketList: [],
  customeTokenList: [],
  links: {},
  presale: {},
  swap: SWAP_APP.JUPITER,
  setSwap: () => null,
  promoteTokenList: ['USDC', 'SOL', 'XSB'],
});

export const useConfig = () => {
  return useContext(RemoteConfigContext);
};

const defaultLinks = {
  wealthclub: 'https://wealthclub.vn',
  twitter: 'https://twitter.com/solareum_wallet',
  telegram: 'https://t.me/solareum_wallet',
  policy: 'https://www.wealthclub.vn/t/solareum-wallet-dieu-khoan-su-dung/418',
  solareum: 'https://solareum.app',
};

export const RemoteConfigProvider = ({ children }) => {
  const [appName, setAppName] = useState('');
  const [appPrefix, setAppPrefix] = useState('');
  const [admob, setAdmob] = useState(false);
  const [customeMarketList, setCustomeMarketList] = useState([]);
  const [customeTokenList, setCustomeTokenList] = useState([]);
  const [links, setLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [promoteTokenList, setPromoteTokenList] = useState<string[]>([
    'USDC',
    'SOL',
    'XSB',
  ]);
  const [swap, setSwapOrg] = useState(SWAP_APP.JUPITER);

  const setSwap = (value: SWAP_APP) => {
    setSwapOrg(value);
    setItem('', SWAP_APPLICATION_KEY, value);
  };

  useEffect(() => {
    (async () => {
      const swapApp = (await getItem('', SWAP_APPLICATION_KEY)) as SWAP_APP;
      setSwapOrg(swapApp || SWAP_APP.JUPITER);
    })();
  }, []);

  useEffect(() => {
    remoteConfig()
      .setDefaults({
        app_name: 'Solareum Wallet',
        app_prefix: 'p',
        admob: false,
        token_list: '[]',
        market_list: '[]',
        links: JSON.stringify(defaultLinks),
        reward_airdrop: '0',
        reward_ref: '0',
        promote_tokens: 'USDC, SOL, XSB',
      })
      .then(() => {
        // fetch anyway, the change will be apply for the next start
        remoteConfig()
          .fetch(7200) // cache for 2 hours
          .catch(() => {
            return true;
          });
        return true;
      }) // fetch config right after reload app
      .then(() =>
        remoteConfig()
          .activate()
          .catch(() => {
            return true;
          }),
      )
      .then((_) => {
        const sourceAppName = remoteConfig().getValue('app_name');
        const sourceAppPrefix = remoteConfig().getValue('app_prefix');
        const sourceAdmob = remoteConfig().getValue('admob');
        const sourceMarketList = remoteConfig().getValue('market_list');
        const sourceTokenList = remoteConfig().getValue('token_list');
        const sourceLinks = remoteConfig().getValue('links');
        const sourcePromoteTokenList =
          remoteConfig().getValue('promote_tokens');

        setAppName(sourceAppName._value);
        setAppPrefix(sourceAppPrefix._value);
        setAdmob(sourceAdmob._value === 'true' ? true : false);
        setCustomeMarketList(JSON.parse(sourceMarketList._value));
        setCustomeTokenList(JSON.parse(sourceTokenList._value));
        setLinks(JSON.parse(sourceLinks._value));
        setPromoteTokenList(sourcePromoteTokenList._value.split(','));

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <RemoteConfigContext.Provider
      value={{
        appName,
        appPrefix,
        admob,
        links,
        customeMarketList,
        customeTokenList,
        presale: {},
        swap,
        setSwap,
        promoteTokenList,
      }}
    >
      {!loading ? children : null}
    </RemoteConfigContext.Provider>
  );
};

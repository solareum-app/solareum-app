import React, { useContext, useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

export type RemoteConfigType = {
  appName: string;
  appPrefix: string;
  admob: boolean;
  marketList: any[];
  tokenList: any[];
  links: any;
};

export const RemoteConfigContext = React.createContext<RemoteConfigType>({
  appName: 'Solareum Wallet',
  appPrefix: 'p',
  admob: false,
  marketList: [],
  tokenList: [],
  links: {},
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
  const [marketList, setMarketList] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [links, setLinks] = useState({});

  useEffect(() => {
    remoteConfig()
      .setDefaults({
        app_name: 'Solareum Wallet',
        app_prefix: 'p',
        admob: false,
        token_list: '[]',
        market_list: '[]',
        links: JSON.stringify(defaultLinks),
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then((_) => {
        const sourceAppName = remoteConfig().getValue('app_name');
        const sourceAppPrefix = remoteConfig().getValue('app_prefix');
        const sourceAdmob = remoteConfig().getValue('admob');
        const sourceMarketList = remoteConfig().getValue('market_list');
        const sourceTokenList = remoteConfig().getValue('token_list');
        const sourceLinks = remoteConfig().getValue('links');

        setAppName(sourceAppName._value);
        setAppPrefix(sourceAppPrefix._value);
        setAdmob(sourceAdmob._value);
        setMarketList(JSON.parse(sourceMarketList._value));
        setTokenList(JSON.parse(sourceTokenList._value));
        setLinks(JSON.parse(sourceLinks._value));
      });
  }, []);

  return (
    <RemoteConfigContext.Provider
      value={{ appName, appPrefix, admob, marketList, tokenList, links }}
    >
      {children}
    </RemoteConfigContext.Provider>
  );
};

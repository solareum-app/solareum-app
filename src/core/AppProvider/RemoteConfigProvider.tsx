import React, { useContext, useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

/**
 * TOKEN structure
 {
    "chainId": 101,
    "address": "FYfQ9uaRaYvRiaEGUmct45F9WKam3BYXArTrotnTNFXF",
    "symbol": "SOLA",
    "name": "Sola Token",
    "decimals": 9,
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FYfQ9uaRaYvRiaEGUmct45F9WKam3BYXArTrotnTNFXF/logo.png",
    "tags": [
      "Solana tokenized",
      "Solana Community token"
    ],
    "extensions": {
      "website": "https://solatoken.net/",
      "telegram": "https://t.me/solatokennet",
      "twitter": "https://twitter.com/EcoSolana"
    }
  },

  Market Structure
  {
    "address": "B37pZmwrwXHjpgvd9hHDAx1yeDsNevTnbbrN9W12BoGK",
    "deprecated": true,
    "name": "ALEPH/WUSDC",
    "programId": "4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn"
  },
  {
    "address": "8BdpjpSD5n3nk8DQLqPUyTZvVqFu6kcff5bzUX5dqDpy",
    "deprecated": false,
    "name": "TOMO/USDC",
    "programId": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
  },
 */

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
      .then(() => remoteConfig().fetch(300)) // for testing env
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

import React, { useContext, useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

/**
 * TOKEN structure
 {
    "chainId": 101,
    "address": "<SOLAREUM>",
    "symbol": "XSB",
    "name": "Solareum",
    "decimals": 9,
    "logoURI": "https://solareum.app/icons/XSB-P.png",
    "tags": [
      "Solareum",
      "Wallet",
      "Serum Dex"
    ],
    "extensions": {
      "wealthclub": "https://wealthclub.vn",
      "twitter": "https://twitter.com/solareum_wallet",
      "telegram": "https://t.me/solareum_wallet",
      "policy": "https://www.wealthclub.vn/t/solareum-wallet-dieu-khoan-su-dung/418",
      "website": "https://solareum.app",
    }
  },

  Market Structure
  {
    "name": "SAMO/USDC",
    "address": "FR3SPJmgfRSKKQ2ysUZBu7vJLpzTixXnjzb84bY3Diif",
    "programId": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    "deprecated": false
  }
 */

export type RemoteConfigType = {
  appName: string;
  appPrefix: string;
  admob: boolean;
  customeMarketList: any[];
  customeTokenList: any[];
  links: any;
  rewardAirdrop: number;
  rewardRef: number;
};

export const RemoteConfigContext = React.createContext<RemoteConfigType>({
  appName: 'Solareum Wallet',
  appPrefix: 'p',
  admob: false,
  customeMarketList: [],
  customeTokenList: [],
  links: {},
  rewardAirdrop: 0,
  rewardRef: 0,
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
  const [rewardAirdrop, setRewardAirdrop] = useState(0);
  const [rewardRef, setRewardRef] = useState(0);

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
      })
      .then(() => {
        // fetch anyway, the change will be apply for the next start
        remoteConfig()
          .fetch(300) // cache for 5 mins
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
        const airdrop = remoteConfig().getValue('reward_airdrop');
        const ref = remoteConfig().getValue('reward_ref');

        setAppName(sourceAppName._value);
        setAppPrefix(sourceAppPrefix._value);
        setAdmob(sourceAdmob._value === 'true' ? true : false);
        setCustomeMarketList(JSON.parse(sourceMarketList._value));
        setCustomeTokenList(JSON.parse(sourceTokenList._value));
        setLinks(JSON.parse(sourceLinks._value));
        setRewardAirdrop(parseInt(airdrop._value, 10));
        setRewardRef(parseInt(ref._value, 10));

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
        rewardAirdrop,
        rewardRef,
      }}
    >
      {!loading ? children : null}
    </RemoteConfigContext.Provider>
  );
};

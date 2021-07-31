import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import { getItem, setItem } from '../../storage/Collection';
import { getListWallet, AddressInfo } from '../../storage/WalletCollection';
import { useConnectionConfig } from '../ConnectionProvider';
import { clusterForEndpoint } from './clusters';
import { getWallet } from '../../spl-utils/getWallet';
import { Cluster } from './types';

const DEFAULT_WALLET = 'DEFAULT-WALLET-ID';

export type TokenInfos = TokenInfo[] | null;
export type TokenListContextType = {
  tokenInfos: TokenInfos;
  priceData: any;
  setTokenList: Function;
  wallet: any;
  setWallet: Function;
  addressId: string;
  setAddressId: Function;
  addressList: AddressInfo[];
};
export const TokenListContext = React.createContext<TokenListContextType>({
  tokenInfos: null,
  priceData: {},
  setTokenList: () => null,
  wallet: null,
  setWallet: () => null,
  addressId: '',
  setAddressId: () => null,
  addressList: [],
});

export const TokenRegistryProvider: React.FC = (props) => {
  const { endpoint } = useConnectionConfig();
  const [tokenInfos, setTokenInfos] = useState<TokenInfos>(null);
  const [tokenList, setTokenList] = useState([]);
  const [priceData, setPriceData] = useState({});
  const [wallet, setWallet] = useState(null);

  const [addressId, setAddressId] = useState('');
  const [addressList, setAddressList] = useState<AddressInfo[]>([]);

  // init wallet
  const setAddressIdWrapper = async (id: string) => {
    const list = await getListWallet();
    const address = list.find((i: AddressInfo) => i.id === id) || null;
    if (!address) {
      return;
    }
    const w = await getWallet(address.mnemonic, address.name);
    setAddressId(id);
    setWallet(w);
  };
  const setWalletWrapper = (w: any, data: AddressInfo) => {
    setItem('SYS', DEFAULT_WALLET, data.id);
    setAddressId(data.id);
    setWallet(w);
  };
  const initWallet = async () => {
    const list = await getListWallet();
    const walletKey = await getItem('SYS', DEFAULT_WALLET);
    const data = !walletKey ? list[0] : list.find((i) => i.id === walletKey);

    setAddressList(list);
    if (data) {
      const w = await getWallet(data.mnemonic, data.name);
      setAddressId(data.id);
      setWallet(w);
    }
  };

  useEffect(() => {
    const tokenListProvider = new TokenListProvider();
    tokenListProvider.resolve().then((tokenListContainer) => {
      const cluster: Cluster | undefined = clusterForEndpoint(endpoint);

      const filteredTokenListContainer =
        tokenListContainer?.filterByClusterSlug(cluster ? cluster.name : '');
      const listOfTokens =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : null; // Workaround for filter return all on unknown slug

      setTokenInfos(listOfTokens);
    });
  }, [endpoint]);

  // get data from coingekco
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenList.join(
        ',',
      )}&vs_currencies=usd,vnd`,
    )
      .then((resp) => resp.json())
      .then((data) => {
        setPriceData(data);
      })
      .catch(() => {
        setPriceData({});
      });
  }, [tokenList]);

  useEffect(() => {
    setTokenList(['solana']);
    initWallet();
  }, []);

  return (
    <TokenListContext.Provider
      value={{
        tokenInfos,
        priceData,
        setTokenList,
        wallet,
        setWallet: setWalletWrapper,
        addressId: addressId,
        setAddressId: setAddressIdWrapper,
        addressList,
      }}
    >
      {props.children}
    </TokenListContext.Provider>
  );
};

export const useApp = () => {
  return useContext(TokenListContext);
};

export const usePrice = () => {
  const { priceData } = useContext(TokenListContext);
  return priceData;
};

export const useTokenInfos = () => {
  const { tokenInfos } = useContext(TokenListContext);
  return tokenInfos;
};

export const useWallet = () => {
  const { wallet, setWallet } = useContext(TokenListContext);
  return [wallet, setWallet];
};

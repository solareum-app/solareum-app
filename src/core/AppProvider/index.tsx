import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import { getItem, setItem } from '../../storage/Collection';
import {
  getListWallet,
  AddressInfo,
  createWallet,
  updateWallet,
} from '../../storage/WalletCollection';
import { useConnectionConfig } from '../ConnectionProvider';
import { clusterForEndpoint } from './clusters';
import { getWallet, getAccountList } from '../../spl-utils/getWallet';
import { Cluster } from './types';
import { MarketProvider } from './MarketProvider';
import { IAccount, createAccountList } from './IAccount';
import { LoadingImage } from '../../components/LoadingIndicator';

const DEFAULT_WALLET = 'DEFAULT-WALLET-ID';

export type AppContextType = {
  accountList: IAccount[];
  updateAccountByPK: Function;
  tokenInfos: TokenInfo[];
  priceData: any;
  wallet: any;
  setWallet: Function;
  addressId: string;
  setAddressId: Function;
  addressList: AddressInfo[];
  createAddress: Function;
  updateAddress: Function;
  loadAccountList: Function;
};
export const AppContext = React.createContext<AppContextType>({
  accountList: [],
  updateAccountByPK: () => null,
  tokenInfos: [],
  priceData: {},
  wallet: null,
  setWallet: () => null,
  addressId: '',
  setAddressId: () => null,
  addressList: [],
  createAddress: () => null,
  updateAddress: () => null,
  loadAccountList: () => null,
});

export const useApp = () => {
  return useContext(AppContext);
};

const SOL_TOKEN = {
  address: 'SOL',
  symbol: 'SOL',
  name: 'Solana',
  extensions: {
    coingeckoId: 'solana',
  },
  logoURI:
    'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png',
};

export const AppProvider: React.FC = (props) => {
  const { endpoint } = useConnectionConfig();
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([]);
  const [accountList, setAccountList] = useState<IAccount[]>([]);
  const [priceData, setPriceData] = useState({});
  const [wallet, setWallet] = useState(null);
  const [addressId, setAddressId] = useState('');
  const [addressList, setAddressList] = useState<AddressInfo[]>([]);

  const updateAccountByPK = (pk: string) => { };

  const loadAccountList = async () => {
    const accs = await getAccountList(wallet);
    const accList = createAccountList(tokenInfos, accs, priceData);
    setAccountList(accList);
    return accList;
  };

  const createAddress = async (
    seed: string,
    mnemonic: string,
    name: string,
    isStored: boolean = false,
  ) => {
    const w = await getWallet(mnemonic, name);
    const address = await createWallet(
      seed,
      mnemonic,
      name,
      isStored,
      w.publicKey.toBase58(),
    );
    setAddressList([...addressList, address]);
    await setAddressIdWrapper(address.id);
  };
  const updateAddress = async (
    id: string,
    name: string,
    isStored: boolean = false,
  ) => {
    await updateWallet(id, name, isStored);
    const list = await getListWallet();

    setAddressList([...list]);
    await setAddressIdWrapper(id);
  };
  const setAddressIdWrapper = async (id: string) => {
    const list = await getListWallet();
    const address = list.find((i: AddressInfo) => i.id === id) || null;
    if (!address) {
      return;
    }
    const w = await getWallet(address.mnemonic, address.name);
    setWallet(w);
    setAddressId(id);
  };
  const setWalletWrapper = (w: any, data: AddressInfo) => {
    setItem('SYS', DEFAULT_WALLET, data.id);
    setAddressId(data.id);
    setWallet(w);
  };

  // init wallet
  const initWallet = async () => {
    const list = await getListWallet();
    const walletKey = await getItem('SYS', DEFAULT_WALLET);
    let data = !walletKey ? list[0] : list.find((i) => i.id === walletKey);
    data = data || list[0];

    setAddressList(list);
    if (data) {
      const w = await getWallet(data.mnemonic, data.name);
      setAddressId(data.id);
      setWallet(w);
    }
  };

  const fetchPriceData = async (tokenList: TokenInfo[] = []) => {
    const list = tokenList.map((i) => i.extensions?.coingeckoId) || [];
    const filtered = list.filter((i) => i !== undefined);
    const price = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${filtered.join(
        ',',
      )}&vs_currencies=usd,vnd`,
    )
      .then((resp) => resp.json())
      .then((data) => {
        return data;
      });
    return price;
  };

  useEffect(() => {
    const tokenListProvider = new TokenListProvider();
    tokenListProvider.resolve().then(async (tokenListContainer) => {
      const cluster: Cluster | undefined = clusterForEndpoint(endpoint);
      const filteredTokenListContainer =
        tokenListContainer?.filterByClusterSlug(cluster ? cluster.name : '');
      const listOfTokens =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : null; // Workaround for filter return all on unknown slug

      const tokenList = [SOL_TOKEN, ...listOfTokens];
      const priceMapping = await fetchPriceData(tokenList);
      const accList = createAccountList(tokenList, [], priceMapping);

      setPriceData(priceMapping);
      setTokenInfos(tokenList);
      setAccountList(accList);
    });
  }, [endpoint]);

  // calculate account list
  useEffect(() => {
    const accList = createAccountList(tokenInfos, accountList, priceData);
    setAccountList(accList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenInfos, priceData]);

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <AppContext.Provider
      value={{
        tokenInfos,
        priceData,
        wallet,
        setWallet: setWalletWrapper,
        addressId: addressId,
        setAddressId: setAddressIdWrapper,
        addressList,
        createAddress,
        updateAddress,
        accountList,
        updateAccountByPK,
        loadAccountList,
      }}
    >
      <MarketProvider>
        {tokenInfos.length ? props.children : <LoadingImage />}
      </MarketProvider>
    </AppContext.Provider>
  );
};

import React, { useContext, useState, useEffect } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';

import { useInterval } from '../../hooks/useInterval';
import { getItem, setItem } from '../../storage/Collection';
import {
  getListWallet,
  AddressInfo,
  createWallet,
  updateWallet,
} from '../../storage/WalletCollection';
import { clusterForEndpoint } from './clusters';
import {
  getWallet,
  getAccountList,
  getAccountInfo,
} from '../../spl-utils/getWallet';
import { Cluster } from './types';
import { MarketProvider } from './MarketProvider';
import { IAccount, createAccountList } from './IAccount';
import { LoadingImage } from '../../components/LoadingIndicator';
import {
  storeAccountList,
  getAccountListByOwner,
} from '../../storage/AccountCollection';
import { MAINNET_URL } from '../../config';

const DEFAULT_WALLET = 'DEFAULT-WALLET-ID';

export type AppContextType = {
  accountList: IAccount[];
  getAccountByPk: Function;
  tokenInfos: TokenInfo[];
  priceData: any;
  wallet: any;
  addressId: string;
  setAddressId: Function;
  addressList: AddressInfo[];
  createAddress: Function;
  updateAddress: Function;
  loadAccountList: Function;
};
export const AppContext = React.createContext<AppContextType>({
  accountList: [],
  getAccountByPk: () => null,
  tokenInfos: [],
  priceData: {},
  wallet: null,
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

export const AppProvider: React.FC = (props) => {
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([]);
  const [accountList, setAccountListSource] = useState<IAccount[]>([]);
  const [priceData, setPriceData] = useState({});
  const [wallet, setWallet] = useState(null);
  const [addressId, setAddressId] = useState('');
  const [addressList, setAddressList] = useState<AddressInfo[]>([]);

  const setAccountList = async (list: IAccount[]) => {
    setAccountListSource(list);
    await storeAccountList(list);
    return 0;
  };

  const getAccountByPk = async (pk: string) => {
    const account = await getAccountInfo(new PublicKey(pk));
    const newAccountList = accountList.map((i) => {
      if (i.publicKey === account?.publicKey) {
        return {
          ...i,
          ...account,
        };
      }
      return i;
    });
    setAccountList(newAccountList);
    return account;
  };

  const loadAccountFromStore = async (owner: string) => {
    const priceMapping = await fetchPriceData(tokenInfos);
    const list = await getAccountListByOwner(owner);
    const storeAccList = createAccountList(tokenInfos, list, priceMapping);

    setAccountListSource(storeAccList);
    setPriceData(priceMapping);
  };

  const loadAccountList = async () => {
    // get data from the store
    const owner = wallet.publicKey.toBase58();
    loadAccountFromStore(owner);

    // get data from the chain
    const accs = await getAccountList(wallet);
    const priceMapping = await fetchPriceData(tokenInfos);
    const accList = createAccountList(tokenInfos, accs, priceMapping);

    setPriceData(priceMapping);
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
    setItem('SYS', DEFAULT_WALLET, address.id);
    const w = await getWallet(address.mnemonic, address.name);
    const owner = w.publicKey.toBase58();
    setWallet(w);
    setAddressId(id);
    loadAccountFromStore(owner);
  };

  // init wallet
  const initWallet = async () => {
    const list = await getListWallet();
    const walletKey = await getItem('SYS', DEFAULT_WALLET);
    let data = !walletKey ? list[0] : list.find((i) => i.id === walletKey);
    data = data || list[0];

    if (data) {
      setAddressList(list);
      setAddressIdWrapper(data.id);
    }
  };

  useEffect(() => {
    const tokenListProvider = new TokenListProvider();
    tokenListProvider.resolve().then(async (tokenListContainer) => {
      const cluster: Cluster | undefined = clusterForEndpoint(MAINNET_URL);
      const filteredTokenListContainer =
        tokenListContainer?.filterByClusterSlug(cluster ? cluster.name : '');
      const listOfTokens =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : null; // Workaround for filter return all on unknown slug

      const tokenList = [SOL_TOKEN, ...listOfTokens];
      const priceMapping = await fetchPriceData(tokenList);
      const accList = createAccountList(tokenList, accountList, priceMapping);

      setTokenInfos(tokenList);
      setPriceData(priceMapping);
      setAccountList(accList);
    });
  }, []);

  // fetch new price every 5 mins = 5 * 60.000
  useInterval(() => {
    (async () => {
      const priceMapping = await fetchPriceData(tokenInfos);
      const accList = createAccountList(tokenInfos, accountList, priceMapping);
      setPriceData(priceMapping);
      setAccountList(accList);
    })();
  }, 300000);

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <AppContext.Provider
      value={{
        tokenInfos,
        priceData,
        wallet,
        addressId: addressId,
        setAddressId: setAddressIdWrapper,
        addressList,
        createAddress,
        updateAddress,
        accountList,
        getAccountByPk,
        loadAccountList,
      }}
    >
      <MarketProvider>
        {tokenInfos.length ? props.children : <LoadingImage />}
      </MarketProvider>
    </AppContext.Provider>
  );
};

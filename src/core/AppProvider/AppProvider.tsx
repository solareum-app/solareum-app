import React, { useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../../storage/Collection';
import {
  getListWallet,
  AddressInfo,
  createWallet,
  updateWallet,
  removeWalletById,
} from '../../storage/WalletCollection';
import { LoadingImage } from '../../components/LoadingIndicator';
import { getWallet } from '../../spl-utils/getWallet';
const DEFAULT_WALLET = 'DEFAULT-WALLET-ID';

export type AppContextType = {
  wallet: any;
  addressId: string;
  setAddressId: Function;
  addressName: string;
  isAddressBackup: boolean;
  addressList: AddressInfo[];
  createAddress: Function;
  updateAddress: Function;
  removeWallet: Function;
};
export const AppContext = React.createContext<AppContextType>({
  wallet: null,
  addressId: '',
  addressName: '',
  isAddressBackup: false,
  setAddressId: () => null,
  addressList: [],
  createAddress: () => null,
  updateAddress: () => null,
  removeWallet: () => null,
});

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider: React.FC = (props) => {
  const [wallet, setWallet] = useState(null);
  const [addressId, setAddressId] = useState('');
  const [addressName, setAddressName] = useState('');
  const [isAddressBackup, setIsAddressBackup] = useState(false);
  const [addressList, setAddressList] = useState<AddressInfo[]>([]);
  const [loading, setLoading] = useState(true);

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
    setAddressName(name);
    setIsAddressBackup(isStored);
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
    setIsAddressBackup(address.isStored);
    setAddressName(address.name);
    const w = await getWallet(address.mnemonic, address.name);
    setWallet(w);
    setAddressId(id);
  };

  const removeWallet = async (id: string) => {
    await removeWalletById(id);
    await initWallet();
    // TODO: remove all data related to this wallet
    return true;
  };

  // init wallet
  const initWallet = async () => {
    const list = await getListWallet();
    const walletKey = await getItem('SYS', DEFAULT_WALLET);
    let data = !walletKey ? list[0] : list.find((i) => i.id === walletKey);
    data = data || list[0];

    if (data) {
      setAddressList(list);
      setIsAddressBackup(data.isStored);
      setAddressName(data.name);
      await setAddressIdWrapper(data.id);
    }
  };

  useEffect(() => {
    (async () => {
      await initWallet();
      setLoading(false);
    })();
  }, []);

  return (
    <AppContext.Provider
      value={{
        wallet,
        addressId: addressId,
        setAddressId: setAddressIdWrapper,
        addressName,
        isAddressBackup,
        addressList,
        createAddress,
        updateAddress,
        removeWallet,
      }}
    >
      {!loading ? props.children : <LoadingImage />}
    </AppContext.Provider>
  );
};

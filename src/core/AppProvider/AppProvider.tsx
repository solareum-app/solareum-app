import { LoadingImage } from '@Components/LoadingIndicator';
import { BackupData } from '@Screens/Settings/Backup/mergeWallets';
import { getWallet } from '@SplUtils/getWallet';
import { getItem, setItem } from '@Storage/Collection';
import {
  AddressInfo,
  createWallet,
  getListWallet,
  removeWalletById,
  updateWallet
} from '@Storage/WalletCollection';
import React, { useContext, useEffect, useState } from 'react';
const DEFAULT_WALLET = 'DEFAULT-WALLET-ID';

export type AppContextType = {
  wallet: any;
  addressId: string;
  setAddressId: (id: string) => void;
  addressName: string;
  isAddressBackup: boolean;
  addressList: AddressInfo[];
  createAddress: (
    seed: string,
    mnemonic: string,
    name: string,
    isStored: boolean,
  ) => void;
  updateAddress: (id: string, name: string, isStored: boolean) => void;
  removeWallet: (id: string) => void;
  restoreWallets: (v: BackupData[]) => void;
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
  restoreWallets: () => null,
});

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider: React.FC = (props) => {
  const [wallet, setWallet] = useState<any | null>(null);
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

  const restoreWallets = async (wallets: BackupData[]) => {
    if (!wallets.length) {
      return;
    }
    const newAddressList = [];

    for (let i = 0; i < wallets.length; i++) {
      const item = wallets[i];
      const mnemonic = item.privateKey.trim();
      const name = item.name.trim();
      const w = await getWallet(mnemonic, name);
      const publicKey = w.publicKey.toBase58();
      const address = await createWallet(
        'seed',
        mnemonic,
        name,
        true,
        publicKey,
      );

      // dont add exiting address
      if (addressList.findIndex((i) => i.address === publicKey) === -1) {
        newAddressList.push(address);
      }
    }

    const t = [...addressList, ...newAddressList];
    setAddressList(t);

    if (t.length) {
      await setAddressIdWrapper(t[0].id);
    }
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
        restoreWallets,
      }}
    >
      {!loading ? props.children : <LoadingImage />}
    </AppContext.Provider>
  );
};

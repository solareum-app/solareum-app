import {
  createWallet,
  getListWallet,
  AddressInfo,
} from '../storage/WalletCollection';

class WalletFactory {
  list: AddressInfo[] = [];
  currentId: string;

  constructor() {
    this.init();
    this.currentId = '';
  }

  async init() {
    const walletList: AddressInfo[] = await getListWallet();
    if (walletList.length) {
      this.currentId = walletList[0].id;
      this.list = walletList;
    }
  }

  async create(
    seed: string,
    mnemonic: string,
    name: string,
    isStored: boolean = false,
  ) {
    const walletName = name ? name : `Solareum Wallet ${this.list.length + 1}`;
    const newWallet: AddressInfo = await createWallet(
      seed,
      mnemonic,
      walletName,
      isStored,
    );

    this.list.push(newWallet);
    return newWallet;
  }

  async update() {}

  async delete() {}

  getCurrent() {
    return this.list.find((i) => i.id === this.currentId);
  }

  getList() {
    return this.list;
  }

  setCurrentById(id: string) {
    this.currentId = id;
    return this.list.find((i) => i.id === id);
  }
  setCurrent(wallet: AddressInfo) {
    this.currentId = wallet.id;
    return wallet;
  }
}

export default new WalletFactory();

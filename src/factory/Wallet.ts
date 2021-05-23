import { createWallet, getListWallet } from '../storage/WalletCollection';

class WalletFactory {
  current = null;
  list: any[] = [];

  constructor() {
    this.init();
  }

  async init() {
    const walletList = await getListWallet();
    if (walletList.length) {
      this.current = walletList[0];
      this.list = walletList;
    }
  }

  async create(
    seed: string,
    mnemonic: string,
    name: string,
    isStored: boolean = false,
  ) {
    const walletName = !!name
      ? name
      : `Solareum Wallet ${this.list.length + 1}`;
    const newWallet = await createWallet(seed, mnemonic, walletName, isStored);
    this.list.push(newWallet);

    return newWallet;
  }

  async update() {}

  async delete() {}

  getCurrent() {
    return this.current;
  }

  getList() {
    return this.list;
  }

  setCurrent(wallet) {
    this.current = wallet;
    return wallet;
  }
}

export default new WalletFactory();

import { getListWallet } from '../storage/WalletCollection';

class WalletFactory {
  current = null;

  constructor() {
    this.init();
  }

  async init() {
    const list = await getListWallet();
    if (list.length) {
      this.current = list[0];
    }
  }

  getCurrent() {
    return this.current;
  }

  setCurrent(wallet) {
    this.current = wallet;
    return wallet;
  }
}

const walletFactory = new WalletFactory();

export default walletFactory;

import { LocalStorageWalletProvider } from './localStorage';
import { LedgerWalletProvider } from './ledger';
import { CustodyWalletProvider } from './CustodyWallet';

export class WalletProviderFactory {
  static getProvider(type, args) {
    if (type === 'custody') {
      return new CustodyWalletProvider(args);
    }

    if (type === 'local') {
      return new LocalStorageWalletProvider(args);
    }

    if (type === 'ledger') {
      return new LedgerWalletProvider(args);
    }
  }
}

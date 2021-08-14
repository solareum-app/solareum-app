import { Account } from '@solana/web3.js';
import {
  closeTokenAccount,
  createAndInitializeTokenAccount,
  createAssociatedTokenAccount,
  getOwnedTokenAccounts,
  nativeTransfer,
  transferTokens,
} from './tokens';
// import { setInitialAccountInfo } from './connection';
import { ACCOUNT_LAYOUT, parseTokenAccountData } from './tokens/data';
import { WalletProviderFactory } from './walletProvider/factory';

export class Wallet {
  constructor(connection, type, args) {
    this.connection = connection;
    this.type = type;
    this.provider = WalletProviderFactory.getProvider(type, args);
  }

  static async create(connection, type, args) {
    const instance = new Wallet(connection, type, args);
    await instance.provider.init();
    return instance;
  }

  get publicKey() {
    return this.provider.publicKey;
  }

  get allowsExport() {
    return this.type === 'local';
  }

  get address() {
    return this.provider.publicKey.toBase58();
  }

  get name() {
    return this.provider.name || 'Solareum Wallet';
  }

  getTokenAccountInfo = async () => {
    let accounts = await getOwnedTokenAccounts(this.connection, this.publicKey);
    return accounts
      .map(({ publicKey, accountInfo }) => {
        // setInitialAccountInfo(this.connection, publicKey, accountInfo);
        return { publicKey, parsed: parseTokenAccountData(accountInfo.data) };
      })
      .sort((account1, account2) =>
        account1.parsed.mint
          .toBase58()
          .localeCompare(account2.parsed.mint.toBase58()),
      );
  };

  createTokenAccount = async (tokenAddress) => {
    return await createAndInitializeTokenAccount({
      connection: this.connection,
      payer: this,
      mintPublicKey: tokenAddress,
      newAccount: new Account(),
    });
  };

  createAssociatedTokenAccount = async (splTokenMintAddress) => {
    return await createAssociatedTokenAccount({
      connection: this.connection,
      wallet: this,
      splTokenMintAddress,
    });
  };

  tokenAccountCost = async () => {
    return this.connection.getMinimumBalanceForRentExemption(
      ACCOUNT_LAYOUT.span,
    );
  };

  transferToken = async (
    source,
    destination,
    amount,
    mint,
    decimals,
    memo = null,
    overrideDestinationCheck = false,
  ) => {
    if (source.equals(this.publicKey)) {
      if (memo) {
        throw new Error('Memo not implemented');
      }
      return this.transferSol(destination, amount);
    }
    return await transferTokens({
      connection: this.connection,
      owner: this,
      sourcePublicKey: source,
      destinationPublicKey: destination,
      amount,
      memo,
      mint,
      decimals,
      overrideDestinationCheck,
    });
  };

  transferSol = async (destination, amount) => {
    return nativeTransfer(this.connection, this, destination, amount);
  };

  closeTokenAccount = async (publicKey, skipPreflight = false) => {
    return await closeTokenAccount({
      connection: this.connection,
      owner: this,
      sourcePublicKey: publicKey,
      skipPreflight,
    });
  };

  signTransaction = async (transaction) => {
    return this.provider.signTransaction(transaction);
  };

  createSignature = async (message) => {
    return this.provider.createSignature(message);
  };
}

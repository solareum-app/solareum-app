import nacl from 'tweetnacl';
import bs58 from 'bs58';

export class CustodyWalletProvider {
  constructor(args) {
    this.account = args.account;
  }

  async init() {
    return this;
  }

  get publicKey() {
    return this.account.publicKey;
  }

  async signTransaction(transaction) {
    transaction.partialSign(this.account);
    return transaction;
  }

  createSignature(message) {
    return bs58.encode(nacl.sign.detached(message, this.account.secretKey));
  }
}

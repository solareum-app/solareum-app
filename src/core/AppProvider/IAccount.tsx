import { TokenInfo } from '@solana/spl-token-registry';

export type IAccount = {
  mint: string;
  publicKey: string;
  owner: string;
  amount: number;
  decimals: number;
  valid: boolean;
  isMinted: boolean;
  usd: number;
  vnd: number;
} & TokenInfo;

export const createAccountList = (
  tokenList: TokenInfo[],
  accountList: any[],
  priceData = {},
): IAccount[] => {
  return tokenList.map((i) => {
    const id = i.extensions?.coingeckoId || '-';
    const price = priceData[id] || {};
    const address = i.address ? i.address : '';
    const account = accountList?.find((acc) => acc.mint === address) || {};
    const usd = price.usd || 0;
    const amount = account.amount || 0;
    const decimals = account.decimals || 8;
    const value = (amount / Math.pow(10, decimals)) * usd;

    return {
      ...i,
      mint: account.mint || '',
      publicKey: account.publicKey || '',
      owner: account.owner || '',
      amount,
      decimals,
      value,
      valid: account.valid || false,
      isMinted: !!account.publicKey,
      usd: price.usd || 0,
      vnd: price.vnd || 0,
    } as IAccount;
  });
};

import { TokenInfo } from '@solana/spl-token-registry';

export type IAccount = {
  mint: string;
  publicKey: string;
  owner: string;
  amount: number;
  decimals: number;
  valid: boolean;
  value: number;
  isMinted: boolean;
  usd: number;
  vnd: number;
  sortName: string;
} & TokenInfo;

export const createAccountList = (
  tokenList: TokenInfo[],
  accountList: any[],
  priceData = {},
): IAccount[] => {
  const accountIdList = accountList.map((i) => i.mint).join(',');

  // filled token info for existing account list
  const filledAccountList = [...accountList].map((account) => {
    const token = tokenList.find((t) => t.address === account.mint) || {};
    const id = token.extensions?.coingeckoId || '-';
    const price = priceData[id] || account;
    const usd = price.usd || 0;
    const amount = account.amount || 0;
    const decimals = account.decimals || 0;
    const value = (amount / Math.pow(10, decimals)) * usd;
    const sortName = token.name
      .replace('Wrapped', '')
      .replace('(Sollet)', '')
      .trim();

    return {
      ...token,
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
      sortName,
    } as IAccount;
  });

  const filledTokenList = [...tokenList]
    // filter non-created token
    .filter((t) => accountIdList.indexOf(t.address) < 0)
    .map((i) => {
      const id = i.extensions?.coingeckoId || '-';
      const account = {};
      const price = priceData[id] || account;
      const usd = price.usd || 0;
      const amount = account.amount || 0;
      const decimals = account.decimals || 0;
      const value = (amount / Math.pow(10, decimals)) * usd;
      const sortName = i.name
        .replace('Wrapped', '')
        .replace('(Sollet)', '')
        .trim();

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
        sortName,
      } as IAccount;
    });

  return [...filledAccountList, ...filledTokenList];
};

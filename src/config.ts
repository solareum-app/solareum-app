export const MAINNET_URL = 'http://api.mainnet-beta.solana.com';

// const servicePathDev =
//   'https://1t66si6dlc.execute-api.ap-southeast-1.amazonaws.com/dev';

const servicePathPrd =
  'https://5oqey668yd.execute-api.ap-southeast-1.amazonaws.com/prd';

export let service = {
  getHello: `${servicePathPrd}/hello`,
  getLoadSysAccount: `${servicePathPrd}/loadSysAccount`,
  getLoadAccountInfo: `${servicePathPrd}/loadAccountInfo`,
  getSend: `${servicePathPrd}/send`,
  getTransferSPLTokens: `${servicePathPrd}/transferSPLTokens`,
  postDeviceRegister: `${servicePathPrd}/deviceRegister`,
  postCheckAirdrop: `${servicePathPrd}/checkAirdrop`,
  postAirdrop: `${servicePathPrd}/airdrop`,
  postCheckMission: `${servicePathPrd}/checkMission`,
  postMission: `${servicePathPrd}/mission`,
};

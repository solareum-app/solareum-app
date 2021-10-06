export const MAINNET_URL = 'http://api.mainnet-beta.solana.com';

// DEV
// const servicePath =
//   'https://1t66si6dlc.execute-api.ap-southeast-1.amazonaws.com/dev';
// export const API_PATH = 'https://api-stg.solareum.app';

// PROD
const servicePath =
  'https://5oqey668yd.execute-api.ap-southeast-1.amazonaws.com/prd';
export const API_PATH = 'https://api.solareum.app';

export let service = {
  getHello: `${servicePath}/hello`,
  getLoadSysAccount: `${servicePath}/loadSysAccount`,
  getLoadAccountInfo: `${servicePath}/loadAccountInfo`,
  getSend: `${servicePath}/send`,
  getTransferSPLTokens: `${servicePath}/transferSPLTokens`,
  postDeviceRegister: `${servicePath}/deviceRegister`,
  postCheckAirdrop: `${servicePath}/checkAirdrop`,
  postAirdrop: `${servicePath}/airdrop`,
  postCheckMission: `${servicePath}/checkMission`,
  postMission: `${servicePath}/mission`,
};

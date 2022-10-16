//@ts-nocheck
import axios from 'axios';
import { FIO_PROTOCOOL_MAINNET } from '../config';

const { TextEncoder, TextDecoder } = require('text-encoding');
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
const {
  base64ToBinary,
  arrayToHex,
} = require('@fioprotocol/fiojs/dist/chain-numeric');
var ser = require('@fioprotocol/fiojs/dist/chain-serialize');

const { JsSignatureProvider } = require('@fioprotocol/fiojs/dist/chain-jssig');

export const privateKey = '5K6Srud2hYF327LsQCTLfmbPcxTRxDKxeLUgJz8fg1SY3oXYo5H';
export const publicKey =
  'FIO8bJjTsdh5f1BmwzQqueLKD3gndKKUKT8s2SJVKJndprdVM1G5U';
export const baseUrl = 'https://fio.blockpane.com/v1/';
export const httpEndpoint = 'https://fio.blockpane.com';
export const actorAddress = 'b4wengri5gih';
export const TOKEN_CHAIN = {
  CHAIN_CODE: 'SOL',
  TOKEN_CODE: 'SOL',
};

export const DOMAIN_NAME = '@xsb';
export const TPID = 'tamph@xsb';

export const checkAddress = (url: string, opts: any = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const actualUrl = FIO_PROTOCOOL_MAINNET + 'avail_check';
  const body = opts.body;

  return axios({
    method: opts.method || 'get',
    ...opts,
    headers: {
      ...headers,
      ...opts.headers,
    },
    url: actualUrl,
    data: body,
  }).then((resp) => resp.data);
};

export const getFee = (url: string, opts: any = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const actualUrl = FIO_PROTOCOOL_MAINNET + 'get_fee';
  const body = opts.body;

  return axios({
    method: opts.method || 'get',
    ...opts,
    headers: {
      ...headers,
      ...opts.headers,
    },
    url: actualUrl,
    data: body,
  }).then((resp) => resp.data);
};

const getInfo = async (url: string, opts: any = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const body = opts.body;

  return axios({
    method: opts.method || 'get',
    ...opts,
    headers: {
      ...headers,
      ...opts.headers,
    },
    url: url,
    data: body,
  }).then((resp) => resp.data);
};

export const registerAddress = async ({
  fioAddress,
  ownerFioPubKey,
  maxFee,
  tpid,
  actor,
}: any) => {
  const contract = 'fio.address';
  const action = 'regaddress';
  const data = {
    fio_address: fioAddress,
    owner_fio_public_key: ownerFioPubKey,
    max_fee: maxFee,
    tpid,
    actor: actor,
  };

  const res: any = await getInfo(httpEndpoint + '/v1/chain/get_info');

  const blockInfo: any = await getInfo(httpEndpoint + '/v1/chain/get_block', {
    body: {
      block_num_or_id: res?.last_irreversible_block_num,
    },
    method: 'POST',
  });

  const chainId = res?.chain_id;
  const currentDate = new Date();
  const timePlusTen = currentDate.getTime() + 10000;
  const timeInISOString = new Date(timePlusTen).toISOString();
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  const transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [
      {
        account: contract,
        name: action,
        authorization: [
          {
            actor: actor,
            permission: 'active',
          },
        ],
        data: data,
      },
    ],
  };

  // Retrieve the fio.address ABI
  const abiFioAddress: any = await getInfo(httpEndpoint + '/v1/chain/get_abi', {
    body: { account_name: 'fio.address' },
    method: 'POST',
  });

  const rawAbi = await getInfo(httpEndpoint + '/v1/chain/get_raw_abi', {
    body: { account_name: 'fio.address' },
    method: 'POST',
  });
  const abi = base64ToBinary(rawAbi.abi);

  // Get a Map of all the types from fio.address
  var typesFioAddress = ser.getTypesFromAbi(
    ser.createInitialTypes(),
    abiFioAddress.abi,
  );
  // Get the addaddress action type
  const actionAddaddress = typesFioAddress.get('regaddress');
  // Serialize the actions[] "data" field (This example assumes a single action, though transactions may hold an array of actions.)
  const buffer = new ser.SerialBuffer({ textEncoder, textDecoder });
  actionAddaddress.serialize(buffer, transaction.actions[0].data);
  const serializedData = arrayToHex(buffer.asUint8Array());

  // Get the actions parameter from the transaction and replace the data field with the serialized data field
  let serializedAction = transaction.actions[0];
  serializedAction = {
    ...serializedAction,
    data: serializedData,
  };

  const abiMsig = await getInfo(httpEndpoint + '/v1/chain/get_abi', {
    body: { account_name: 'eosio.msig' },
    method: 'POST',
  });

  var typesTransaction = ser.getTypesFromAbi(
    ser.createInitialTypes(),
    abiMsig.abi,
  );

  // Get the transaction action type
  const txnaction = typesTransaction.get('transaction');

  const rawTransaction = {
    ...transaction,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: 0,
    context_free_actions: [],
    actions: [serializedAction], //Actions have to be an array
    transaction_extensions: [],
  };

  // Serialize the transaction
  const buffer2 = new ser.SerialBuffer({ textEncoder, textDecoder });
  txnaction.serialize(buffer2, rawTransaction);
  const serializedTransaction = buffer2.asUint8Array();
  const signatureProvider = new JsSignatureProvider([privateKey]);

  const requiredKeys = [publicKey];
  const serializedContextFreeData = null;

  const signedTxn = await signatureProvider.sign({
    chainId: chainId,
    requiredKeys: requiredKeys,
    serializedTransaction: serializedTransaction,
    serializedContextFreeData: serializedContextFreeData,
    abis: abi,
  });

  const txn = {
    signatures: signedTxn.signatures,
    compression: 0,
    packed_context_free_data: arrayToHex(
      serializedContextFreeData || new Uint8Array(0),
    ),
    packed_trx: arrayToHex(serializedTransaction),
  };

  const jsonResult = await getInfo(
    httpEndpoint + '/v1/chain/push_transaction',
    {
      body: JSON.stringify(txn),
      method: 'POST',
    },
  );

  if (jsonResult.transaction_id) {
    console.log('Success. \nTransaction: ', jsonResult);
  } else if (jsonResult.code) {
    console.log('Error: ', jsonResult.error);
  } else {
    console.log('Error: ', jsonResult);
  }

  return jsonResult;
};

export const addPublicAddress = async ({
  fioAddress,
  chainCode,
  tokenCode,
  publicAddress,
  maxFee,
  technologyProviderId,
}) => {
  const contract = 'fio.address';
  const action = 'addaddress';
  const data = {
    fio_address: fioAddress,
    public_addresses: [
      {
        chain_code: chainCode,
        token_code: tokenCode,
        public_address: publicAddress,
      },
    ],
    max_fee: maxFee,
    tpid: technologyProviderId,
    actor: actorAddress,
  };

  const info = await getInfo(httpEndpoint + '/v1/chain/get_info');

  const blockInfo: any = await getInfo(httpEndpoint + '/v1/chain/get_block', {
    body: {
      block_num_or_id: info?.last_irreversible_block_num,
    },
    method: 'POST',
  });

  const chainId = info?.chain_id;
  const currentDate = new Date();
  const timePlusTen = currentDate.getTime() + 10000;
  const timeInISOString = new Date(timePlusTen).toISOString();
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  const transaction = {
    expiration,
    ref_block_num: blockInfo?.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [
      {
        account: contract,
        name: action,
        authorization: [
          {
            actor: actorAddress,
            permission: 'active',
          },
        ],
        data: data,
      },
    ],
  };

  // Retrieve the fio.address ABI
  const abiFioAddress: any = await getInfo(httpEndpoint + '/v1/chain/get_abi', {
    body: { account_name: 'fio.address' },
    method: 'POST',
  });

  const rawAbi = await getInfo(httpEndpoint + '/v1/chain/get_raw_abi', {
    body: { account_name: 'fio.address' },
    method: 'POST',
  });

  const abi = base64ToBinary(rawAbi.abi);

  // Get a Map of all the types from fio.address
  var typesFioAddress = ser.getTypesFromAbi(
    ser.createInitialTypes(),
    abiFioAddress.abi,
  );

  // Get the addaddress action type
  const actionAddaddress = typesFioAddress.get('addaddress');

  // Serialize the actions[] "data" field (This example assumes a single action, though transactions may hold an array of actions.)
  const buffer = new ser.SerialBuffer({ textEncoder, textDecoder });
  actionAddaddress.serialize(buffer, transaction.actions[0].data);
  const serializedData = arrayToHex(buffer.asUint8Array());

  // Get the actions parameter from the transaction and replace the data field with the serialized data field
  let serializedAction = transaction.actions[0];
  serializedAction = {
    ...serializedAction,
    data: serializedData,
  };

  const abiMsig = await getInfo(httpEndpoint + '/v1/chain/get_abi', {
    body: { account_name: 'eosio.msig' },
    method: 'POST',
  });

  var typesTransaction = ser.getTypesFromAbi(
    ser.createInitialTypes(),
    abiMsig.abi,
  );

  // Get the transaction action type
  const txnaction = typesTransaction.get('transaction');

  const rawTransaction = {
    ...transaction,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: 0,
    context_free_actions: [],
    actions: [serializedAction], //Actions have to be an array
    transaction_extensions: [],
  };

  // Serialize the transaction
  const buffer2 = new ser.SerialBuffer({ textEncoder, textDecoder });
  txnaction.serialize(buffer2, rawTransaction);
  const serializedTransaction = buffer2.asUint8Array();
  const signatureProvider = new JsSignatureProvider([privateKey]);

  const requiredKeys = [publicKey];
  const serializedContextFreeData = null;

  const signedTxn = await signatureProvider.sign({
    chainId: chainId,
    requiredKeys: requiredKeys,
    serializedTransaction: serializedTransaction,
    serializedContextFreeData: serializedContextFreeData,
    abis: abi,
  });

  const txn = {
    signatures: signedTxn.signatures,
    compression: 0,
    packed_context_free_data: arrayToHex(
      serializedContextFreeData || new Uint8Array(0),
    ),
    packed_trx: arrayToHex(serializedTransaction),
  };

  const jsonResult = await getInfo(
    httpEndpoint + '/v1/chain/push_transaction',
    {
      body: JSON.stringify(txn),
      method: 'POST',
    },
  );

  if (jsonResult.transaction_id) {
    console.log('Success. \nTransaction: ', jsonResult);
  } else if (jsonResult.code) {
    console.log('Error: ', jsonResult.error);
  } else {
    console.log('Error: ', jsonResult);
  }

  return jsonResult;
};

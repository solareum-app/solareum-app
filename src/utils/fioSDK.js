import { FIOSDK } from '@fioprotocol/fiosdk';
const { TextEncoder, TextDecoder } = require('text-encoding');
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
const {
  base64ToBinary,
  arrayToHex,
} = require('@fioprotocol/fiojs/dist/chain-numeric');
var ser = require('@fioprotocol/fiojs/dist/chain-serialize');

const { JsSignatureProvider } = require('@fioprotocol/fiojs/dist/chain-jssig');

export const privateKey = '5KKreTB3AZhtxP5oV7Wd55TL6SYdudsGapHUbiKSBtPNKb61H99';
export const publicKey =
  'FIO7X7kRreqfCircv4xyrUhuxNH8xD9RXPG2VBSa82sLmsZz4Jxhu';
export const baseUrl = 'https://fiotestnet.blockpane.com/v1/';
export const httpEndpoint = 'https://fiotestnet.blockpane.com';
export const actorAddress = 'ujrh1vsahrr1';
export const TOKEN_CHAIN = {
  CHAIN_CODE: 'SOL',
  TOKEN_CODE: 'SOL',
};

export const DOMAIN_NAME = '@fiotestnet';

async function fetchJson(uri, opts = {}) {
  try {
    const response = await fetch(uri, opts);
    return response;
  } catch (error) {}
}

const fioSdk = new FIOSDK(privateKey, publicKey, baseUrl, fetchJson);

export const fioProtocol = {
  async checkAvailAddress({ fio_name }) {
    try {
      const { is_registered } = await fioSdk.isAvailable(fio_name);
      return is_registered;
    } catch (e) {
      console.log(e);
    }
  },

  async getFee(ennPoint) {
    try {
      let { fee } = await fioSdk.getFee(ennPoint);

      return fee;
    } catch (error) {
      console.log('error', error);
    }
  },

  async registerAddress({
    fioAddress: fio_address,
    ownerFioPubKey: owner_fio_public_key,
    maxFee: max_fee,
    tpid,
    actor,
  }) {
    const contract = 'fio.address';
    const action = 'regaddress';
    const data = {
      fio_address: fio_address,
      owner_fio_public_key,
      max_fee,
      tpid,
      actor: actor,
    };

    const info = await (
      await fetch(httpEndpoint + '/v1/chain/get_info')
    ).json();

    const blockInfo = await (
      await fetch(httpEndpoint + '/v1/chain/get_block', {
        body: `{"block_num_or_id": ${info.last_irreversible_block_num}}`,
        method: 'POST',
      })
    ).json();
    const chainId = info.chain_id;
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
    const abiFioAddress = await (
      await fetch(httpEndpoint + '/v1/chain/get_abi', {
        body: '{"account_name": "fio.address"}',
        method: 'POST',
      })
    ).json();
    console.log('abiFioAddress', abiFioAddress);
    const rawAbi = await (
      await fetch(httpEndpoint + '/v1/chain/get_raw_abi', {
        body: '{"account_name": "fio.address"}',
        method: 'POST',
      })
    ).json();
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

    const abiMsig = await (
      await fetch(httpEndpoint + '/v1/chain/get_abi', {
        body: '{"account_name": "eosio.msig"}',
        method: 'POST',
      })
    ).json();

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

    const pushResult = await fetch(
      httpEndpoint + '/v1/chain/push_transaction',
      {
        body: JSON.stringify(txn),
        method: 'POST',
      },
    );

    const jsonResult = await pushResult.json();

    if (jsonResult.transaction_id) {
      console.log('Success. \nTransaction: ', jsonResult);
    } else if (jsonResult.code) {
      console.log('Error: ', jsonResult.error);
    } else {
      console.log('Error: ', jsonResult);
    }

    return jsonResult;
  },

  async addPublicAddress({
    fioAddress,
    chainCode,
    tokenCode,
    publicAddress,
    maxFee,
    technologyProviderId,
  }) {
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

    const info = await (
      await fetch(httpEndpoint + '/v1/chain/get_info')
    ).json();

    const blockInfo = await (
      await fetch(httpEndpoint + '/v1/chain/get_block', {
        body: `{"block_num_or_id": ${info.last_irreversible_block_num}}`,
        method: 'POST',
      })
    ).json();
    const chainId = info.chain_id;
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
              actor: actorAddress,
              permission: 'active',
            },
          ],
          data: data,
        },
      ],
    };

    // Retrieve the fio.address ABI
    const abiFioAddress = await (
      await fetch(httpEndpoint + '/v1/chain/get_abi', {
        body: '{"account_name": "fio.address"}',
        method: 'POST',
      })
    ).json();
    const rawAbi = await (
      await fetch(httpEndpoint + '/v1/chain/get_raw_abi', {
        body: '{"account_name": "fio.address"}',
        method: 'POST',
      })
    ).json();
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

    const abiMsig = await (
      await fetch(httpEndpoint + '/v1/chain/get_abi', {
        body: '{"account_name": "eosio.msig"}',
        method: 'POST',
      })
    ).json();

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

    const pushResult = await fetch(
      httpEndpoint + '/v1/chain/push_transaction',
      {
        body: JSON.stringify(txn),
        method: 'POST',
      },
    );

    const jsonResult = await pushResult.json();

    if (jsonResult.transaction_id) {
      console.log('Success. \nTransaction: ', jsonResult);
    } else if (jsonResult.code) {
      console.log('Error: ', jsonResult.error);
    } else {
      console.log('Error: ', jsonResult);
    }

    return jsonResult;
  },
};

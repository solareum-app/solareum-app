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

  async registerFioAddress({
    fioAddress,
    ownerFioPubKey,
    maxFee,
    tpid,
    actor,
  }) {
    try {
      const result = await fioSdk.registerFioAddress(
        fioAddress,
        maxFee,
        tpid,
        ownerFioPubKey,
        actor,
      );

      return result;
    } catch (e) {
      console.log(e);
    }
  },

  async addPublicAddress({
    fioAddress,
    chainCode,
    tokenCode,
    publicAddress,
    maxFee,
    technologyProviderId,
  }) {
    try {
      const result = await fioSdk.addPublicAddress(
        fioAddress,
        chainCode,
        tokenCode,
        publicAddress,
        maxFee,
        technologyProviderId,
      );
      // console.log('resultfio', result);
      return result;
    } catch (e) {
      console.log(e);
    }
  },

  async getFioBalance({ fioPublicKey }) {
    try {
      const result = await fioSdk.getFioBalance(fioPublicKey);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
};

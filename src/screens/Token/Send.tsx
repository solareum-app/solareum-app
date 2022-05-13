import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Input, Button, Icon } from 'react-native-elements';
import { PublicKey } from '@solana/web3.js';
import LottieView from 'lottie-react-native';

import { typo } from '../../components/Styles';
import { COLORS } from '../../theme';
import { price } from '../../utils/autoRound';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

import { QRScan } from './QRScan';

const s = StyleSheet.create({
  main: {
    backgroundColor: COLORS.dark0,
    minHeight: 320,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  body: {
    marginTop: 20,
  },
  inputContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputLabel: {
    fontWeight: 'normal',
  },
  input: {},
  footer: {
    marginTop: 20,
  },
  button: {
    height: 44,
  },
  group: {
    marginBottom: 8,
  },
  groupTitle: {
    marginBottom: 8,
    color: COLORS.white4,
  },
  groupValue: {
    lineHeight: 20,
    fontSize: 17,
  },
  containerInput: {
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    right: 0,
    top: 22,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    zIndex: 1,
    backgroundColor: COLORS.dark0,
    paddingLeft: 20,
  },
  iconQrCamera: {
    marginLeft: 20,
  },
  pasteTxt: {
    color: COLORS.white4,
    fontSize: 16,
  },
});

// TODO, currently it only work with `.`
// We should to make it works with dynamic decimal seperator depends on country
const checkDecimalPlaces = (valueStr) => {
  return (valueStr.match(new RegExp('\\.', 'g')) || []).length <= 1;
};

const Step1 = ({ address, setAddress, amount, setAmount, next, token,urlRedirect }) => {
  const [camera, setCamera] = useState(false);
  const { symbol, usd } = token;
  const estValue = amount * usd;
  const { t } = useLocalize();

  const onAmountChange = (value) => {
    // dont allow comma
    const v = value.replace(',', '.');
    if (!checkDecimalPlaces(v)) {
      return;
    }
    setAmount(v);
  };

  const onPaste = async () => {
    const text = await Clipboard.getString();
    setAddress(text);
  };


  const redirect = () =>{
    let linkRediret = urlRedirect + "://app?msg=solareum"
    Linking.openURL(linkRediret)
  }
  return (
    <View>
      {!camera ? (
        <View style={s.main}>
          <Text style={typo.title}>{t('token-send-title', { symbol })}</Text>
          <View style={s.body}>
            <View style={s.containerInput}>
              <Input
                label={t('token-address-title')}
                placeholder=""
                style={typo.input}
                labelStyle={s.inputLabel}
                containerStyle={s.inputContainer}
                errorMessage={address}
                errorStyle={{ color: COLORS.white4 }}
                value={address}
                onChangeText={(value) => setAddress(value)}
              />
              <View style={s.controls}>
                <Button
                  title={t('token-paste-title')}
                  type="clear"
                  onPress={onPaste}
                  titleStyle={s.pasteTxt}
                />
                <Button
                  title=""
                  type="clear"
                  icon={
                    <Icon
                      type="feather"
                      name="camera"
                      color={COLORS.white4}
                      size={20}
                    />
                  }
                  onPress={() => {
                    setCamera(true);
                  }}
                />
              </View>
            </View>

            <Input
              label={t('token-amount-title')}
              placeholder=""
              keyboardType="decimal-pad"
              style={typo.input}
              labelStyle={s.inputLabel}
              containerStyle={s.inputContainer}
              value={amount}
              onChangeText={(value) => onAmountChange(value)}
              errorMessage={`≈$${price(estValue)}`}
              errorStyle={{ color: COLORS.white4 }}
            />
          </View>
          <View style={s.footer}>
            <Button
              title={t('token-continue-btn')}
              buttonStyle={s.button}
              onPress = {redirect}
              // onPress={next}
            />
          </View>
        </View>
      ) : (
        <QRScan
          onChange={(value) => {
            setAddress(value);
            setCamera(false);
          }}
        />
      )}
    </View>
  );
};

const getErrorMessage = (message = '', t) => {
  if (message.includes('globalThis.crypto')) {
    return t('token-error-sol-support');
  }
  return message;
};

const Step2 = ({ token, address, amount, next, busy, error }) => {
  const { symbol } = token;
  const { t } = useLocalize();

  return (
    <View style={s.main}>
      <Text style={typo.title}>{t('token-send-title', { symbol })}</Text>
      <View style={s.body}>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Token</Text>
          <Text style={[typo.normal, s.groupValue]}>{symbol} / Native</Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>
            {t('token-sender-title')}
          </Text>
          <Text style={[typo.normal, s.groupValue]}>
            {token.publicKey || '-'}
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>
            {t('token-receiver-title')}
          </Text>
          <Text style={[typo.normal, s.groupValue]}>{address || '-'}</Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>
            {t('token-amount-title')}
          </Text>
          <Text style={[typo.normal, s.groupValue]}>
            {amount || 0} {symbol}
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>
            {t('token-fee-title')}
          </Text>
          <Text style={[typo.normal, { lineHeight: 18 }]}>0.000005 SOL</Text>
        </View>
      </View>
      <View style={s.footer}>
        {error && error.message ? (
          <View style={s.group}>
            <Text style={[typo.warning]}>
              {getErrorMessage(error.message, t)}
            </Text>
          </View>
        ) : null}
        <Button
          title={t('token-confirm-title')}
          buttonStyle={s.button}
          onPress={next}
          loading={busy}
        />
      </View>
    </View>
  );
};

const s3 = StyleSheet.create({
  body: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 220,
    height: 220,
  },
  message: {
    color: COLORS.white4,
    textAlign: 'center',
    fontSize: 18,
  },
  footer: {
    marginTop: 20,
  },
});

const Step3 = ({ signature }) => {
  const { t } = useLocalize();

  const openBrowser = () => {
    Linking.openURL(`https://solscan.io/tx/${signature}`);
  };

  return (
    <View style={s.main}>
      <View style={s3.body}>
        <LottieView
          autoPlay
          loop
          source={require('../../theme/lottie/check.json')}
          style={s3.img}
        />
        <Text style={s3.message}>{t('token-transaction-done')}</Text>
      </View>
      <View style={s.footer}>
        <Button
          title={t('token-transaction-detail')}
          buttonStyle={s.button}
          type="clear"
          onPress={openBrowser}
        />
      </View>
    </View>
  );
};

export const Send = ({ initStep = 1, token, initAddress,urlRedirect = '' }) => {
  const [step, setStep] = useState(initStep);
  const [address, setAddress] = useState(initAddress);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [signature, setSignature] = useState('');
  const { wallet } = useApp();
  const [busy, setBusy] = useState(false);
  const { t } = useLocalize();

  const transfer = async () => {
    setBusy(true);

    let qty = Math.round(parseFloat(amount) * Math.pow(10, token.decimals));
    let sig = '';

    if (qty === 0) {
      setError({ message: t('token-error-amount') });
      return;
    }

    try {
      const destination = new PublicKey(address);
      if (token.mint === 'SOL') {
        sig = await wallet.transferSol(destination, qty);
      } else {
        sig = await wallet.transferToken(
          new PublicKey(token.publicKey),
          destination,
          qty,
          new PublicKey(token.mint),
          token.decimals,
          null,
          true,
        );
      }
      setSignature(sig);
      setBusy(false);
      setStep(3);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  if (step === 1) {
    return (
      <Step1
        next={() => setStep(2)}
        address={address}
        setAddress={setAddress}
        amount={amount}
        setAmount={setAmount}
        token={token}
        urlRedirect= {urlRedirect}
      />
    );
  }

  if (step === 2) {
    return (
      <Step2
        token={token}
        address={address}
        amount={amount}
        next={transfer}
        busy={busy}
        error={error}
      />
    );
  }

  return <Step3 signature={signature} />;
};

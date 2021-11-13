import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { PublicKey } from '@solana/web3.js';
import LottieView from 'lottie-react-native';

import { typo } from '../../components/Styles';
import { COLORS } from '../../theme';
import { price } from '../../utils/autoRound';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

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

const getXSBAmount = (value) => {
  const qty = value ? Math.ceil(parseFloat(value) / 0.0075).toString() : '0';
  return qty;
};

const Step1 = ({ address, setAddress, amount, setAmount, next, token }) => {
  const [xsbAmount, setXsbAmount] = useState('0');
  const { symbol, usd } = token;
  const { t } = useLocalize();

  const estValue = amount * usd;

  const onAmountChange = (value) => {
    // dont allow comma
    const v = value.replace(',', '.');
    if (!checkDecimalPlaces(v)) {
      return;
    }
    setAmount(v);

    setXsbAmount(getXSBAmount(v));
  };

  return (
    <View>
      <View style={s.main}>
        <Text style={typo.title}>Order Entry</Text>
        <View style={s.body}>
          <Input
            label={`You Pay - ${symbol}`}
            keyboardType="decimal-pad"
            placeholder=""
            style={typo.input}
            labelStyle={s.inputLabel}
            containerStyle={s.inputContainer}
            value={amount}
            onChangeText={(value) => onAmountChange(value)}
            errorMessage={`≈$${price(estValue)}`}
            errorStyle={{ color: COLORS.white4 }}
          />

          <Input
            label="You Receive - XSB"
            keyboardType="decimal-pad"
            placeholder=""
            disabled={true}
            style={typo.input}
            labelStyle={s.inputLabel}
            containerStyle={s.inputContainer}
            value={xsbAmount}
          />
        </View>

        <View style={s.footer}>
          <Button
            title={t('token-continue-btn')}
            buttonStyle={s.button}
            onPress={next}
          />
        </View>
      </View>
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
      <Text style={typo.title}>Review Your Order</Text>
      <View style={s.body}>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Order Details</Text>
          <Text style={[typo.normal, s.groupValue]}>
            Purchase XSB token in Token Sales
          </Text>
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
          <Text style={[typo.helper, s.groupTitle]}>You Pay</Text>
          <Text style={[typo.normal, s.groupValue]}>
            {amount || 0} {symbol}
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>You Receive</Text>
          <Text style={[typo.normal, s.groupValue]}>
            {getXSBAmount(amount) || 0} XSB
          </Text>
        </View>
        <View style={s.group}>
          <Text style={[typo.helper, s.groupTitle]}>Transaction Fee</Text>
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

export const TokenSaleForm = ({ initStep = 1, token, next }) => {
  const [step, setStep] = useState(initStep);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const { wallet } = useApp();
  const { t } = useLocalize();

  // Solareum hot wallet
  const address = '7Kwq7Hj6q2u2tx35zZvFHsKLseKm3Y753aQTVEcy8rtv';

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
      setBusy(false);
      next({
        signature: sig,
        account: token,
        amount,
        amountCurrency: 'USDC',
        qty: getXSBAmount(amount),
        qtyCurrency: 'XSB',
      });
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
        setAddress={() => null}
        amount={amount}
        setAmount={setAmount}
        token={token}
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
};

import React, { useEffect } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
let description: any = null;
const BiometricPopup = ({ setShowFingerLock, setLockedType }: any) => {
  const requiresLegacyAuthentication = () => {
    return Platform.Version < 23;
  };

  const handleAuthenticationAttemptedLegacy = () => {
    description.shake();
  };

  const authCurrent = () => {
    FingerprintScanner.authenticate({ description: 'Log in with Biometrics' })
      .then(() => {
        Alert.alert(
          'Fingerprint Authentication',
          'Authenticated successfully',
          [
            {
              onPress: () => {
                console.log('Finger Locked');
                setShowFingerLock(false);
                setLockedType('');
              },
            },
          ],
        );
      })
      .catch((error) => {
        Alert.alert('Fingerprint Authentication', error.message, [
          {
            onPress: () => {
              console.log('Finger Error');
            },
          },
        ]);
      });
  };

  const authLegacy = () => {
    FingerprintScanner.authenticate({
      onAttempt: handleAuthenticationAttemptedLegacy,
    })
      .then(() => {
        Alert.alert(
          'Fingerprint Authentication',
          'Authenticated successfully',
          [
            {
              onPress: () => {
                console.log('Finger Locked');
                setShowFingerLock(false);
                setLockedType('');
              },
            },
          ],
        );
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    if (requiresLegacyAuthentication()) {
      authLegacy();
    } else {
      authCurrent();
    }

    return () => {
      FingerprintScanner.release();
    };
  }, []);

  const onEnterPin = () => {
    console.log('enter pin screen');
    setLockedType('pin');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.contentContainer]}>
        <Image
          style={styles.logo}
          source={require('../../assets/finger_print.png')}
        />

        <Text style={styles.heading}>Biometric{'\n'}Authentication</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={onEnterPin}>
          <Text style={styles.buttonText}>Enter Pin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#444444',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444444',
  },
  logo: {
    marginVertical: 45,
  },
  heading: {
    textAlign: 'center',
    color: '#00a4de',
    fontSize: 21,
  },
  description: {
    textAlign: 'center',
    height: 65,
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buttonContainer: {
    padding: 20,
  },
  buttonText: {
    color: '#8fbc5a',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default BiometricPopup;

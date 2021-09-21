import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { useApp } from '../core/AppProvider/AppProvider';
import package from '../../package.json';

export const useMetaData = () => {
  const { addressList } = useApp();
  const [solAccountList, setSolAccountList] = useState('');
  const [firstInstallTime, setFirstInstallTime] = useState(0);
  const [macAddress, setMacAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    setSolAccountList(addressList.map((i) => i.address).join(','));
  }, [addressList]);

  useEffect(() => {
    DeviceInfo.getFirstInstallTime().then((time) => {
      setFirstInstallTime(time);
    });
    DeviceInfo.getMacAddress().then((mac) => {
      setMacAddress(mac);
    });
    DeviceInfo.getPhoneNumber().then((p) => {
      setPhone(p);
    });
    DeviceInfo.getUserAgent().then((agent) => {
      setUserAgent(agent);
    });
  }, []);

  return {
    solAccountList,
    os: Platform.OS,
    platformVersion: Platform.Version,
    appVersion: package.version,
    bundleId: DeviceInfo.getBundleId(),
    deviceId: DeviceInfo.getUniqueId(),
    userAgent,
    firstInstallTime,
    macAddress,
    phone,
  };
};

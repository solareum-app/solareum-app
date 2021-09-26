import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import LocalizedStrings from 'react-native-localization';

import { getItem, setItem } from '../../storage/Collection';
import en from '../../languages/en.json';
import vi from '../../languages/vi.json';

const SELECTED_LANGUAGE = 'SELECTED_LANGUAGE';

const i18n = new LocalizedStrings<typeof vi>({ vn: vi, en });

export type i18nType = typeof i18n;

export const LANGUAGE_LIST: string[] = ['en', 'vn'];

// TODO: will implement the options later
const t = (key: string, options: any) => {
  return i18n[key];
};

const LocalizeContext = createContext({
  i18n,
  t: i18n,
  language: LANGUAGE_LIST[0],
  setLanguage: (_: string) => { },
});

export const LocalizeProvider: FunctionComponent = ({ children }) => {
  const [language, setLanguageOrg] = useState<string>(LANGUAGE_LIST[0]);

  const setLanguage = (value: string) => {
    if (LANGUAGE_LIST.indexOf(value) >= 0) {
      i18n.setLanguage(value);
      setLanguageOrg(value);
      setItem('', SELECTED_LANGUAGE, value);
    }
  };

  useEffect(() => {
    (async () => {
      const lang = await getItem('', SELECTED_LANGUAGE);
      if (lang) {
        setLanguage(lang);
      }
    })();
  }, []);

  return (
    <LocalizeContext.Provider value={{ i18n, t, language, setLanguage }}>
      {children}
    </LocalizeContext.Provider>
  );
};

export const useLocalize = () => useContext(LocalizeContext);

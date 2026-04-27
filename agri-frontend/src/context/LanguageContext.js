import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
 // LanguageContext.js - change line 6 only
const [lang, setLang] = useState(
  localStorage.getItem('app_lang') || 'english'  // 'tamil' → 'english'
);

  const switchLang = function(l) {
    setLang(l);
    localStorage.setItem('app_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
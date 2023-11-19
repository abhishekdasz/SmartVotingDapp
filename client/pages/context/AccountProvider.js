import React, { createContext, useContext, useState } from "react";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);


  return (
    <AccountContext.Provider value={{ account, provider, setAccount, setProvider }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  return useContext(AccountContext);
};

import { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

const EthereumContext = createContext();

const EthereumProvider = ({ children }) => {
  const { activate, active, library } = useWeb3React();

  const [adminAddress, setAdminAddress] = useState(null);

  useEffect(() => {
    if (active) {
      library.getSigner().getAddress().then((address) => setAdminAddress(address));
    }
  }, [active, library]);

  return (
    <EthereumContext.Provider value={{ activate, active, library, adminAddress }}>
      {children}
    </EthereumContext.Provider>
  );
};

const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error('useEthereum must be used within an EthereumProvider');
  }
  return context;
};

export { EthereumProvider, useEthereum };

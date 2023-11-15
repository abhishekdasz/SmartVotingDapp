import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./contract/Voting.json";
import { useRouter } from "next/router";
import Login from "@/components/Login";
import Voting from "@/components/Voting";

const Index = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect( () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }


  const connectContract = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask connected" + address);
        setIsConnected(true);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div>
      {isConnected ? (
        <Voting account={account} />
      ) : (
        <Login connectWallet={connectContract} />
      )}
    </div>
  );
};

export default Index;

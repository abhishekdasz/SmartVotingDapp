import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./contract/Voting.json";
import { useRouter } from "next/router";
import Login from "@/components/Login";
import Admin from "@/components/Admin";

const Index = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [votingStatus, setVotingStatus] = useState(false);

  const contractAddress = '0xFB094fdD45664c1612F3bA86F79EcA224B27fAA5';
  const contractAbi = abi.abi;
  useEffect( () => {
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, [account]);

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

  const getCurrentStatus = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    console.log(status);
    setVotingStatus(status);
  }
  return (
    <div>
      {isConnected ? (
        <Admin account={account} provider={provider} />
      ) : (
        <Login connectWallet={connectContract} />
      )}
    </div>
  );
};

export default Index;

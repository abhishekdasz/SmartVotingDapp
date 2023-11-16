// Import necessary libraries
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../pages/contract/Voting.json";

// Voter component
const voter = ({ provider }) => {
  const [voterName, setVoterName] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [voters, setVoters] = useState([]);

  const contractAddress = '0xFB094fdD45664c1612F3bA86F79EcA224B27fAA5';
  const contractAbi = abi.abi;

  const registerVoter = async () => {
    try {
      if (!voterName || !voterAge || !voterAddress) {
        console.error("Please fill in all the fields");
        return;
      }

      // Connect to the Ethereum provider
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      // Call the registerVoter function on the smart contract
      const transaction = await contract.registerVoter(voterName, parseInt(voterAge), voterAddress);

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log("Voter registered successfully");

      // After registering a voter, fetch and display all voters
      getAllVoters();
    } catch (error) {
      console.error("Error registering voter:", error);
    }
  };

  const getAllVoters = async () => {
    try {
      // Connect to the Ethereum provider
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      // Call the getAllVoters function on the smart contract
      const voters = await contract.getAllVoters();

      // Convert BigNumber values to JavaScript numbers
      const formattedVoters = voters.map(voter => ({
        name: voter.name,
        age: voter.age.toNumber(),
        voterAddress: voter.voterAddress
      }));

      // Update the component state with the fetched voters
      setVoters(formattedVoters);
    } catch (error) {
      console.error("Error fetching voters:", error);
    }
  };

  useEffect(() => {
    // Fetch and display voters when the component mounts
    getAllVoters();
  }, []); // Run this effect only once when the component mounts

  return (
    <div>
      <h2>Register Voter</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={voterName} onChange={(e) => setVoterName(e.target.value)} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" value={voterAge} onChange={(e) => setVoterAge(e.target.value)} />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" value={voterAddress} onChange={(e) => setVoterAddress(e.target.value)} />
      </div>
      <button onClick={registerVoter}>Register Voter</button>

      <div>
        <h2>All Voters</h2>
        <ul>
          {voters.map((voter, index) => (
            <li key={index}>
              Name: {voter.name}, Age: {voter.age}, Address: {voter.voterAddress}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default voter;

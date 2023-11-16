// Import necessary libraries
import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "../pages/contract/Voting.json";

// Admin component
const Admin = ({ provider }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");

  const contractAddress = '0xFB094fdD45664c1612F3bA86F79EcA224B27fAA5';
  const contractAbi = abi.abi;

  const addCandidate = async () => {
    try {
      if (!name || !age || !candidateAddress) {
        console.error("Please fill in all the fields");
        return;
      }

      // Connect to the Ethereum provider
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      // Call the addCandidate function on the smart contract
      const transaction = await contract.addCandidate(name, parseInt(age), candidateAddress);

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log("Candidate added successfully");
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  return (
    <div>
      <h2>Add Candidate</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" value={candidateAddress} onChange={(e) => setCandidateAddress(e.target.value)} />
      </div>
      <button onClick={addCandidate}>Add Candidate</button>
    </div>
  );
};

export default Admin;

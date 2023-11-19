// Import necessary libraries
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../pages/contract/Voting.json";
import { useRouter } from "next/router";

// Admin component
const Admin = ({ provider }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidates, setCandidates] = useState([]);

  const contractAddress = '0x4fF71717F17E3F92dEE7B356B25cd9Bea6852C37';
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

      // After adding a candidate, fetch and display all candidates
      getAllCandidates();

      router.push('/voter')
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const getAllCandidates = async () => {
    try {
      // Connect to the Ethereum provider
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      // Call the getAllCandidates function on the smart contract
      const candidates = await contract.getAllCandidates();

      // Convert BigNumber values to JavaScript numbers
      const formattedCandidates = candidates.map(candidate => ({
        name: candidate.name,
        age: candidate.age.toNumber(),
        candidateAddress: candidate.candidateAddress
      }));

      // Update the component state with the fetched candidates
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    // Fetch and display candidates when the component mounts
    getAllCandidates();
  }, []); // Run this effect only once when the component mounts

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

      <div>
        <h2>All Candidates</h2>
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>
              Name: {candidate.name}, Age: {candidate.age}, Address: {candidate.candidateAddress}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;

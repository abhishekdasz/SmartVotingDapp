// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    struct Candidate {
        string name;
        uint256 age;
        string candidateAddress;
        uint256 voteCount;
    }

    struct Voter {
        string name;
        uint256 age;
        address voterAddress; // Change the type to address
        bool hasVoted;
    }

    Candidate[] public candidates;
    mapping(address => Voter) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    uint256 public totalVoters;

    modifier onlyAdmin {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    modifier onlyVoter {
        require(voters[msg.sender].age > 0, "Only registered voters can call this function");
        _;
    }

    modifier onlyDuringVotingPeriod {
        require(isVotingOpen(), "Voting is not currently open");
        _;
    }

    modifier hasNotVoted {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }

    constructor(uint256 _durationInMinutes, address _adminAddress) {
        require(_durationInMinutes > 0, "Voting duration must be greater than zero");
        require(_adminAddress != address(0), "Admin address cannot be zero address");

        admin = _adminAddress;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    function registerVoter(string memory _name, uint256 _age, address _voterAddress) public onlyAdmin {
        require(voters[_voterAddress].age == 0, "Voter is already registered");
        voters[_voterAddress] = Voter({
            name: _name,
            age: _age,
            voterAddress: _voterAddress,
            hasVoted: false
        });

        totalVoters++;
    }

    function addCandidate(string memory _name, uint256 _age, string memory _candidateAddress) public onlyAdmin {
        candidates.push(Candidate({
            name: _name,
            age: _age,
            candidateAddress: _candidateAddress,
            voteCount: 0
        }));
    }

    function setVotingDuration(uint256 _durationInMinutes) public onlyAdmin {
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    function vote(uint256 _candidateIndex) public onlyVoter onlyDuringVotingPeriod hasNotVoted {
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender].hasVoted = true;
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    function getVotingStatus() public view returns (bool) {
        return isVotingOpen();
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet");

        if (block.timestamp >= votingEnd) {
            return 0;
        }

        return votingEnd - block.timestamp;
    }

    function isVotingOpen() internal view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp < votingEnd;
    }

    function showTotalVoters() public view returns (uint256) {
        return totalVoters;
    }
}

import React from 'react'
import { useRouter } from "next/router";

const AdminPage = ({provider}) => {
  const router = useRouter();

  const handleAddCand = () => {
    router.push('/AddCandidate');
  }

  const handleAddVoter = () => {
    router.push('/AddVoter');
  }
  return (
    <div>
      <div className="addCandidate">
        <button onClick={handleAddCand}> Add New Candidate </button>
      </div>
      <div className="addVoter">
        <button onClick={handleAddVoter}> Add New Voter </button>
      </div>
    </div>
  )
}

export default AdminPage

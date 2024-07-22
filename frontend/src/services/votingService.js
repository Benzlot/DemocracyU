import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vote';

export const getVotes = async (election_name) => {
  const response = await axios.post(`${API_URL}/get`,{
    election_name : election_name,
  });
  return response.data;
};

export const getRank = async (election_name) => {
  const response = await axios.post(`${API_URL}/getRank`,{
    election_name : election_name,
  });
  return response.data;
};

export const castVote = async (election_name ,candidate_Id, username, mail) => {
  const response = await axios.post(`${API_URL}/vote`, { 
      election_name : election_name,
      candidate_Id : candidate_Id, 
      username : username, 
      mail :mail 
    });
  return response.data;
};

// export const getDirectory = async () => {
//   const response = await axios.get(`${API_URL}/directory`);
//   return response.data;
// };

// export const submitEvaluation = async (feedback) => {
//   const response = await axios.post(`${API_URL}/evaluation`, { feedback });
//   return response.data;
// };

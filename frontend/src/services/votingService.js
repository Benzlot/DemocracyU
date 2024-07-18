import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vote';

export const getVotes = async () => {
  const response = await axios.get(`${API_URL}/votes`);
  return response.data;
};

export const castVote = async (candidate_Id, username, email) => {
  const response = await axios.post(`${API_URL}/vote`, { 
      candidate_Id : candidate_Id, 
      username : username, 
      email :email 
    });
  return response.data;
};

export const getDirectory = async () => {
  const response = await axios.get(`${API_URL}/directory`);
  return response.data;
};

export const submitEvaluation = async (feedback) => {
  const response = await axios.post(`${API_URL}/evaluation`, { feedback });
  return response.data;
};

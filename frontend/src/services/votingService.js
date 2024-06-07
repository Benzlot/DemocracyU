import axios from 'axios';

const API_URL = 'http://localhost:3000/api/vote';

export const getVotes = async () => {
  const response = await axios.get(`${API_URL}/votes`);
  return response.data;
};

export const castVote = async (candidateId) => {
  const response = await axios.post(`${API_URL}/vote`, { candidateId });
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

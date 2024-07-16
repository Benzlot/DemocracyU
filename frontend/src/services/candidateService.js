// services/candidateService.js
import axios from 'axios';

export const getCandidates = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/candidates');
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

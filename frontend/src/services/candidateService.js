// services/candidateService.js
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/candidates';

export const getCandidates = async (election_name) => {
  try {
    const response = await axios.post(`${API_URL}/`,{
      election_name : election_name
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};
export const addCandidate = async (formData) => {
  const response = await axios.post(`${API_URL}/add`,formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCandidate = async (election_name,student_id) => {
  const response = await axios.post(`${API_URL}/delete`, { 
      election_name : election_name,
      student_id : student_id
    });
  return response.data;
};

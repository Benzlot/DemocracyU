// services/candidateService.js
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/candidates';

export const getCandidates = async (election_name) => {
  try {
    const response = await axios.post(`${API_URL}/`,{
      election_name : election_name
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};
export const addCandidate = async (election_name, candidate_list) => {
  const response = await axios.post(`${API_URL}/add`, { 
      election_name : election_name,
      candidate_list : candidate_list
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

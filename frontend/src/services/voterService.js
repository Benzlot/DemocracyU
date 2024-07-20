import axios from 'axios';

const API_URL = 'http://localhost:5000/api/voters';

export const getVoter = async (election_name) => {
  const response = await axios.get(`${API_URL}/get`,{
    election_name : election_name
  });
  return response.data;
};

export const addVoter = async (election_name,student_list) => {
  const response = await axios.post(`${API_URL}/add`, { 
      election_name : election_name,
      student_list : student_list
    });
  return response.data;
};
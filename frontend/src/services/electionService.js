import axios from 'axios';

const API_URL = 'http://localhost:5000/api/elections';

export const getElection = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const getElectionbyName = async (election_name) => {
    const response = await axios.post(`${API_URL}/getbyName`, { 
      election_name : election_name
      });
    return response.data;
  };

export const addElection = async (election_name,election_type,start_date,end_date) => {
  const response = await axios.post(`${API_URL}/add`, { 
    election_name: election_name,
    election_type: election_type,
    start_date: start_date,
    end_date: end_date,
    });
  return response.data;
};

export const updateElection = async (election_name,election_type,start_date,end_date) => {
    const response = await axios.post(`${API_URL}/update`, { 
      election_name: election_name,
      election_type: election_type,
      start_date: start_date,
      end_date: end_date,
      });
    return response.data;
  };

export const deleteElection = async (election_name) => {
    const response = await axios.post(`${API_URL}/delete`, { 
      election_name : election_name,
      });
    return response.data;
  };

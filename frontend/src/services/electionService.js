import axios from 'axios';

const API_URL = 'http://localhost:5000/api/elections';

export const getElection = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const getElectionbyName = async (name) => {
    const response = await axios.post(`${API_URL}/getbyName`, { 
        name : name,
      });
    return response.data;
  };

export const addElection = async (name,type,start,end) => {
  const response = await axios.post(`${API_URL}/add`, { 
      name : name,
      type : type, 
      start : start, 
      end :end
    });
  return response.data;
};

export const updateElection = async (name,type,start,end) => {
    const response = await axios.post(`${API_URL}/update`, { 
        name : name,
        type : type, 
        start : start, 
        end :end
      });
    return response.data;
  };

export const deleteElection = async (name) => {
    const response = await axios.post(`${API_URL}/delete`, { 
        name : name
      });
    return response.data;
  };

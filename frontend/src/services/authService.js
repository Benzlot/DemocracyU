import axios from 'axios';

const API_URL = 'http://democracyu.onrender.com/api/admins';


export const checkAdmin = async (mail) => {
  const response = await axios.post(`${API_URL}/checkAdmin`, { 
      mail :mail 
    });
  return response.data;
};

import axios from "axios";

const BASE_URL = `${import.process.env.URL}/api/email`; 

export const getAllEmails = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/getAllEmails`, {user});
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createEmail = async (emailData) => {
  try {
    
    const response = await axios.post(`${BASE_URL}/createEmail`, emailData); 
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteEmail = async (emailId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${emailId}`); 
    return response.data; // Return response data
  } catch (error) {
    console.log(error);
  }
};

export const updateEmail = async (emailId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/emails/${emailId}`, updatedData); // 
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

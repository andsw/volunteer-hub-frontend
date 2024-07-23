import axios from "axios";

export const fetchEvents = async () => {
  return await fetchData('/event/backend');
};

export const saveProfile = async (account) => {
  return await axios.post(`${process.env.REACT_APP_SERVER_HOST}/account`, account);
}

export const getAccountByEmail = async (email) => {
  return await fetchData(`/account?email=${email}`);
}

export const fetchData = async (url) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}${url}`);
    return response.data.data; // return the entire response body
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // rethrow error to be handled by the caller if needed
  }
}

export const postData = async (url, responseBody) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}${url}`, responseBody);
    const generatedId = response.data.data;
    console.log('Account added with ID:', generatedId);
    return generatedId;
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
}

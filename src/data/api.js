import axios from "axios";

export const fetchEvents = async () => {
  return fetchData('/event/backend');
};

export const saveAccount = async(account) => {
  return postData('/account', account);
}

export const getAccountByEmail = async (email) => {
  return fetchData(`/account?email=${email}`);
}

export const fetchData = async (url) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}${url}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Events:", error);
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

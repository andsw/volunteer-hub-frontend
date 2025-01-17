import axios from "axios";

export const fetchEvents = async (orgId) => {
  if (orgId) {
    return await fetchData(`/event/backend?orgId=${orgId}`);
  } else {
    return await fetchData('/event/backend');
  }
};

export const fetchJoinedEvents = async(volunteerId) => {
  return await fetchData(`/event/joined?volunteerId=${volunteerId}`);
}

export const fetchApplications = async (accountId) => {
  return await fetchData(`/application?accountId=${accountId}`)
}

export const updateApplicationStatus = async(id, newStatus, declinedMsg='') => {
  return await axios.put(`${process.env.REACT_APP_SERVER_HOST}/application/${id}`, {
    status: newStatus,
    declinedMsg
  });
}

export const deleteEvent = async (id) => {
  return await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/event/${id}`);
}

export const deletePosition = async (id) => {
  return await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/position/${id}`);
}

export const saveApplication = async (application) => {
  return await axios.post(`${process.env.REACT_APP_SERVER_HOST}/application/apply`, application);
}

export const fetchPositions = async (orgId) => {
  if (orgId) {
    return await fetchData(`/position?orgId=${orgId}`);
  } else {
    return await fetchData('/position');
  }
};

export const getPositionDetail = async (id) => {
  return await fetchData(`/position/${id}/detail`);
}

export const savePosition = async (position) => {
  return await axios.post(`${process.env.REACT_APP_SERVER_HOST}/position`, position);
}

export const saveProfile = async (account) => {
  return await axios.post(`${process.env.REACT_APP_SERVER_HOST}/account`, account);
}

export const saveEvent = async (event) => {
  return await axios.post(`${process.env.REACT_APP_SERVER_HOST}/event`, event);
}

export const getAccountByEmail = async (email) => {
  return await fetchData(`/account?email=${email}`);
}

export const getAccountByAccountId = async (id) => {
  return await fetchData(`/account/${id}`);
}

export const getEventDetail = async (id) => {
  return await fetchData(`/event/${id}/detail`);
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

export const deleteObject = async (objectName, objectId) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/${objectName}/${objectId}`);
  } catch (error) {
    console.error(`Error deleteing object: ${objectName}, error: ${error}`);
    throw error; // rethrow error to be handled by the caller if needed
  }
}
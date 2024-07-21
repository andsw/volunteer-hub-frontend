// src/services/api.js
export const fetch = async (url) => {
    const response = await fetch(`${process.env.HOST}${url}`);
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    const data = await response.json();
    return data;
  };
  
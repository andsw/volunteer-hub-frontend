import React, { useContext, createContext, useState, useEffect } from 'react';
import { getAccountByEmail } from './api';
import { useAuth } from '../firebase/authContext';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchAccountData = async () => {
      if (currentUser && currentUser.email) {
        try {
          console.log(currentUser.email);
          const accountData = await getAccountByEmail(currentUser.email);
          setAccount(accountData);
        } catch (err) {
          console.error(err);
          setError(err)
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAccountData();
  }, [currentUser]);

  return (
    <AccountContext.Provider value={{
      loading, error,
      account,
      setAccount
    }}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount() {
  return useContext(AccountContext);
}

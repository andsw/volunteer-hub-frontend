import React, { useContext, createContext, useState, useEffect } from 'react';
import { getAccountByEmail } from './api';
import { useAuth } from '../firebase/authContext';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoadingAccount(true);
    const fetchAccountData = async () => {
      if (currentUser && currentUser.email) {
        try {
          const accountData = await getAccountByEmail(currentUser.email);
          setAccount(accountData);
        } catch (err) {
          console.error(err);
          setError(err)
        } finally {
          setLoadingAccount(false);
        }
      }
    };
    fetchAccountData();
  }, [currentUser]);

  return (
    <AccountContext.Provider value={{
      loadingAccount, error,
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

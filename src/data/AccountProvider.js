import React, { useContext, createContext, useState, useEffect } from 'react';
import { getAccountByEmail } from './api';
import { useAuth } from '../firebase/authContext';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loading] = useState(true);
  const [error] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const accountData = getAccountByEmail(currentUser.email);
      console.log('----------');
      console.log(accountData);
      setAccount(accountData);
    }
  }, [currentUser]);

  const accountTypeIsNotEmpty = !account?.accountType == null;
  const userIsAdmin = account?.accountType === 'admin';
  const userIsOrganization = account?.accountType === 'organization';
  const userIsVolunteer = account?.accountType === 'volunteer';

  return (
    <AccountContext.Provider value={{
      loading, error,
      account,
      setAccount,
      accountTypeIsNotEmpty,
      userIsAdmin,
      userIsOrganization,
      userIsVolunteer
    }}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount() {
  return useContext(AccountContext);
}

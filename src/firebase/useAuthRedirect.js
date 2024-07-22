import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext'; 

// check login status, if not loggedin, redirect to login page!
const useAuthRedirect = () => {
  const navigate = useNavigate();
  const account = useAuth();
  useEffect(() => {
    if (!account || !account.userLoggedIn) {
      console.log('Redirecting to login');
      navigate('/login');
    }
  }, [account, navigate]);
};

export default useAuthRedirect;

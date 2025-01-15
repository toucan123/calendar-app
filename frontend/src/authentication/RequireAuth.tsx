import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './auth';
import { User } from 'firebase/auth';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setIsLoadingUser(false);
    });
  
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isLoadingUser, navigate]);

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }
  
  return children;
}
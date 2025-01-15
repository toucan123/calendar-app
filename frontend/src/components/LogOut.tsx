import { useNavigate } from 'react-router-dom';
import { signOut } from '../authentication/auth';

const LogOutButton = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.log('ooops', error);
    }
  };

  return <button onClick={handleLogOut}>Sign out</button>;
};

export default LogOutButton;
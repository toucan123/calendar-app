import { googleSignIn } from '../authentication/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = async () => {
    try {
      await googleSignIn();
      navigate('/');
    } catch (error) {
      console.log('ooops', error);
    }
  };

  return <button onClick={handleLoginSuccess}>Sign in with Google</button>;
};

export default Login;
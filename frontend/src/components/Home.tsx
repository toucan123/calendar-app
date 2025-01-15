import LogOut from './LogOut';
import { getCurrentUser } from '../authentication/auth';

const Home = () => {
  const user = getCurrentUser();
  return (
    <div>hello {user?.email} <LogOut/></div>
  )
}

export default Home;

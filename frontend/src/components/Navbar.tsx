import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store';

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return ( 
    <div>
        <h1>Navbar</h1>
        <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar

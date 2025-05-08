import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store';
import { ModeToggle } from './Theme/mode-toggle';

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return ( 
    <div>
        <h1>Navbar</h1>
        <button onClick={handleLogout}>Logout</button>
        <ModeToggle />
    </div>
  );
}

export default Navbar

import { useContext } from 'react'; // Import useContext
import { motion } from 'framer-motion';
import { Dumbbell, LogOut } from 'lucide-react'; // Import LogOut
import { Link, NavLink } from 'react-router-dom';
import ConsistencyContext from '../context/ConsistencyContext'; // Import Context

const Header = () => {
  const { isLoggedIn, logoutUser, userData } = useContext(ConsistencyContext); // Get login state and logout function

  const activeClassName = "text-white font-semibold bg-primary-dark/30 px-3 py-1.5 rounded-md";
  const inactiveClassName = "text-indigo-100 hover:text-white hover:bg-primary-dark/20 px-3 py-1.5 rounded-md transition-colors";

  const getNavLinkClass = ({ isActive }) => isActive ? activeClassName : inactiveClassName;

  return (
    <motion.header
      // ... (animation props same as before)
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Link (always visible) */}
          <Link to={isLoggedIn ? "/" : "/login"} className="flex items-center group"> {/* Link to login if not logged in */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Dumbbell size={28} className="mr-2 group-hover:rotate-[-15deg] transition-transform duration-300" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">FitSplit</h1>
            </motion.div>
          </Link>

          {/* Navigation and Logout (only if logged in) */}
          {isLoggedIn && (
             <div className="flex items-center space-x-4">
                <nav>
                    <ul className="flex space-x-1 md:space-x-2 text-sm md:text-base">
                    <li><NavLink to="/" className={getNavLinkClass} end>Dashboard</NavLink></li>
                    <li><NavLink to="/split" className={getNavLinkClass}>My Split</NavLink></li>
                    <li><NavLink to="/progress" className={getNavLinkClass}>Progress</NavLink></li>
                    <li><NavLink to="/profile" className={getNavLinkClass}>Profile</NavLink></li>
                    </ul>
                </nav>
                {/* Logout Button */}
                <button
                    onClick={logoutUser}
                    title={`Logout ${userData.profile.name}`} // Add title for accessibility
                    className="flex items-center px-3 py-1.5 rounded-md text-sm bg-red-500 hover:bg-red-600 transition-colors"
                >
                    <LogOut size={16} className="mr-1.5" />
                    <span>Logout</span>
                </button>
             </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
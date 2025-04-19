import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ConsistencyContext from '../context/ConsistencyContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(ConsistencyContext);
  const location = useLocation();

  // If still loading the initial auth state, don't render anything yet
  // (or show a generic loading indicator if preferred)
  if (loading && !isLoggedIn) {
    return null; // Or <GlobalLoadingIndicator />;
  }

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render the child component if logged in
};

export default ProtectedRoute;
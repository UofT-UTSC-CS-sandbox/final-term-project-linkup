import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from "react-router-dom";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

function TestPage() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  // Redirecting to home page if NOT authenticated

  const signOutAndRedirect = () => {
    signOut();
    navigate('/login-page');
  };

  // Showing nothing if the user isn't authenticated
 
  return(
    <div>
        <button onClick={signOutAndRedirect}>Sign Out</button>
        <Link to="/preferences">
        <button>Go to Preferences Page</button>
      </Link>
    </div>
  ) 
}

  export default TestPage;
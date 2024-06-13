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
  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/');
    }
  });

  const signOutAndRedirect = () => {
    signOut();
    navigate('/');
  };

  // Showing nothing if the user isn't authenticated
  if (!isAuthenticated) {
    return null;
  } else {
    return(
      <div>
          <p>Hello {auth.email}</p>
          <button onClick={signOutAndRedirect}>Sign Out</button>
          <Link to="/preferences">
          <button>Go to Preferences Page</button>
        </Link>
      </div>
    ) 
  }

  // return (
  //   <div>
  //     <h1>User Information</h1>
  //     {loading ? (
  //       <p>Loading...</p>
  //     ) : error ? (
  //       <p>Error: {error}</p>
  //     ) : users ? (
  //       (users.map((user) => (
  //         <div>
  //           <p>Email: {user.email}</p>
  //           <p>Password: {user.password}</p>
  //         </div>
  //       )))
  //     ) : (
  //       <p>No user data found</p>
  //     )}
  //   </div>
  // );
}

export default TestPage;
import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from "react-router-dom";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

function MatchPage() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
 
  return(
    <div className="container">
      <h1 className="match-title">Linked Up!</h1>
      <p>You two have swiped right on each other.</p>
        <div className="match-button-container"> 
          <a href="/swiping">
            <button>
              Keep Swiping
            </button>
          </a> 

          <a href="/swiping">
            <button>
              Start a Conversation
            </button>
          </a> 
        </div>
    </div>
  ) 
}

  export default MatchPage;
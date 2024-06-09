import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VerificationPage = () => {
  const { token } = useParams(); // Get token from queryString in URL from email
  console.log(token);

  useEffect(() => {
    const t = {
        token: token,
    };
  
    const verifyEmail = async () => {
        try {
            const response = await fetch(`http://localhost:3001/verify-user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(t)
            });
      
          } catch (error) {
            console.error('Error:', error);
          }
    }

    verifyEmail();

    });

  return (
    <div>
      <p>Your account is now verified!</p>
    </div>
  );
};

export default VerificationPage;